import { createRouter, createWebHistory } from 'vue-router'
// Remove HomeView import if you don't need it
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login' // Redirect root to /login
    },
    {
      path: '/login',
      name: 'Login',
      // Lazy load the LoginPage component
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPasswordPage.vue')
    },
    {
      path: '/verify/hash/:hash',
      name: 'VerifyEmail',
      component: () => import('../views/Verify.vue')
    },

    {
      path: '/complete-profile',
      name: 'CompleteProfile',
      component: () => import('@/views/CompleteProfile.vue'),
    },


    // Add a catch-all route to redirect back to login for unknown paths
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
  ],
})

export default router
