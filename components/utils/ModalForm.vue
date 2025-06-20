<script setup lang="ts">
interface Column {
  key: string;
  label: string;
}

const props = defineProps<{
  title: string;
  showModal: boolean;
  form: Record<string, any>;
  columns: Column[];
  error: Record<string, any> | null;
  submitForm: () => void;
  closeModal: () => void;
}>();
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-xl shadow-lg p-6 relative">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {{ title }}
      </h2>

      <form @submit.prevent="submitForm">
        <template v-for="col in columns" :key="col.key">
          <div v-if="col.key !== 'id'" class="mb-4">
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              {{ col.label }}
            </label>

            <input
              v-model="form[col.key]"
              :type="col.key === 'email' ? 'email' : 'text'"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />

            <span v-if="error?.data?.[col.key]" class="text-red-500 text-sm">
              {{ error.data[col.key] }}
            </span>
          </div>
        </template>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
          >
            Simpan
          </button>
        </div>
      </form>

      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
      >
        ✕
      </button>
    </div>
  </div>
</template>
