<script setup lang="ts">
import { ref } from 'vue';
import { Search, Calendar, Download, RefreshCw, ChevronDown } from 'lucide-vue-next';

const isOpen = ref(true);
</script>

<template>
  <div id="SportOrder" class="min-h-screen ml-0.5 mt-0.5 h-full bg-white">
    <div class="w-full bg-white shadow-sm p-4 sm:p-6 mt-0.5 h-">
      <div class="flex flex-wrap gap-4 mb-6">
        <details class="group" :open="isOpen">
          <summary class="list-none">
            <button class="font-medium text-orange-500 hover:text-orange-600 transition-colors">
              Order History
            </button>
          </summary>
        </details>
        <details class="group">
          <summary class="list-none">
            <button class="text-gray-400 hover:text-orange-500 transition-colors">Trade History</button>
          </summary>
          <div class="absolute bg-white shadow-lg rounded-lg mt-2 p-4 z-10">
            <div class="text-sm">Trade Content 1</div>
            <div class="text-sm">Trade Content 2</div>
          </div>
        </details>
      </div>
      
      <div class="flex flex-wrap items-center gap-4 mb-8">
        <div class="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <div class="text-sm text-gray-600">Time</div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input type="text" placeholder="Start time"
              class="border rounded px-3 py-2 text-sm w-full sm:w-32 focus:outline-none focus:border-orange-500" />
            <span class="text-gray-400 hidden sm:inline">~</span>
            <input type="text" placeholder="End time"
              class="border rounded px-3 py-2 text-sm w-full sm:w-32 focus:outline-none focus:border-orange-500" />
          </div>
        </div>
        
        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <details class="relative w-full sm:w-auto">
            <summary class="flex items-center justify-between gap-2 border rounded px-3 py-2 cursor-pointer hover:border-orange-500 w-full sm:w-auto">
              <div class="flex items-center gap-2">
                <Search class="w-4 h-4" />
                <span class="text-sm">All</span>
              </div>
              <ChevronDown class="w-4 h-4" />
            </summary>
            <div class="absolute top-full left-0 mt-1 w-full sm:w-40 bg-white border rounded-lg shadow-lg z-10">
              <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 1</div>
              <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 2</div>
              <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 3</div>
            </div>
          </details>
        </div>
        
        <details class="relative w-full sm:w-auto">
          <summary class="flex items-center justify-between gap-2 border rounded px-3 py-2 cursor-pointer hover:border-orange-500 w-full sm:w-auto">
            <span class="text-sm">All</span>
            <ChevronDown class="w-4 h-4" />
          </summary>
          <div class="absolute top-full left-0 mt-1 w-full sm:w-40 bg-white border rounded-lg shadow-lg z-10">
            <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 1</div>
            <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 2</div>
            <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 3</div>
          </div>
        </details>
        
        <details class="relative w-full sm:w-auto">
          <summary class="flex items-center justify-between gap-2 border rounded px-3 py-2 cursor-pointer hover:border-orange-500 w-full sm:w-auto">
            <span class="text-sm">All</span>
            <ChevronDown class="w-4 h-4" />
          </summary>
          <div class="absolute top-full left-0 mt-1 w-full sm:w-40 bg-white border rounded-lg shadow-lg z-10">
            <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 1</div>
            <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 2</div>
            <div class="p-2 hover:bg-gray-50 cursor-pointer">Option 3</div>
          </div>
        </details>
        
        <div class="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <RefreshCw class="w-5 h-5" />
          </button>
          <button class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors flex-grow sm:flex-grow-0">
            Search
          </button>
          <button class="p-2 border rounded hover:border-orange-500 transition-colors">
            <Download class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div class="w-full overflow-x-auto">
        <div class="grid grid-cols-4 md:grid-cols-10 text-sm text-gray-500 pb-3 border-b overflow-auto md:overflow-hidden">
          <div class="px-2">Symbol</div>
          <div class="px-2">Direction</div>
          <div class="px-2">Price</div>
          <div class="px-2">Amount / Filled</div>
          <div class="px-1 hidden sm:block">Total / Filled (USDT)</div>
          <div class="px-2 hidden sm:block">Avg.Price</div>
          <div class="px-2 hidden sm:block">Type</div>
          <div class="px-2 hidden sm:block">Status</div>
          <div class="px-2 hidden sm:block">Order ID</div>
          <div class="px-2 hidden sm:block">Time</div>
        </div>
        <div class="flex flex-col items-center justify-center py-16">
          <div class="text-gray-400 mb-2">
            <Search class="w-16 h-16" />
          </div>
          <div class="text-gray-400">No Data</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles can be added here if needed */
</style>