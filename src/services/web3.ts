import { createAppKit } from '@reown/appkit';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { BrowserProvider, type Eip1193Provider } from 'ethers';

// Your WalletConnect Cloud Project ID
const projectId = '99a4cd7c0be178dc88a4df50eceb7dd6';

// Your dApp's metadata
const metadata = {
  name: 'ICO Platform',
  description: 'ICO Platform Wallet Connection',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://auth.forkcake.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create the Reown AppKit instance
export const appKit = createAppKit({
  projectId,
  metadata,
  networks: [
    {
      // FIX 1: The property for the chain identifier is 'id'.
      id: 1,
      rpcUrls: {
        default: { http: ['https://cloudflare-eth.com'] }
      },
      name: 'Ethereum',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      blockExplorers: {
        default: { name: 'Etherscan', url: 'https://etherscan.io' }
      }
    },
  ],
  adapters: [
    // FIX 2: The EthersAdapter constructor takes no arguments.
    new EthersAdapter(),
  ],
   themeMode: 'dark',

});

/**
 * Connects to a wallet and returns the necessary ethers objects.
 * This final version uses the most reliable method: checking for a wallet provider.
 */
export const connect = (): Promise<{ provider: any; signer: any; address: string; }> => {
  return new Promise((resolve, reject) => {
    let settled = false;

    const unsubscribe = appKit.subscribeState(async (state) => {
      if (settled) return;

      // THE FIX: The definitive way to check for a connection is to see if a provider is available.
      const walletProvider = appKit.getWalletProvider();

      // Success Condition: A provider now exists.
      if (walletProvider) {
        settled = true;
        unsubscribe();
        try {
          const provider = new BrowserProvider(walletProvider as Eip1193Provider);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          resolve({ provider, signer, address });
        } catch (error) {
          reject(new Error('Failed to initialize provider after connection.'));
        }
      }
      // Cancellation Condition: The modal is closed and we still have no provider.
      else if (!state.open) {
        // Use a timeout to handle the race condition
        setTimeout(() => {
          // Re-check for a provider after the grace period.
          if (!appKit.getWalletProvider() && !settled) {
            settled = true;
            unsubscribe();
            reject(new Error('Wallet connection cancelled.'));
          }
        }, 200);
      }
    });

    // Open the modal to start the process
    appKit.open();
  });
};

/**
 * Prompts the user to sign a message.
 */
export const signMessage = async (signer: any, message: string) => {
  try {
    return await signer.signMessage(message);
  } catch (error: any) {
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('You rejected the signature request.');
    }
    throw new Error('Failed to sign the message.');
  }
};

/**
 * Disconnects the current wallet session.
 */
export const disconnect = async () => {
  await appKit.disconnect();
};

