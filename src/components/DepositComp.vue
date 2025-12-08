<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChartBarIcon,
  WalletIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
} from '@heroicons/vue/24/outline'
import DashLeft from '../components/DashLeft.vue'
import SpotOrder from '../components/SpotOrder.vue'
import Deposit from './DepositComp.vue'

const router = useRouter()
const selectedTab = ref('wallet')
const currentBalance = ref('0.00000000')
const usdtBalance = ref('$0.00')

const assets = [
  {
    name: 'Funding',
    icon: WalletIcon,
    balance: '0.00000000',
    usdtValue: '$0.00',
    ratio: '--% ',
  },
  {
    name: 'Spot Assets',
    icon: ChartBarIcon,
    balance: '0.00000000',
    usdtValue: '$0.00',
    ratio: '--% ',
  },
  {
    name: 'Perpetual',
    icon: CurrencyDollarIcon,
    balance: '0.00000000',
    usdtValue: '$0.00',
    ratio: '--% ',
  },
]

const recentTrades: any[] = []

const navigateTo = (route: string) => {
  router.push({ name: route })
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <DashLeft />
    <div class="flex-1 overflow-auto mt-10 md:mt-0.5">
      <Deposit />
    </div>
  </div>
</template>
<style>
.w-80 {
  width: 80%;
}

.p-1 {
  padding: 1px;
}

.p-5 {
  padding: 5px 20px;
}

.mb-1 {
  margin-bottom: 1px;
}

.mt-2 {
  margin-top: 2px;
}

.mt-1 {
  margin-top: 1px;
}
</style>
