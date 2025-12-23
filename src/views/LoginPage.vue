<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-ico-background to-ico-surface-secondary p-4 relative overflow-hidden"
  >
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-20 -right-20 w-96 h-96 bg-ico-highlight opacity-5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-32 -left-20 w-96 h-96 bg-color-secondary opacity-5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/4 left-1/4 w-64 h-64 bg-color-accent opacity-5 rounded-full blur-3xl"
      ></div>

      <!-- Animated floating shapes -->
      <div
        v-for="shape in shapes"
        :key="shape.id"
        class="absolute rounded-full opacity-10"
        :class="shape.color"
        :style="{
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          top: `${shape.top}%`,
          left: `${shape.left}%`,
          animationDelay: `${shape.delay}s`,
          animationDuration: `${shape.duration}s`,
        }"
      ></div>
    </div>

    <!-- Theme toggle button -->
    <button
      @click="toggleTheme"
      class="absolute top-4 right-4 p-2 rounded-full bg-ico-surface bg-opacity-80 backdrop-blur-sm text-ico-text-secondary hover:text-ico-text transition-colors z-10"
      aria-label="Toggle theme"
    >
      <SunIcon v-if="themeStore.isDarkMode" class="h-5 w-5" />
      <MoonIcon v-else class="h-5 w-5" />
    </button>

    <!-- Language selector -->
    <div class="absolute top-4 left-4 z-10">
      <div class="relative">
        <button
          @click="isLanguageMenuOpen = !isLanguageMenuOpen"
          class="flex items-center space-x-1 p-2 rounded-full bg-ico-surface bg-opacity-80 backdrop-blur-sm text-ico-text-secondary hover:text-ico-text transition-colors"
        >
          <GlobeIcon class="h-5 w-5" />
          <span class="text-sm hidden sm:inline">{{ currentLanguage }}</span>
          <ChevronDownIcon
            class="h-4 w-4"
            :class="{ 'rotate-180': isLanguageMenuOpen }"
          />
        </button>

        <div
          v-if="isLanguageMenuOpen"
          class="absolute mt-2 w-40 rounded-md shadow-lg bg-ico-surface ring-1 ring-ico-border z-20"
        >
          <div class="py-1">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-2 text-sm text-ico-text hover:bg-ico-surface-hover flex items-center"
              :class="{
                'bg-ico-surface-hover': currentLanguageCode === lang.code,
              }"
            >
              <span class="mr-2">{{ lang.flag }}</span>
              {{ lang.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Account Button (top right corner) - Only show if logged in -->
    <div v-if="authStore.isAuthenticated" class="absolute top-4 right-16 z-10">
      <div class="relative">
        <button
          @click="toggleUserMenu"
          class="flex items-center justify-center h-10 w-10 rounded-full bg-[#1a2234] text-ico-text-secondary hover:text-ico-text transition-colors relative"
          aria-label="User menu"
        >
          <UserIcon class="h-5 w-5" />
          <!-- Notification dot -->
          <div
            v-if="hasNotifications"
            class="absolute top-0 right-0 w-2 h-2 bg-color-error rounded-full"
          ></div>
        </button>

        <!-- User Menu Dropdown -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-56 bg-ico-surface border border-ico-border rounded-md shadow-lg overflow-hidden z-20"
        >
          <div class="px-3 py-3 border-b border-ico-border">
            <div class="font-medium text-ico-text">
              {{ authStore.user?.name || $t("userAccount.name") }}
            </div>
            <div class="text-xs text-ico-text-secondary">
              {{ authStore.user?.email || $t("userAccount.email") }}
            </div>
          </div>

          <div class="py-1">
            <a
              href="#"
              class="flex items-center px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <DollarSignIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
              {{ $t("userAccount.rewards") }}
            </a>

            <a
              href="#"
              class="flex items-center px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <PencilIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
              {{ $t("userAccount.studio") }}
            </a>

            <a
              href="#"
              class="flex items-center justify-between px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <div class="flex items-center">
                <UserIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
                {{ $t("userAccount.profile") }}
              </div>
              <ChevronRightIcon class="h-4 w-4 text-ico-text-tertiary" />
            </a>

            <a
              href="#"
              class="flex items-center justify-between px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <div class="flex items-center">
                <FileTextIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
                {{ $t("userAccount.resources") }}
              </div>
              <ChevronRightIcon class="h-4 w-4 text-ico-text-tertiary" />
            </a>

            <a
              href="#"
              class="flex items-center justify-between px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <div class="flex items-center">
                <SettingsIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
                {{ $t("userAccount.settings") }}
              </div>
              <ChevronRightIcon class="h-4 w-4 text-ico-text-tertiary" />
            </a>

            <a
              href="#"
              class="flex items-center px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <HelpCircleIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
              {{ $t("userAccount.support") }}
            </a>

            <a
              href="#"
              class="flex items-center px-4 py-2.5 text-sm text-ico-text-secondary hover:bg-ico-surface-hover transition-colors"
            >
              <MaximizeIcon class="h-5 w-5 mr-3 text-ico-text-tertiary" />
              {{ $t("userAccount.expand") }}
            </a>

            <div class="border-t border-ico-border mt-1">
              <button
                @click="logout"
                class="flex items-center w-full px-4 py-2.5 text-sm text-color-error hover:bg-ico-surface-hover transition-colors"
              >
                <LogOutIcon class="h-5 w-5 mr-3" />
                {{ $t("userAccount.logout") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isModalConnecting"
      class="fixed inset-0 bg-ico-background bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ico-highlight"
        ></div>
        <p class="text-ico-text-secondary mt-4 text-sm">
          {{ $t("login.finalizingConnection") }}
        </p>
      </div>
    </div>

    <div class="w-full max-w-md" :class="{ 'force-behind': isModalConnecting }">
      <!-- Logo and Title -->
      <div class="text-center mb-4 animate-fade-in">
        <div
          class="inline-block p-2 bg-ico-surface rounded-full shadow-md mb-2"
        >
          <img src="/logo.svg" alt="ICO Platform Logo" class="h-12 w-12" />
        </div>
        <p class="text-ico-text-secondary mt-1">{{ $t("login.subtitle") }}</p>
      </div>

      <!-- Login Form Card -->
      <div
        class="bg-ico-surface rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 animate-slide-up"
      >
        <!-- Login Tabs -->
        <div class="flex border-b border-ico-border mb-6">
          <button
            @click="activeTab = 'credentials'"
            class="pb-2 px-1 text-sm font-medium transition-colors relative flex-1 text-center"
            :class="
              activeTab === 'credentials'
                ? 'text-ico-highlight'
                : 'text-ico-text-secondary hover:text-ico-text'
            "
          >
            {{ $t("login.emailLogin") }}
            <div
              class="absolute bottom-0 left-0 w-full h-0.5 bg-ico-highlight transform transition-transform duration-300"
              :class="activeTab === 'credentials' ? 'scale-x-100' : 'scale-x-0'"
            ></div>
          </button>
          <button
            @click="activeTab = 'wallet'"
            class="pb-2 px-1 text-sm font-medium transition-colors relative flex-1 text-center"
            :class="
              activeTab === 'wallet'
                ? 'text-ico-highlight'
                : 'text-ico-text-secondary hover:text-ico-text'
            "
          >
            {{ $t("login.walletLogin") }}
            <div
              class="absolute bottom-0 left-0 w-full h-0.5 bg-ico-highlight transform transition-transform duration-300"
              :class="activeTab === 'wallet' ? 'scale-x-100' : 'scale-x-0'"
            ></div>
          </button>
          <button
            @click="activeTab = 'signup'"
            class="pb-2 px-1 text-sm font-medium transition-colors relative flex-1 text-center"
            :class="
              activeTab === 'signup'
                ? 'text-ico-highlight'
                : 'text-ico-text-secondary hover:text-ico-text'
            "
          >
            {{ $t("signup.signupTab") }}
            <div
              class="absolute bottom-0 left-0 w-full h-0.5 bg-ico-highlight transform transition-transform duration-300"
              :class="activeTab === 'signup' ? 'scale-x-100' : 'scale-x-0'"
            ></div>
          </button>
        </div>

        <!-- Credentials Login Form -->
        <form
          v-if="activeTab === 'credentials'"
          @submit.prevent="handleLogin"
          class="space-y-5"
        >
          <!-- Email Field -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-ico-text mb-1"
            >
              {{ $t("login.email") }}
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                :class="[
                  'w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  emailError
                    ? 'border-color-error bg-color-error bg-opacity-5'
                    : 'border-ico-border bg-color-input',
                ]"
                placeholder="example@email.com"
                @input="validateEmail"
                @blur="validateEmail"
              />
              <MailIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ico-text-secondary"
              />
              <CheckCircleIcon
                v-if="email && !emailError"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-color-success"
              />
              <AlertCircleIcon
                v-if="emailError"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-color-error"
              />
            </div>
            <p v-if="emailError" class="mt-1 text-xs text-color-error">
              {{ emailError }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label
                for="password"
                class="block text-sm font-medium text-ico-text"
              >
                {{ $t("login.password") }}
              </label>
              <router-link
                to="/forgot-password"
                class="text-xs text-ico-highlight hover:text-color-primary-hover transition-colors"
              >
                {{ $t("login.forgotPassword") }}
              </router-link>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :class="[
                  'w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  passwordError
                    ? 'border-color-error bg-color-error bg-opacity-5'
                    : 'border-ico-border bg-color-input',
                ]"
                placeholder="••••••••"
                @input="validatePassword"
                @blur="validatePassword"
              />
              <LockIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ico-text-secondary"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-ico-text-secondary hover:text-ico-text transition-colors"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-xs text-color-error">
              {{ passwordError }}
            </p>

            <!-- Password strength indicator (when typing) -->
            <!-- <div v-if="password && !passwordError" class="mt-1">
              <div class="flex space-x-1">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="h-1 flex-1 rounded-full transition-colors duration-300"
                  :class="getPasswordStrengthClass(n)"
                ></div>
              </div>
              <p class="text-xs mt-1" :class="getPasswordStrengthTextClass()">
                {{ getPasswordStrengthText() }}
              </p>
            </div> -->
          </div>

          <!-- Security Options -->
          <div class="hidden flex-col space-y-3">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-ico-highlight focus:ring-ico-highlight border-ico-border rounded"
                disabled
                v-tooltip.top="'This feature is coming soon.'"
              />
              <label for="remember-me" class="ml-2 block text-sm text-ico-text"
               :class="{ 'opacity-50': true }">
                {{ $t("login.rememberMe") }}

              </label>
              <InfoIcon
                class="ml-1 h-4 w-4 text-ico-text-secondary cursor-help"
                @mouseenter="showRememberTooltip = true"
                @mouseleave="showRememberTooltip = false"
              />
              <div
                v-if="showRememberTooltip"
                class="absolute mt-1 ml-6 p-2 bg-ico-surface-secondary text-ico-text text-xs rounded shadow-lg max-w-xs z-10"
              >
                {{ $t("login.rememberMeTooltip") }}
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="trusted-device"
                v-model="trustedDevice"
                type="checkbox"
                class="h-4 w-4 text-ico-highlight focus:ring-ico-highlight border-ico-border rounded"
                disabled
                v-tooltip.top="'This feature is coming soon.'"
              />
              <label
                for="trusted-device"
                class="ml-2 block text-sm text-ico-text"
                :class="{ 'opacity-50': true }"
              >
                {{ $t("login.trustDevice") }}
              </label>
              <InfoIcon
                class="ml-1 h-4 w-4 text-ico-text-secondary cursor-help"
                @mouseenter="showTrustTooltip = true"
                @mouseleave="showTrustTooltip = false"
              />
              <div
                v-if="showTrustTooltip"
                class="absolute mt-1 ml-6 p-2 bg-ico-surface-secondary text-ico-text text-xs rounded shadow-lg max-w-xs z-10"
              >
                {{ $t("login.trustDeviceTooltip") }}
              </div>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full flex justify-center items-center py-1.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ico-highlight hover:bg-color-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ico-highlight transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LoaderIcon
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
            />
            {{ isLoading ? $t("login.loggingIn") : $t("login.loginButton") }}
          </button>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="p-3 rounded-lg bg-color-error bg-opacity-10 border border-color-error border-opacity-20 text-color-error text-sm text-center"
          >
            <AlertTriangleIcon class="inline-block h-4 w-4 mr-1" />
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="p-3 rounded-lg bg-color-success bg-opacity-10 border border-color-success border-opacity-20 text-color-success text-sm text-center"
          >
            <CheckCircleIcon class="inline-block h-4 w-4 mr-1" />
            {{ successMessage }}
          </div>
        </form>

        <!-- Wallet Login -->
        <div v-else-if="activeTab === 'wallet'" class="space-y-5">
          <p class="text-sm text-ico-text-secondary text-center mb-4">
            {{ $t("login.walletDescription") }}
          </p>

          <button
            @click="handleWalletConnect"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ico-highlight hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ico-highlight transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LoaderIcon
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
            />
            {{ isLoading ? "Connecting..." : "Connect Wallet" }}
          </button>

          <div
            v-if="walletError"
            class="p-3 rounded-lg bg-color-error bg-opacity-10 border border-color-error border-opacity-20 text-color-error text-sm text-center"
          >
            <AlertTriangleIcon class="inline-block h-4 w-4 mr-1" />
            {{ walletError }}
          </div>
        </div>

        <!-- Signup Form -->
        <form
          v-else-if="activeTab === 'signup'"
          @submit.prevent="handleSignup"
          class="space-y-5"
        >
          <!-- Name Field -->
          <div>
            <label
              for="signup-name"
              class="block text-sm font-medium text-ico-text mb-1"
            >
              {{ $t("signup.name") }}
            </label>
            <div class="relative">
              <input
                id="signup-name"
                v-model="signupForm.name"
                type="text"
                required
                :class="[
                  'w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  signupErrors.name
                    ? 'border-color-error bg-color-error bg-opacity-5'
                    : 'border-ico-border bg-color-input',
                ]"
                placeholder="John Doe"
                @input="validateSignupName"
                @blur="validateSignupName"
              />
              <UserIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ico-text-secondary"
              />
              <CheckCircleIcon
                v-if="signupForm.name && !signupErrors.name"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-color-success"
              />
              <AlertCircleIcon
                v-if="signupErrors.name"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-color-error"
              />
            </div>
            <p v-if="signupErrors.name" class="mt-1 text-xs text-color-error">
              {{ signupErrors.name }}
            </p>
          </div>

          <!-- Email Field -->
          <div>
            <label
              for="signup-email"
              class="block text-sm font-medium text-ico-text mb-1"
            >
              {{ $t("signup.email") }}
            </label>
            <div class="relative">
              <input
                id="signup-email"
                v-model="signupForm.email"
                type="email"
                required
                :class="[
                  'w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  signupErrors.email
                    ? 'border-color-error bg-color-error bg-opacity-5'
                    : 'border-ico-border bg-color-input',
                ]"
                placeholder="example@email.com"
                @input="validateSignupEmail"
                @blur="validateSignupEmail"
              />
              <MailIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ico-text-secondary"
              />
              <CheckCircleIcon
                v-if="signupForm.email && !signupErrors.email"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-color-success"
              />
              <AlertCircleIcon
                v-if="signupErrors.email"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-color-error"
              />
            </div>
            <p v-if="signupErrors.email" class="mt-1 text-xs text-color-error">
              {{ signupErrors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="signup-password"
              class="block text-sm font-medium text-ico-text mb-1"
            >
              {{ $t("signup.password") }}
            </label>
            <div class="relative">
              <input
                id="signup-password"
                v-model="signupForm.password"
                :type="showSignupPassword ? 'text' : 'password'"
                required
                :class="[
                  'w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  signupErrors.password
                    ? 'border-color-error bg-color-error bg-opacity-5'
                    : 'border-ico-border bg-color-input',
                ]"
                placeholder="••••••••"
                @input="validateSignupPassword"
                @blur="validateSignupPassword"
              />
              <LockIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ico-text-secondary"
              />
              <button
                type="button"
                @click="showSignupPassword = !showSignupPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-ico-text-secondary hover:text-ico-text transition-colors"
              >
                <EyeIcon v-if="!showSignupPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p
              v-if="signupErrors.password"
              class="mt-1 text-xs text-color-error"
            >
              {{ signupErrors.password }}
            </p>

            <!-- Password strength indicator -->
            <div
              v-if="signupForm.password && !signupErrors.password"
              class="mt-1"
            >
              <div class="flex space-x-1">
                <div
                  v-for="n in 4"
                  :key="n"
                  class="h-1 flex-1 rounded-full transition-colors duration-300"
                  :class="getSignupPasswordStrengthClass(n)"
                ></div>
              </div>
              <p
                class="text-xs mt-1"
                :class="getSignupPasswordStrengthTextClass()"
              >
                {{ getSignupPasswordStrengthText() }}
              </p>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label
              for="signup-confirm-password"
              class="block text-sm font-medium text-ico-text mb-1"
            >
              {{ $t("signup.confirmPassword") }}
            </label>
            <div class="relative">
              <input
                id="signup-confirm-password"
                v-model="signupForm.confirmPassword"
                :type="showSignupConfirmPassword ? 'text' : 'password'"
                required
                :class="[
                  'w-full px-4 py-2 pl-10 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ico-highlight focus:border-transparent text-black',
                  signupErrors.confirmPassword
                    ? 'border-color-error bg-color-error bg-opacity-5'
                    : 'border-ico-border bg-color-input',
                ]"
                placeholder="••••••••"
                @input="validateSignupConfirmPassword"
                @blur="validateSignupConfirmPassword"
              />
              <LockIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ico-text-secondary"
              />
              <button
                type="button"
                @click="showSignupConfirmPassword = !showSignupConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-ico-text-secondary hover:text-ico-text transition-colors"
              >
                <EyeIcon v-if="!showSignupConfirmPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p
              v-if="signupErrors.confirmPassword"
              class="mt-1 text-xs text-color-error"
            >
              {{ signupErrors.confirmPassword }}
            </p>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <input
              id="terms-agreement"
              v-model="signupForm.agreeToTerms"
              type="checkbox"
              class="h-4 w-4 text-ico-highlight focus:ring-ico-highlight border-ico-border rounded mt-0.5"
            />
            <label
              for="terms-agreement"
              class="ml-2 block text-sm text-ico-text"
            >
              {{ $t("signup.agreeToTerms") }}
              <router-link
                to="/terms"
                class="text-ico-highlight hover:text-color-primary-hover transition-colors"
              >
                {{ $t("signup.termsOfService") }}
              </router-link>
              {{ $t("signup.and") }}
              <router-link
                to="/privacy"
                class="text-ico-highlight hover:text-color-primary-hover transition-colors"
              >
                {{ $t("signup.privacyPolicy") }}
              </router-link>
            </label>
          </div>

          <!-- Signup Button -->
          <button
            type="submit"
            :disabled="isSignupLoading || !isSignupFormValid"
            class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-ico-highlight hover:bg-color-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ico-highlight transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LoaderIcon
              v-if="isSignupLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
            />
            {{
              isSignupLoading
                ? $t("signup.signingUp")
                : $t("signup.signupButton")
            }}
          </button>

          <!-- Error Message -->
          <div
            v-if="signupErrorMessage"
            class="p-3 rounded-lg bg-color-error bg-opacity-10 border border-color-error border-opacity-20 text-color-error text-sm text-center"
          >
            <AlertTriangleIcon class="inline-block h-4 w-4 mr-1" />
            {{ signupErrorMessage }}
          </div>

          <!-- Success Message -->
          <div
            v-if="signupSuccessMessage"
            class="p-3 rounded-lg bg-color-success bg-opacity-10 border border-color-success border-opacity-20 text-color-success text-sm text-center"
          >
            <CheckCircleIcon class="inline-block h-4 w-4 mr-1" />
            {{ signupSuccessMessage }}
          </div>
        </form>

        <!-- Social Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-ico-border"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-ico-surface text-ico-text-secondary">
                {{ $t("login.orContinueWith") }}
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              @click="socialLogin('google')"
              v-tooltip.top="
                $t('login.socialLoginTooltip', { provider: 'Google' })
              "
              class="w-full inline-flex justify-center py-2.5 px-4 border border-ico-border rounded-lg shadow-sm bg-ico-surface-secondary text-ico-text hover:bg-ico-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ico-highlight transition-all duration-200"
            >
              <span class="sr-only">Sign in with Google</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.0003 12.7997V11.2397H23.5103C23.6303 11.9797 23.6903 12.8797 23.6903 13.7997C23.6903 20.9197 18.9903 24.0097 12.0003 24.0097C5.06031 24.0097 0.000305176 18.6697 0.000305176 12.0097C0.000305176 5.34975 5.06031 0.00975418 12.0003 0.00975418C15.9303 0.00975418 18.7803 1.70975 20.8903 3.69975L17.7503 6.84975C16.1403 5.41975 14.3303 4.54975 12.0003 4.54975C8.01031 4.54975 4.88031 7.74975 4.88031 12.0097C4.88031 16.2697 8.01031 19.4697 12.0003 19.4697C14.7303 19.4697 16.5903 18.4197 17.8403 17.2297C19.0603 16.0397 19.7403 14.3797 19.9503 13.0197H12.0003V12.7997Z"/>
              </svg>
            </button>
            <button
              type="button"
              @click="socialLogin('twitter')"
              v-tooltip.top="
                $t('login.socialLoginTooltip', { provider: 'Twitter' })
              "
              class="w-full inline-flex justify-center py-2.5 px-4 border border-ico-border rounded-lg shadow-sm bg-ico-surface-secondary text-ico-text hover:bg-ico-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ico-highlight transition-all duration-200"
            >
              <span class="sr-only">Sign in with Twitter</span>
              <TwitterIcon class="h-5 w-5" />
            </button>
            <button
              type="button"
              @click="socialLogin('github')"
              v-tooltip.top="
                $t('login.socialLoginTooltip', { provider: 'GitHub' })
              "
              class="w-full inline-flex justify-center py-2.5 px-4 border border-ico-border rounded-lg shadow-sm bg-ico-surface-secondary text-ico-text hover:bg-ico-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ico-highlight transition-all duration-200"
            >
              <span class="sr-only">Sign in with GitHub</span>
              <GithubIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Login Link (for signup tab) -->
        <div v-if="activeTab === 'signup'" class="mt-6 text-center text-sm">
          <span class="text-ico-text-secondary">{{
            $t("signup.alreadyHaveAccount")
          }}</span>
          <button
            @click="activeTab = 'credentials'"
            class="ml-1 font-medium text-ico-highlight hover:text-color-primary-hover transition-colors"
          >
            {{ $t("signup.loginLink") }}
          </button>
        </div>

        <!-- Register Link (for login tab) -->
        <div v-else class="mt-6 text-center text-sm">
          <span class="text-ico-text-secondary">{{
            $t("login.noAccount")
          }}</span>
          <button
            @click="activeTab = 'signup'"
            class="ml-1 font-medium text-ico-highlight hover:text-color-primary-hover transition-colors"
          >
            {{ $t("login.registerLink") }}
          </button>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="mt-6 text-center">
        <button
          @click="showSecurityInfo = !showSecurityInfo"
          class="inline-flex items-center text-xs text-ico-text-secondary hover:text-ico-text transition-colors"
        >
          <ShieldIcon class="h-4 w-4 mr-1" />
          {{ $t("login.securityInfo") }}
          <ChevronDownIcon
            class="h-4 w-4 ml-1"
            :class="{ 'rotate-180': showSecurityInfo }"
          />
        </button>
        <div
          v-if="showSecurityInfo"
          class="mt-2 p-3 bg-ico-surface bg-opacity-80 backdrop-blur-sm rounded-lg text-xs text-ico-text-secondary text-left"
        >
          <p class="mb-2">{{ $t("login.securityNotice") }}</p>
          <ul class="list-disc list-inside space-y-1">
            <li>{{ $t("login.securityTip1") }}</li>
            <li>{{ $t("login.securityTip2") }}</li>
            <li>{{ $t("login.securityTip3") }}</li>
          </ul>
        </div>
      </div>
    </div>
    <TwoFactorAuthModal
      v-if="show2FAModal"
      :loading="isLoading"
      :error="twoFactorError"
      @close="show2FAModal = false"
      @submit="handle2FASubmit"
    />
    <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ico-background bg-opacity-80 backdrop-blur-lg"
  >
    <LoadingSpinner />
    <p class="mt-4 text-ico-text-secondary">
      {{ $t("login.loggingIn") }}...
    </p>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useThemeStore } from "../store/theme";
import TwoFactorAuthModal from "@/components/TwoFactorAuthModal.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useAuthStore } from "../store/auth";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";

import icoService from "@/services/api";

import {
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  MailIcon,
  LockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  SunIcon,
  MoonIcon,
  InfoIcon,
  GlobeIcon,
  ChevronDownIcon,
  ShieldIcon,
  UserIcon,
  DollarSignIcon,
  PencilIcon,
  FileTextIcon,
  SettingsIcon,
  HelpCircleIcon,
  MaximizeIcon,
  LogOutIcon,
  ChevronRightIcon,
  TwitterIcon,
  GithubIcon,
} from "lucide-vue-next";

// Theme store and router
const themeStore = useThemeStore();
const authStore = useAuthStore();
const router = useRouter();
const { t, locale } = useI18n();

// Form state - Credentials
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const trustedDevice = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const emailError = ref("");
const passwordError = ref("");
const passwordStrength = ref(0);
const showRememberTooltip = ref(false);
const showTrustTooltip = ref(false);
const isModalConnecting = ref(false);
const show2FAModal = ref(false);
const twoFactorToken = ref("");
const twoFactorError = ref<string | null>(null);

// Signup form state
const signupForm = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

const signupErrors = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const showSignupPassword = ref(false);
const showSignupConfirmPassword = ref(false);
const isSignupLoading = ref(false);
const signupErrorMessage = ref("");
const signupSuccessMessage = ref("");
const signupPasswordStrength = ref(0);

// Wallet state
const walletError = ref("");
const wallets = ref([
  { id: "metamask", name: "MetaMask" },
  { id: "walletconnect", name: "WalletConnect" },
  { id: "coinbase", name: "Coinbase" },
  { id: "phantom", name: "Phantom" },
]);

// UI state
const activeTab = ref("credentials");
const showSecurityInfo = ref(false);
const isLanguageMenuOpen = ref(false);
const currentLanguageCode = ref("en");
const languages = ref([
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
]);

// User account state
const showUserMenu = ref(false);
const hasNotifications = ref(true);

// Decorative background shapes
const shapes = ref([
  {
    id: 1,
    size: 80,
    top: 15,
    left: 10,
    color: "bg-ico-highlight",
    delay: 0,
    duration: 20,
  },
  {
    id: 2,
    size: 60,
    top: 60,
    left: 20,
    color: "bg-color-secondary",
    delay: 2,
    duration: 25,
  },
  {
    id: 3,
    size: 40,
    top: 30,
    left: 80,
    color: "bg-color-accent",
    delay: 1,
    duration: 22,
  },
  {
    id: 4,
    size: 70,
    top: 70,
    left: 70,
    color: "bg-ico-highlight",
    delay: 3,
    duration: 18,
  },
  {
    id: 5,
    size: 50,
    top: 40,
    left: 40,
    color: "bg-color-secondary",
    delay: 4,
    duration: 15,
  },
]);

// Computed properties
const currentLanguage = computed(() => {
  return (
    languages.value.find((lang) => lang.code === currentLanguageCode.value)
      ?.name || "English"
  );
});

const isFormValid = computed(() => {
  return (
    email.value && password.value && !emailError.value && !passwordError.value
  );
});

const isSignupFormValid = computed(() => {
  return (
    signupForm.value.name &&
    signupForm.value.email &&
    signupForm.value.password &&
    signupForm.value.confirmPassword &&
    signupForm.value.agreeToTerms &&
    !signupErrors.value.name &&
    !signupErrors.value.email &&
    !signupErrors.value.password &&
    !signupErrors.value.confirmPassword
  );
});

// Methods
function toggleTheme() {
  themeStore.toggleTheme();
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    isLanguageMenuOpen.value = false;
  }
}

function changeLanguage(code: string) {
  currentLanguageCode.value = code;
  locale.value = code;
  isLanguageMenuOpen.value = false;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login validation functions
function validateEmail() {
  if (!email.value) {
    emailError.value = t("login.emailRequired");
  } else if (!emailRegex.test(email.value)) {
    emailError.value = t("login.invalidEmail");
  } else {
    emailError.value = "";
  }
}

function validatePassword() {
  if (!password.value) {
    passwordError.value = t("login.passwordRequired");
    passwordStrength.value = 0;
  } else if (password.value.length < 8) {
    passwordError.value = t("login.passwordTooShort");
    passwordStrength.value = 1;
  } else {
    passwordError.value = "";
    // Calculate password strength
    let strength = 0;
    if (password.value.length >= 8) strength += 1;
    if (/[A-Z]/.test(password.value)) strength += 1;
    if (/[0-9]/.test(password.value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password.value)) strength += 1;
    passwordStrength.value = strength;
  }
}

// Signup validation functions
function validateSignupName() {
  if (!signupForm.value.name) {
    signupErrors.value.name = t("signup.nameRequired");
  } else if (signupForm.value.name.length < 2) {
    signupErrors.value.name = t("signup.nameTooShort");
  } else {
    signupErrors.value.name = "";
  }
}

function validateSignupEmail() {
  if (!signupForm.value.email) {
    signupErrors.value.email = t("signup.emailRequired");
  } else if (!emailRegex.test(signupForm.value.email)) {
    signupErrors.value.email = t("signup.invalidEmail");
  } else {
    signupErrors.value.email = "";
  }
}

function validateSignupPassword() {
  if (!signupForm.value.password) {
    signupErrors.value.password = t("signup.passwordRequired");
    signupPasswordStrength.value = 0;
  } else if (signupForm.value.password.length < 8) {
    signupErrors.value.password = t("signup.passwordTooShort");
    signupPasswordStrength.value = 1;
  } else {
    signupErrors.value.password = "";
    // Calculate password strength
    let strength = 0;
    if (signupForm.value.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(signupForm.value.password)) strength += 1;
    if (/[0-9]/.test(signupForm.value.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(signupForm.value.password)) strength += 1;
    signupPasswordStrength.value = strength;
  }

  // Re-validate confirm password if it exists
  if (signupForm.value.confirmPassword) {
    validateSignupConfirmPassword();
  }
}

function validateSignupConfirmPassword() {
  if (!signupForm.value.confirmPassword) {
    signupErrors.value.confirmPassword = t("signup.confirmPasswordRequired");
  } else if (signupForm.value.password !== signupForm.value.confirmPassword) {
    signupErrors.value.confirmPassword = t("signup.passwordsDoNotMatch");
  } else {
    signupErrors.value.confirmPassword = "";
  }
}

// Password strength functions
function getPasswordStrengthClass(level: number) {
  if (passwordStrength.value >= level) {
    switch (passwordStrength.value) {
      case 1:
        return "bg-color-error";
      case 2:
        return "bg-color-warning";
      case 3:
        return "bg-color-info";
      case 4:
        return "bg-color-success";
      default:
        return "bg-gray-200";
    }
  }
  return "bg-gray-200";
}

function getPasswordStrengthText() {
  switch (passwordStrength.value) {
    case 1:
      return t("login.passwordWeak");
    case 2:
      return t("login.passwordFair");
    case 3:
      return t("login.passwordGood");
    case 4:
      return t("login.passwordStrong");
    default:
      return "";
  }
}

function getPasswordStrengthTextClass() {
  switch (passwordStrength.value) {
    case 1:
      return "text-color-error";
    case 2:
      return "text-color-warning";
    case 3:
      return "text-color-info";
    case 4:
      return "text-color-success";
    default:
      return "text-gray-400";
  }
}

// Signup password strength functions
function getSignupPasswordStrengthClass(level: number) {
  if (signupPasswordStrength.value >= level) {
    switch (signupPasswordStrength.value) {
      case 1:
        return "bg-color-error";
      case 2:
        return "bg-color-warning";
      case 3:
        return "bg-color-info";
      case 4:
        return "bg-color-success";
      default:
        return "bg-gray-200";
    }
  }
  return "bg-gray-200";
}

function getSignupPasswordStrengthText() {
  switch (signupPasswordStrength.value) {
    case 1:
      return t("signup.passwordWeak");
    case 2:
      return t("signup.passwordFair");
    case 3:
      return t("signup.passwordGood");
    case 4:
      return t("signup.passwordStrong");
    default:
      return "";
  }
}

function getSignupPasswordStrengthTextClass() {
  switch (signupPasswordStrength.value) {
    case 1:
      return "text-color-error";
    case 2:
      return "text-color-warning";
    case 3:
      return "text-color-info";
    case 4:
      return "text-color-success";
    default:
      return "text-gray-400";
  }
}

// Login handler
const handleLogin = async () => {
  // 1. Local Validation
  validateEmail();
  validatePassword();
  if (!isFormValid.value) return;

  // 2. Start Loading
  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // 3. Call Store Action
    const response = await authStore.login(email.value, password.value);

    // 4. Handle 2FA Required
    if (response && response.status === "2fa_required") {
      twoFactorToken.value = response.temp_token;
      show2FAModal.value = true;
      isLoading.value = false;
      return;
    }

    // 5. Success Logic
    if (response && response.status === "success") {
      // The store handles the redirect.
      // If success toast works for you, leave your existing success logic here.
      successMessage.value = t("login.loginSuccess") || "Login successful!";
      toast.success(successMessage.value);
    } else {
      // Handle cases where the server returns 200 OK but with a failure status
      isLoading.value = false;
      const msg = response?.message || response?.error || t("login.loginFailed") || "Invalid credentials";
      errorMessage.value = msg;
      toast.error(msg);
    }
  } catch (error: any) {
    // 1. Reset loading so the button is clickable again
    isLoading.value = false;

    // 2. Extract the message more reliably
    const responseData = error.response?.data;
    let displayMsg = t("login.loginFailed") || "Login failed";

    if (responseData) {
      // Check for Laravel validation errors first
      if (responseData.errors) {
        displayMsg = Object.values(responseData.errors).flat()[0] as string;
      } else {
        displayMsg = responseData.message || responseData.error || displayMsg;
      }
    } else if (error.message) {
      displayMsg = error.message;
    }

    // 3. Show the toast immediately without complex conditions
    // (We only ignore if the error is explicitly a browser navigation cancellation)
    if (error.code !== "ERR_CANCELED" && error.message !== "canceled") {
      errorMessage.value = displayMsg;
      toast.error(displayMsg);
    }

    // 4. Clear password for security
    password.value = "";
  }
};

// Add this new function after handleLogin
const handle2FASubmit = async (code: string) => {
  isLoading.value = true;
  twoFactorError.value = null;
  try {
    // Use the new store action that handles redirect
    // ✅ FIX: Cast to any. This forces TS to accept it.
await authStore.verifyTwoFactor((twoFactorToken.value as any), code);
  } catch (error: any) {

     const local_error= error.response?.data?.message || "Verification failed.";
    toast.error(local_error);
  } finally {
    isLoading.value = false;
  }
};

// Signup handler
const handleSignup = async () => {
  try {
    validateSignupName();
    validateSignupEmail();
    validateSignupPassword();
    validateSignupConfirmPassword();

    if (!isSignupFormValid.value) return;

    isSignupLoading.value = true;
    signupErrorMessage.value = "";
    signupSuccessMessage.value = "";

    // Use the auth store to register
    await authStore.register({
      name: signupForm.value.name,
      email: signupForm.value.email,
      password: signupForm.value.password,
      password_confirmation: signupForm.value.confirmPassword,
    });

    // Success
    toast.success(t("signup.signupSuccess") || "Signup successful! Please verify your email.");

    // Redirect after successful signup
    // setTimeout(() => {
    //   const isAdmin = authStore.isAdmin;

    //   if (isAdmin) {
    //     router.push("/admin");
    //   } else {
    //     router.push("/");
    //   }
    // }, 1500);

    // ✅ FIX 2: Better UX - Switch to Login Tab automatically
    // This shows the user "Okay, you're registered. Now go Verify -> Login."
    setTimeout(() => {
       activeTab.value = 'credentials'; // Switches the view to the Login form

       // Optional: Clear the signup form so it's clean if they come back
       signupForm.value = {
         name: "",
         email: "",
         password: "",
         confirmPassword: "",
         agreeToTerms: false
       };
    }, 1500);
  } catch (error: any) {
    if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors;
      if (errors.name) signupErrors.value.name = errors.name[0];
      if (errors.email) signupErrors.value.email = errors.email[0];
      if (errors.password) signupErrors.value.password = errors.password[0];
    } else {
      toast.error(error.response?.data?.message || t("signup.signupFailed"));
    }
  } finally {
    isSignupLoading.value = false;
  }
};

// Social login handler
const socialLogin = async (provider: string) => {
  isLoading.value = true;
  try {
    errorMessage.value = "";

    // 1. Call the API service to get the redirect URL
    const redirectUrl = icoService.socialLoginRedirect(provider);

    // 2. Redirect the user's browser to the social provider
    window.location.href = redirectUrl;

    // The rest of the login happens in the backend/browser flow.
    // Execution stops here.
  } catch (error: any) {
    console.error("Social login redirect error:", error);
    toast.error(error.message || t("login.socialLoginFailed"));
    isLoading.value = false;
  } finally {
    // We do not set isLoading=false here because the page is redirecting.
  }
};

// Wallet connection handler
// This function now initiates the full, secure sign-in process
const handleWalletConnect = async () => {
  isLoading.value = true;
  isModalConnecting.value = true;
  try {
    walletError.value = "";
    const web3Service = await import("@/services/web3");
    // Call the connect function from the dynamically imported module
    const { signer, address } = await web3Service.connect();
    if (!address || !signer)
      throw new Error("Could not retrieve wallet details.");

    const response = await authStore.loginWithWallet(signer, address);

    if (response.status === "2fa_required") {
      twoFactorToken.value = response.temp_token;
      show2FAModal.value = true;
      isLoading.value = false;
    } else if (response.status === "profile_incomplete") {
      router.push("/complete-profile");
    // } else if (response.status === "success") {
    //   toast.success(t("login.loginSuccess"));
    //   router.push(authStore.isAdmin ? "/admin" : "/");
    // }
    }
  } catch (error: any) {
    console.error("Wallet connection error:", error);
    walletError.value = error.message || t("login.walletConnectionFailed");
    toast.error(walletError.value);
  } finally {
    isLoading.value = false;
    isModalConnecting.value = false;
  }
};

// Logout handler
const logout = async () => {
  await authStore.logout();
  showUserMenu.value = false;
};

// Lifecycle hooks
onMounted(async () => {
  // Add event listener to close user menu when clicking outside
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      showUserMenu.value &&
      !target.closest(".user-menu") &&
      !target.closest('button[aria-label="User menu"]')
    ) {
      showUserMenu.value = false;
    }
  });

  const route = router.currentRoute.value;
  const token = route.query.token as string;
  const errorQuery = route.query.error as string;

  if (token) {
    isLoading.value = true;
    // Clean the URL of the token/error query
    router.replace({ query: {} });

    try {
      // Attempt to log in with the received token
      await authStore.loginWithToken(token);
      toast.success(t("login.loginSuccess"));
      router.push(authStore.isAdmin ? "/admin" : "/");
    } catch (e) {
      // Error handling is inside loginWithToken
      activeTab.value = "credentials";
    } finally {
      isLoading.value = false;
    }
  } else if (errorQuery) {
    // Display backend errors from the social callback redirect
    toast.error(decodeURIComponent(errorQuery));
  }
});
</script>

<style scoped>
/* Floating animation for background shapes */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Apply floating animation to background shapes */
.absolute.rounded-full {
  animation: float infinite ease-in-out;
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

/* Slide up animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
</style>
