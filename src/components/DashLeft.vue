<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const menuItems = [
  { icon: '/src/assets/icons/overview.svg', text: 'Overview', route: 'Wallet' },
  { icon: '/src/assets/icons/funding.svg', text: 'Funding', route: 'Assets' },
  { icon: '/src/assets/icons/perpetual.svg', text: 'Perpetual Assets', route: 'Assets' },
  { icon: '/src/assets/icons/spot.svg', text: 'Spot Assets', route: 'Assets' },
  { icon: '/src/assets/icons/perpetual.svg', text: 'Margin Account', route: 'MarginAccount' },
]

const subMenuItems = [
  { icon: '/src/assets/icons/spot.svg', text: 'Spot Order', route: 'Orders' },
  { icon: '/src/assets/icons/perpetual.svg', text: 'Perpetual Order', route: 'Orders' },
  { icon: '/src/assets/icons/overview.svg', text: 'Buy Crypto', route: 'buy-crypto' },
]

const transactionItems = [
  { icon: '/src/assets/icons/overview.svg', text: 'Funding records', route: 'funding-records' },
  { icon: '/src/assets/icons/overview.svg', text: 'Perpetual records', route: 'perpetual-records' },
  { icon: '/src/assets/icons/overview.svg', text: 'Spot records', route: 'spot-records' },
  {
    icon: '../assets/icons/overview.svg',
    text: 'Copy trading records',
    route: 'copy-trading-records',
  },
]

const isOrdersDropdownOpen = ref(false)
const isTransactionDropdownOpen = ref(false)
const isMobileCollapsed = ref(false)
const toggleMobileCollapsed = () => {
  console.log(97, isMobileCollapsed.value)
  isMobileCollapsed.value = !isMobileCollapsed.value
}
const updateMobileCollapsed = () => {
  // Assuming 'md' breakpoint is 768px (you can adjust this value as needed)
  const mdBreakpoint = 768
  isMobileCollapsed.value = window.innerWidth >= mdBreakpoint
}

// Call the update function initially to set the correct state
updateMobileCollapsed()
// Add event listener on mount
onMounted(() => {
  window.addEventListener('resize', updateMobileCollapsed)
})

// Remove event listener on unmount
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileCollapsed)
})
const toggleOrdersDropdown = () => {
  isOrdersDropdownOpen.value = !isOrdersDropdownOpen.value
}

const toggleTransactionDropdown = () => {
  isTransactionDropdownOpen.value = !isTransactionDropdownOpen.value
}

const navigateTo = (path: string) => {
  router.push({ name: path })
}
</script>

<template>
  <!-- Left Sidebar -->
  <div id="dash-menu" class="w-full md:w-64 md:static absolute bg-white mt-2 h-fit md:h-full">
    <div class="p-4" v-if="isMobileCollapsed">
      <div class="space-y-4">
        <div
          v-for="item in menuItems"
          :key="item.route"
          @click="navigateTo(item.route)"
          class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
        >
          <img :src="item.icon" class="h-5 w-5" />
          <span>{{ item.text }}</span>
        </div>

        <!-- Orders Section -->
        <div
          class="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
          @click="toggleOrdersDropdown"
        >
          <div class="flex items-center space-x-2">
            <img src="../assets/icons/orders.svg" class="h-5 w-5" />
            <span class="font-medium">Orders</span>
          </div>
          <ChevronDownIcon
            class="h-5 w-5 text-gray-500 transition-transform duration-200"
            :class="{ 'transform rotate-180': isOrdersDropdownOpen }"
          />
        </div>
        <div v-if="isOrdersDropdownOpen" class="pl-7 space-y-1">
          <div
            v-for="item in subMenuItems"
            :key="item.route"
            @click="navigateTo(item.route)"
            class="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <span>{{ item.text }}</span>
          </div>
        </div>

        <!-- Transaction History Section -->
        <div
          class="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
          @click="toggleTransactionDropdown"
        >
          <div class="flex items-center space-x-2">
            <img src="../assets/icons/history.svg" class="h-5 w-5" />
            <span class="font-medium">Transaction History</span>
          </div>
          <ChevronDownIcon
            class="h-5 w-5 text-gray-500 transition-transform duration-200"
            :class="{ 'transform rotate-180': isTransactionDropdownOpen }"
          />
        </div>
        <div v-if="isTransactionDropdownOpen" class="pl-7 space-y-1">
          <div
            v-for="item in transactionItems"
            :key="item.route"
            @click="navigateTo(item.route)"
            class="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer md:hidden"
      @click="toggleMobileCollapsed"
    >
      <div class="flex items-center space-x-2">
        <img src="../assets/icons/history.svg" class="h-5 w-5" />
        <span class="font-medium">Dashboard</span>
      </div>
      <ChevronDownIcon
        class="h-5 w-5 text-gray-500 transition-transform duration-200"
        :class="{ 'transform rotate-180': isMobileCollapsed }"
      />
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
.mt-2 {
  margin-top: 2px;
}
</style>
