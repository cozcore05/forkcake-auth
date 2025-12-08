import { defineStore } from "pinia"
import api from "@/services/api"

// import { signMessage, disconnect } from '@/services/web3';


import { toast } from "@/utils/toast";
import { maskToken } from "@/utils/tokenMask";

// Define the Main App URL (The destination)
const MAIN_APP_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:3000';

// Helper function to perform the Handshake Redirect
const redirectToMain = (token: string | null | undefined) => {
  // Fallback to empty string if token is null
  const safeToken = token || '';
  const maskedToken = maskToken(safeToken);
  window.location.href = `${MAIN_APP_URL}/auth/callback?token=${maskedToken}`;
};

interface User {
  id: number
  name: string
  email: string
  role?: string
  is_admin?: number | boolean // Supports both number and boolean types
  google2fa_enabled?: boolean;
  created_at?: string
  updated_at?: string
  developer?: any;
  unread_inquiries_count: number;
}

interface NetworkInfo {
  total_users: number
  total_investors: number
  total_projects: number
  join_date: string
}

interface ProfileData {
  user: User | null
  investor: any | null
  network_info: NetworkInfo | null
}

interface AuthState {
  user: User | null
  profileData: ProfileData
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  watchlistedProjectIds: Set<number>;
  watchlistedDeveloperIds: Set<number>;
  watchlistedAuditorIds: Set<number>;
  watchlistedVCFirmIds: Set<number>;
  watchlistLoading: boolean;
  watchlistedProjects: any[];
  watchlistedDevelopers: any[];
  watchlistedAuditors: any[];
  watchlistedVCFirms: any[];

}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    profileData: {
      user: null,
      investor: null,
      network_info: null,
    },
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
    // ADD THESE NEW PROPERTIES
    watchlistedProjectIds: new Set(),
    watchlistedDeveloperIds: new Set(),
    watchlistedAuditorIds: new Set(),
    watchlistedVCFirmIds: new Set(),
    watchlistLoading: true,
    watchlistedProjects: [],
    watchlistedDevelopers: [],
    watchlistedAuditors: [],
    watchlistedVCFirms: [],
  }),

  getters: {
    // FIXED: More robust isAdmin getter that handles both number and boolean types
    isAdmin(): boolean {


      if (!this.user) {

        return false
      }

      // Handle both boolean and numeric values
      const adminValue = this.user.is_admin === true || this.user.is_admin === 1
      console.log(
        `isAdmin: is_admin value is ${this.user.is_admin} (${typeof this.user.is_admin}), returning ${adminValue}`,
      )

      return adminValue
    },

    getUser: (state) => state.user,
  },

  actions: {

    async fetchWatchlist() {
      if (!this.isAuthenticated) {
        this.watchlistLoading = false;
        return;
      }
      this.watchlistLoading = true;
      try {
        const response = await api.getWatchlist();
        const data = response.data;

        // Populate the ID sets for the icons
        this.watchlistedProjectIds = new Set(data.projects?.ids || []);
        this.watchlistedDeveloperIds = new Set(data.developers?.ids || []);
        this.watchlistedAuditorIds = new Set(data.auditors?.ids || []);
        this.watchlistedVCFirmIds = new Set(data.vcfirms?.ids || []);

        // Populate the full data arrays for the watchlist page
        this.watchlistedProjects = data.projects?.data || [];
        this.watchlistedDevelopers = data.developers?.data || [];
        this.watchlistedAuditors = data.auditors?.data || [];
        this.watchlistedVCFirms = data.vcfirms?.data || [];

      } catch (error) {
        console.error("Failed to fetch watchlist", error);
        toast.error('Failed to load watchlist.');
      } finally {
        this.watchlistLoading = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.login({ email, password });
        const responseData = response.data; // Get the data from the Axios response

        // If login is a direct success (no 2FA), commit data to the store.
        if (responseData.status === 'success') {
          const { token } = responseData;
          // Redirect to Main App immediately
          redirectToMain(token || '');
          return;
        }

        // IMPORTANT: Return the whole response data so the login page can handle the 2FA step.
        return responseData;

      } catch (error: any) {
        this.error = error.response?.data?.message || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // This action now handles the multi-step wallet login and registration flow
    // This updates the 'signer' type to be compatible with ethers v6
    async loginWithWallet(signer: any, address: string) {
      this.loading = true;
      this.error = null;
      try {
        const web3Service = await import('@/services/web3');
        const challengeResponse = await api.getWalletChallenge(address);
        const message = challengeResponse.data.message;
        const signature = await web3Service.signMessage(signer, message);
        const verifyResponse = await api.verifyWalletSignature(address, signature);
        const responseData = verifyResponse.data;

        if (responseData.status === 'success') {
          const { token } = responseData;
          redirectToMain(token || '');
        } else if (responseData.status === 'profile_incomplete') {
          const { temp_token, evm_address } = responseData;
          localStorage.setItem('temp_token', temp_token);
          localStorage.setItem('evm_address', evm_address);
        }
        return responseData;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || "Wallet login failed";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // This new action handles the final step of the wallet registration
    async completeWalletRegistration(formData: any) {
      this.loading = true;
      this.error = null;
      try {
        const tempToken = localStorage.getItem('temp_token');
        if (!tempToken) throw new Error('Temporary session expired. Please try again.');

        const response = await api.completeWalletRegistration({ ...formData, token: tempToken });
        const responseData = response.data;

        if (responseData.status === 'success') {
          // Extract token first!
          const { token } = responseData;
          // Clean up temporary storage
          localStorage.removeItem('temp_token');
          localStorage.removeItem('evm_address');

          // Redirect to Main App
          redirectToMain(token || '');
        }
        return responseData;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Profile completion failed";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async verifyTwoFactor(tempToken: string | null | undefined, code: string) {
  this.loading = true;
  try {
    const safeToken = tempToken || '';
    const response = await api.verify2FACode(safeToken, code);
        const { token } = response.data;

    localStorage.removeItem('temp_token');
    localStorage.removeItem('evm_address');
    redirectToMain(token || '');
    return response.data;
  } catch (error: any) {
    throw error;
  } finally {
    this.loading = false;
  }
},

    async register(userData: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) {
      this.loading = true
      this.error = null

      try {
        const response = await api.register(userData)

        // Store token and user data
        const { token, user } = response.data

        // Success -> Redirect to Main App
        redirectToMain(token);
        return response.data;

        // Fetch profile data after registration
        // await this.fetchProfile()
        // await this.fetchWatchlist();

        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || "Registration failed"
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true

      try {
        // Call logout endpoint if user is authenticated
        if (this.isAuthenticated) {
          await api.logout()
        }
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        // 1. Safely disconnect wallet session
        // We wrap this in a try-catch so that if the web3 bundle fails to load
        // (causing the 'lh' reference error), the logout process continues anyway.
        try {
          const { disconnect } = await import('@/services/web3');
          await disconnect();
        } catch (e) {
          console.error("Web3 disconnect error (non-blocking):", e);
        }

        // 2. Clear all of our application's specific tokens and data
        localStorage.removeItem("token");
        localStorage.removeItem('temp_token');
        localStorage.removeItem('evm_address'); // Typo corrected from evm_address
        localStorage.removeItem('developerFormProgress');
        localStorage.removeItem('developerFormStep');
        localStorage.removeItem('auditorFormProgress');

        // 3. **ENHANCED CACHE CLEARING**: Aggressively find and remove all keys
        // related to wallet connectors from localStorage. This is the key fix.
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('wc@') ||         // WalletConnect v2
            key.startsWith('walletconnect') || // WalletConnect v1
            key.startsWith('rk-') ||          // Reown Kit Prefix
            key.startsWith('W3M_')           // Web3Modal Prefix
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // 4. Clear sessionStorage as an extra precaution
        sessionStorage.clear();

        // 5. Reset all state within the Pinia store
        this.token = null;
        this.user = null;
        this.profileData = {
          user: null,
          investor: null,
          network_info: null,
        };
        this.isAuthenticated = false;

        // 6. **FORCE RELOAD**: Redirect to the login page using a full page reload.
        // This is more effective than router.push() for clearing all cached states.
        window.location.href = '/login';

        // The page is reloading, so we don't need to set loading to false.
      }
    },

    async fetchUser() {
      if (!this.token) return

      this.loading = true

      try {
        const response = await api.getUser()
        // Store the core user object
        this.user = response.data.user
        // Store the associated investor data in profileData
        this.profileData.investor = response.data.investor
        this.isAuthenticated = true

        await this.fetchWatchlist();
      } catch (error) {
        this.logout()
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      if (!this.token) return

      this.loading = true
      this.error = null

      try {
        const response = await api.getProfile()

        // This ONLY updates the extra profile data,
        // leaving the main this.user object untouched.
        this.profileData.investor = response.data.investor
        this.profileData.network_info = response.data.network_info

        return this.profileData
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to fetch profile"

        // If unauthorized, logout
        if (error.response?.status === 401) {
          this.logout()
        }

        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithToken(token: string) {
      this.loading = true;
      this.error = null;
      try {
        // 1. Set the token and authentication status
        this.token = token;
        this.isAuthenticated = true;
        localStorage.setItem("token", token);

        // 2. Fetch the full user profile to populate state
        await this.fetchUser();

        // 3. Navigate the user (handled in LoginPage.vue or router guard)
        return { status: 'success' };

      } catch (error: any) {
        this.error = "Token login failed. Please try again.";
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

  },
})
