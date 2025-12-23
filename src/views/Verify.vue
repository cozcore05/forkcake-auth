<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4" v-if="loading">Verifying your email...</h1>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
        v-if="loading"></div>
      <p class="text-gray-600" v-if="loading">Please wait while we verify your email.</p>
      <p class="text-green-600" v-if="success">{{ resonse_message }}</p>
      <p class="text-red-600" v-if="error">Verification failed. Please try again.{{ resonse_message }}</p>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import icoService from '@/services/api';
import { ref, onMounted } from 'vue';
import { toast } from '@/utils/toast';
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const hash = route.params.hash;
    const loading = ref(true);
    const success = ref(false);
    const error = ref(false);
    const resonse_message = ref('');
    const verifyEmail = async () => {
      try {
        console.log('Sending verification request with hash:', hash);
        const payload = { hash };
        const response = await icoService.verify(payload);

        if (response && (response.status === 200 || response.status === 201)) {
          // Extract the updated firm data
          console.log('32Verification successful:', response.data.message);

          success.value = true;
          loading.value = false;
          error.value = false;
          resonse_message.value = response.data.message || 'Email verified successfully';
          toast.success(resonse_message.value);
          // Check if the backend provided an auto-login URL
          if (response.data.redirect_url) {
             setTimeout(() => {
                window.location.href = response.data.redirect_url;
             }, 1500);
          } else {
             // Fallback for "Already Verified" or standard flow
             setTimeout(() => {
               router.push('/login');
             }, 2000);
          };
        } else {
          console.error('42Verification failed with unexpected status:', response.error);
          if (response.data && (response.data.error || response.data.message)) {
            resonse_message.value = response.data.error || response.data.message || 'Verification failed. Please try again.';
          } else {
            resonse_message.value = 'Verification failed. Please try again.';
          }
          console.error('Verification failed with status:', response.status);
          toast.error(resonse_message.value);
          error.value = true;
          success.value = false;
          loading.value = false;
        }

        // Redirect to login page after 2 seconds

      } catch (err) {
        console.error('Verification failed:', err);
        error.value = true;
        loading.value = false;
      }
    };

    onMounted(() => {
      console.log('Verify component mounted');
      verifyEmail();
    });

    return { loading, success, error };
  }
}
</script>
