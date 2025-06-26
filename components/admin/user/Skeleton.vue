<template>
  <div class="animate-pulse border rounded-md overflow-hidden w-full max-w-5xl mx-auto px-5 py-4 rounded-t shadow-xl">
    <div class="bg-gray-200 h-10 w-full"></div>
    <table class="w-full">
      <thead>
        <tr>
          <th v-for="i in 4" :key="'head-' + i" class="p-4">
            <div class="h-4 bg-gray-300 rounded w-24"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="'row-' + i" class="border-t">
          <td v-for="j in 4" :key="'cell-' + i + '-' + j" class="p-4">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
