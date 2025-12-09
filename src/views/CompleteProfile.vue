<template>
  <div class="container mx-auto px-4 py-8 md:py-16">
    <div class="w-full max-w-md mx-auto">
      <div class="text-center mb-4">
        <div class="inline-block p-2 bg-ico-surface rounded-full shadow-md mb-2">
          <img src="/logo.svg" alt="ICO Platform Logo" class="h-12 w-12" />
        </div>
        <h2 class="text-2xl font-bold text-ico-text">Complete Your Profile</h2>
        <p class="text-ico-text-secondary mt-1">
          {{ isExistingUser ? 'Link your wallet to your existing account.' : 'Just one more step to get you started.' }}
        </p>
      </div>
      <div class="bg-ico-surface rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
        <form @submit.prevent="handleSubmit" class="space-y-5">

          <div v-if="!isExistingUser">
            <label for="name" class="block text-sm font-medium text-ico-text mb-1">Full Name</label>
            <input id="name" v-model="form.name" type="text" :required="!isExistingUser" class="w-full px-4 py-2 rounded-lg border border-ico-border bg-color-input focus:outline-none focus:ring-2 focus:ring-ico-highlight text-black" placeholder="John Doe" />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-ico-text mb-1">Email Address</label>
            <div class="relative">
              <input id="email" v-model="form.email" type="email" required @input="handleEmailInput" class="w-full px-4 py-2 rounded-lg border border-ico-border bg-color-input focus:outline-none focus:ring-2 focus:ring-ico-highlight text-black" placeholder="example@email.com" />
              <LoaderIcon v-if="isCheckingEmail" class="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div v-if="isExistingUser">
            <label for="existing_password" class="block text-sm font-medium text-ico-text mb-1">Existing Password</label>
            <p class="text-xs text-ico-text-secondary mb-2">This email is already registered. Please enter your password to link your wallet.</p>
            <input id="existing_password" v-model="form.existing_password" type="password" required class="w-full px-4 py-2 rounded-lg border border-ico-border bg-color-input focus:outline-none focus:ring-2 focus:ring-ico-highlight text-black" placeholder="Enter your existing password" />
          </div>

          <div v-else class="space-y-5">
            <div>
              <label for="password" class="block text-sm font-medium text-ico-text mb-1">Create Password</label>
              <input id="password" v-model="form.password" type="password" :required="!isExistingUser" class="w-full px-4 py-2 rounded-lg border border-ico-border bg-color-input focus:outline-none focus:ring-2 focus:ring-ico-highlight text-black" placeholder="••••••••" />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-ico-text mb-1">Confirm Password</label>
              <input id="confirmPassword" v-model="form.password_confirmation" type="password" :required="!isExistingUser" class="w-full px-4 py-2 rounded-lg border border-ico-border bg-color-input focus:outline-none focus:ring-2 focus:ring-ico-highlight text-black" placeholder="••••••••" />
            </div>
          </div>

          <p class="text-xs text-ico-text-secondary">Your wallet address will be automatically linked to this profile.</p>
          <button type="submit" :disabled="authStore.loading" class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ico-highlight hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-70">
            <LoaderIcon v-if="authStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
            {{ authStore.loading ? 'Saving...' : (isExistingUser ? 'Link Wallet & Sign In' : 'Complete Registration') }}
          </button>
        </form>
      </div>
    </div>

    <TwoFactorAuthModal
      v-if="show2FAModal"
      :loading="isLoading"
      :error="twoFactorError"
      @close="show2FAModal = false"
      @submit="handle2FASubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/toast';
import api from '@/services/api'; // Import your api service
import { LoaderIcon } from 'lucide-vue-next';
import TwoFactorAuthModal from '@/components/TwoFactorAuthModal.vue';


const authStore = useAuthStore();
const router = useRouter();
// Add these new state variables for the 2FA flow
const isLoading = ref(false);
const show2FAModal = ref(false);
const verificationToken = ref('');
const twoFactorError = ref<string | null>(null);

// This form object holds all possible fields
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  existing_password: '',
});

// These refs control the dynamic state of the form
const isExistingUser = ref(false);
const isCheckingEmail = ref(false);
let debounceTimer: number;

onMounted(() => {
  if (!localStorage.getItem('temp_token')) {
    toast.error('Invalid session. Please start the login process again.');
    router.push('/login');
  }
});

// This function checks the email with the backend after the user stops typing
const checkEmailExistence = async () => {
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    isExistingUser.value = false;
    return;
  }
  isCheckingEmail.value = true;
  try {
    const response = await api.checkEmail(form.email);
    isExistingUser.value = response.data.exists;
  } catch (error) {
    console.error("Failed to check email:", error);
    isExistingUser.value = false;
  } finally {
    isCheckingEmail.value = false;
  }
};

// This debounces the API call to prevent spamming the server on every keystroke
const handleEmailInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    checkEmailExistence();
  }, 500); // Wait 500ms after user stops typing
};

// This handler now builds the correct payload based on the form's state
const handleSubmit = async () => {
  let payload: any = { name: form.name, email: form.email };
  if (isExistingUser.value) {
    if (!form.existing_password) return toast.error('Please enter your existing password to link your wallet.');
    payload.existing_password = form.existing_password;
  } else {
    if (!form.password) return toast.error('Please create a password.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters long.');
    if (form.password !== form.password_confirmation) return toast.error('Passwords do not match.');
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
  }

  try {

    isLoading.value = true;
    const response = await authStore.completeWalletRegistration(payload);

    if (response.status === '2fa_required') {
      verificationToken.value = response.temp_token;
      show2FAModal.value = true;
      isLoading.value = false; // Stop loading only if we are showing a modal
      return;
    }
    // else if (response.status === 'success') {
    //   // toast.success('Process complete! Redirecting...');
    //   // router.push(authStore.isAdmin ? "/admin" : "/");
    // }
    toast.success('Profile completed! Redirecting...');
  } catch (error: any) {
    const message = error.response?.data?.message || 'An error occurred.';
    toast.error(message);
    isLoading.value = false;
  }
};

// This new function handles the final 2FA verification step
const handle2FASubmit = async (code: string) => {
  isLoading.value = true;
  twoFactorError.value = null;
  try {
    // CHANGE: Use the store action instead of calling API directly.
    // The store action handles the redirect to localhost:3000 automatically.
    // ✅ FIX: Cast to any. This forces TS to accept it.
await authStore.verifyTwoFactor((verificationToken.value as any), code);

    // // Manually commit the final user and token to the store
    //   const { token, user } = response.data;
    //   authStore.token = token;
    //   authStore.user = user;
    //   authStore.isAuthenticated = true;
    //   localStorage.setItem("token", token);

    // // Clean up temporary items from the initial wallet connection
    // localStorage.removeItem('temp_token');
    // localStorage.removeItem('evm_address');

    // show2FAModal.value = false;
    // toast.success("Login successful!");
    // router.push(authStore.isAdmin ? "/admin" : "/");

  } catch (error: any) {
    const local_error = error.response?.data?.message || 'Verification failed.';
    toast.error(local_error);
  } finally {
    isLoading.value = false;
  }
};
</script>
