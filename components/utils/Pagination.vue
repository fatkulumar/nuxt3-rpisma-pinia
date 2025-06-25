<script setup lang="ts">
import type { PaginationMeta } from '~/types/pagination';

const props = defineProps<{
  meta: PaginationMeta;
  pagesToShow: number[];
  setPage: (page: number) => void;
}>();

const isFirstPage = props.meta.current_page <= 1;
const isLastPage = props.meta.current_page >= props.meta.last_page;
</script>

<template>
  <div class="flex justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-300">
    <div>
      Halaman {{ props.meta.current_page }} dari {{ props.meta.last_page }}
    </div>
    <div class="space-x-1 flex items-center">
      <button
        :disabled="isFirstPage"
        @click="props.setPage(props.meta.current_page - 1)"
        class="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>

      <button
        v-for="page in props.pagesToShow"
        :key="page"
        @click="props.setPage(page)"
        :class="[
          'px-3 py-1 rounded',
          page === props.meta.current_page
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-gray-800 dark:text-white'
        ]"
      >
        {{ page }}
      </button>

      <button
        type="button"
        :disabled="isLastPage"
        @click="props.setPage(props.meta.current_page + 1)"
        class="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>
