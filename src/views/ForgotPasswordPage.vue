<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-ico-background to-ico-surface-secondary p-4"
  >
    <div
      class="w-full max-w-md bg-ico-surface rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95"
    >
      <div class="text-center mb-6">
        <div class="inline-block p-2 bg-ico-surface rounded-full shadow-md mb-2">
          <img src="/logo.svg" alt="ICO Platform Logo" class="h-10 w-10" />
        </div>
        <h1 class="text-2xl font-bold text-ico-text">
          {{ $t("forgotPassword.title") }}
        </h1>
        <p class="text-ico-text-secondary mt-1 text-sm">
          {{ getCurrentStepDescription() }}
        </p>
      </div>

      <div class="flex justify-between items-center mb-6 text-ico-text-secondary">
        <span :class="{'text-ico-highlight': step === 1}">{{ $t('forgotPassword.step1') }}</span>
        <div class="h-0.5 w-1/4 bg-ico-border"></div>
        <span :class="{'text-ico-highlight': step === 2 || step === 3}">{{ $t('forgotPassword.step2') }}</span>
        <div class="h-0.5 w-1/4 bg-ico-border"></div>
        <span :class="{'text-ico-highlight': step === 3}">{{ $t('forgotPassword.step3') }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="step === 1" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-ico-text mb-1">
              {{ $t("forgotPassword.email") }}
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              :disabled="isLoading"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                !formData.email || errorMessage ? 'border-color-error bg-opacity-5' : 'border-ico-border bg-color-input',
              ]"
              placeholder="example@email.com"
            />
          </div>
          <button
            type="submit"
            :disabled="!formData.email || isLoading"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ico-highlight hover:bg-ico-highlight/90 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LoaderIcon v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
            {{ isLoading ? $t("common.sending") : $t("forgotPassword.sendOTP") }}
          </button>
        </div>

        <div v-if="step === 2 || step === 3" class="space-y-4">
          <div>
            <label for="code" class="block text-sm font-medium text-ico-text mb-1">
              {{ $t("forgotPassword.securityCode") }}
            </label>
            <input
              id="code"
              v-model="formData.code"
              type="text"
              required
              maxlength="6"
              :disabled="isCodeVerified || isLoading"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                !formData.code || errorMessage ? 'border-color-error bg-opacity-5' : 'border-ico-border bg-color-input',
              ]"
              placeholder="••••••"
            />
          </div>

          <div class="space-y-4">
            <div>
              <label for="new-password" class="block text-sm font-medium text-ico-text mb-1">
                {{ $t("forgotPassword.newPassword") }}
              </label>
              <input
                id="new-password"
                v-model="formData.password"
                type="password"
                required
                :disabled="!isCodeVerified || isLoading"
                :class="[
                  'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  passwordError ? 'border-color-error bg-opacity-5' : 'border-ico-border bg-color-input',
                ]"
                placeholder="********"
              />
            </div>
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-ico-text mb-1">
                {{ $t("forgotPassword.confirmPassword") }}
              </label>
              <input
                id="confirm-password"
                v-model="formData.password_confirmation"
                type="password"
                required
                :disabled="!isCodeVerified || isLoading"
                :class="[
                  'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  passwordError ? 'border-color-error bg-opacity-5' : 'border-ico-border bg-color-input',
                ]"
                placeholder="********"
              />
              <p v-if="passwordError" class="mt-1 text-xs text-color-error">
                {{ passwordError }}
              </p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="!isButtonEnabled || isLoading"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ico-highlight hover:bg-ico-highlight/90 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LoaderIcon v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4" />
            {{ isLoading
                ? $t("forgotPassword.reseting")
                : (isCodeVerified ? $t("forgotPassword.resetButton") : $t("forgotPassword.verifyButton"))
            }}
          </button>

          <p v-if="!isCodeVerified" class="text-center text-sm text-ico-text-secondary">
             {{ $t('forgotPassword.hintEnterCode') }}
          </p>

          <button
            type="button"
            @click="resendCode"
            :disabled="resendTimer > 0 || isLoading || isCodeVerified"
            class="w-full text-center text-sm text-ico-text-secondary hover:text-ico-highlight transition-colors duration-200 disabled:text-ico-text-tertiary"
          >
            {{ resendTimer > 0 ? $t("forgotPassword.resendIn") + ` (${resendTimer}s)` : $t("forgotPassword.resendCode") }}
          </button>
        </div>

        <div
          v-if="errorMessage"
          class="p-3 rounded-lg bg-color-error bg-opacity-10 border border-color-error border-opacity-20 text-color-error text-sm text-center"
        >
          <AlertTriangleIcon class="inline-block h-4 w-4 mr-1" />
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="p-3 rounded-lg bg-color-success bg-opacity-10 border border-color-success border-opacity-20 text-color-success text-sm text-center"
        >
          <CheckCircleIcon class="inline-block h-4 w-4 mr-1" />
          {{ successMessage }}
        </div>
      </form>

      <div class="mt-6 text-center text-sm">
        <router-link
          to="/login"
          class="font-medium text-ico-highlight hover:text-ico-highlight/90 transition-colors flex items-center justify-center"
        >
          <ChevronLeftIcon class="h-4 w-4 mr-1" />
          {{ $t("forgotPassword.backToLogin") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";
import icoService from "@/services/api";
import { useAuthStore } from "@/store/auth";

import {
  LoaderIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
} from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// --- State ---
const step = ref(1); // 1: Enter Email, 2: Enter Code/Password, 3: Success/Done
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const passwordError = ref("");
const resendTimer = ref(0);
let timerInterval: ReturnType<typeof setInterval> | undefined;
const isCodeVerified = ref(false); // CRITICAL: Tracks if the code has passed verification

const formData = ref({
  email: "",
  code: "",
  password: "",
  password_confirmation: "",
  temp_token: "", // Generated after code verification
});

// --- Computed ---

// Button validation logic based on the current step/state
const isButtonEnabled = computed(() => {
  if (step.value === 1) {
    return formData.value.email.length > 0;
  }
  if (step.value === 2) {
    // If code is not yet verified, we need the code field filled
    if (!isCodeVerified.value) {
        return formData.value.code.length === 6;
    }
    // If code IS verified, we need the password fields validated
    return (
        formData.value.password.length >= 8 &&
        formData.value.password === formData.value.password_confirmation &&
        !passwordError.value // Ensure local validation passes
    );
  }
  // This should not be reached if step is > 2, but for safety:
  return false;
});

// --- Methods ---

function getCurrentStepDescription() {
  if (step.value === 1) return t("forgotPassword.description1");
  if (step.value === 2) return t("forgotPassword.description2");
  if (step.value === 3) return t("forgotPassword.description3");
  return "";
}

function startResendTimer() {
  resendTimer.value = 60; // Start at 60 seconds
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

// Handler for all steps
const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  passwordError.value = "";

  if (step.value === 1) {
    // === STEP 1: Send OTP ===
    await handleSendCode();
  } else if (step.value === 2) {
    // === STEP 2: Verify OTP or Password Reset ===

    if (!isCodeVerified.value) {
        // ACTION 1: Attempt to Verify the Code
        await handleVerifyCodeAndTransition();
    } else {
        // ACTION 2: Code is verified, attempt final Password Reset

        // --- Local Password Validation ---
        if (formData.value.password !== formData.value.password_confirmation) {
            passwordError.value = t("forgotPassword.passwordsDoNotMatch");
            return;
        }
        if (formData.value.password.length < 8) {
            passwordError.value = t("forgotPassword.passwordTooShort");
            return;
        }
        // --- End Local Validation ---

        await handlePasswordReset();
    }
  }
};

const handleVerifyCodeAndTransition = async () => {
    // 1. Verify Code (This generates the temp_token)
    const verificationSuccess = await handleVerifyCode();

    if (verificationSuccess) {
        isCodeVerified.value = true; // CRITICAL: Unlock the password fields
        toast.success(t("forgotPassword.codeVerified"));
    }
};

const handleSendCode = async () => {
  isLoading.value = true;
  try {
    const response = await icoService.post('/password/email', { email: formData.value.email });
    successMessage.value = response.data.message || t("forgotPassword.codeSent");
    step.value = 2;
    startResendTimer();
    toast.success(successMessage.value);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || t("forgotPassword.sendFailed");
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

const resendCode = async () => {
  if (resendTimer.value > 0) return;

  await handleSendCode();
  if (!errorMessage.value) {
      toast.success(t("forgotPassword.codeResent"));
  }
};

const handleVerifyCode = async (): Promise<boolean> => {
    isLoading.value = true;
    try {
        const response = await icoService.post('/password/verify', {
            email: formData.value.email,
            code: formData.value.code
        });

        // NOTE: .data is used here based on previous error resolution
        formData.value.temp_token = response.data.temp_token; // Store the token

        // Success: the token is saved
        return true;
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || t("forgotPassword.verificationFailed");
        toast.error(errorMessage.value);
        return false;
    } finally {
        isLoading.value = false;
    }
};

const handlePasswordReset = async () => {
    isLoading.value = true;
    try {
        // Validation for the token: should be present since isCodeVerified is true
        if (!formData.value.temp_token) {
            throw new Error(t("forgotPassword.verificationFailed"));
        }

        const response = await icoService.post('/password/reset', {
            temp_token: formData.value.temp_token,
            password: formData.value.password,
            password_confirmation: formData.value.password_confirmation,
        });

        // The resetPassword endpoint logs the user in and returns a token
        if (response.data.status === 'success' && response.data.token) {

            // Manually commit the token to the auth store
            await authStore.loginWithToken(response.data.token);

            successMessage.value = response.data.message || t("forgotPassword.resetSuccess");
            step.value = 3;
            toast.success(successMessage.value);

            // Redirect to home/dashboard
            setTimeout(() => {
                router.push(authStore.isAdmin ? "/admin" : "/");
            }, 2000);
        } else {
            throw new Error(response.data.message || t("forgotPassword.resetFailed"));
        }
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || error.message || t("forgotPassword.resetFailed");
        toast.error(errorMessage.value);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    // Clear any temporary tokens on page load
    formData.value.temp_token = '';
});

// Cleanup timer on component unmount
onUnmounted(() => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});
</script>

<style scoped>
/* Scoped styles for the form page if needed */
</style>
