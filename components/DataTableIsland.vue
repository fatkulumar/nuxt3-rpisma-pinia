<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Pagination } from '~/types/pagination';
import type { User } from '~/types/user';

// Pastikan form key cocok dengan User
const form = ref<Partial<User>>({
  id: '',
  name: '',
  email: '',
});

type Column = {
  label: string;
  key: keyof User;
};

const props = defineProps<{
  store: {
    getData: (page?: number) => Promise<void>;
    data: Pagination<User> | null;
    isLoading: boolean;
    error: string | null;
  };
  currentPage: number;
  setPage: (page: number) => void;
  createUser: () => void;
}>();

const pagesToShow = computed(() => {
  const current = props.store.data?.meta.current_page || 1;
  const last = props.store.data?.meta.last_page || 1;

  const maxButtons = 5;
  let start = Math.max(current - Math.floor(maxButtons / 2), 1);
  let end = start + maxButtons - 1;

  if (end > last) {
    end = last;
    start = Math.max(end - maxButtons + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const showModal = ref(false);

const openModal = () => {
  form.value = { id: '', name: '', email: '' };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitForm = () => {
  console.log('Data dikirim:', form.value);
  props.createUser();
  closeModal();
};

const editForm = (data: User) => {
  form.value = { ...data };
  showModal.value = true;
};

const deleteForm = (id: number) => {
  alert(`Hapus ID: ${id}`);
};

const columnFields = computed(() => {
  const sample = props.store.data?.data?.[0];
  if (!sample) return [];
  return Object.keys(sample)
    .filter((key) => key !== 'id')
    .map((key) => ({ key }));
});

const columns: Column[] = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' },
];
</script>

<template>
    <div>
        <div v-if="props.store.isLoading">Memuat data...</div>
        <div v-else-if="props.store.error">Error: {{ props.store.error }}</div>
        <div v-else-if="!props.store.data || props.store.data.data.length === 0">
            Tidak ada data ditemukan.
        </div>
        <div v-else>
            <div class="w-10 h-10 cursor-pointer">
                <svg @click="openModal" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                    <path
                        d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z">
                    </path>
                </svg>
            </div>
            <div class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th v-for="col in columns" :key="col.key" class="px-6 py-3">
                                {{ col.label }}
                            </th>
                            <th class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in props.store.data.data" :key="item.id ?? index"
                            class="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                            <td v-for="col in columnFields" :key="col.key" class="px-6 py-4">
                                {{ (item as Record<string, any>)[col.key] }}
                            </td>
                            <td class="px-6 py-4 flex gap-2">
                                <button @click="editForm(item as User)"
                                    class="text-blue-600 dark:text-blue-500 hover:underline w-8 h-8 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                                        <path
                                            d="M 46.574219 3.425781 C 45.625 2.476563 44.378906 2 43.132813 2 C 41.886719 2 40.640625 2.476563 39.691406 3.425781 C 39.691406 3.425781 39.621094 3.492188 39.53125 3.585938 C 39.523438 3.59375 39.511719 3.597656 39.503906 3.605469 L 4.300781 38.804688 C 4.179688 38.929688 4.089844 39.082031 4.042969 39.253906 L 2.035156 46.742188 C 1.941406 47.085938 2.039063 47.453125 2.292969 47.707031 C 2.484375 47.898438 2.738281 48 3 48 C 3.085938 48 3.171875 47.988281 3.257813 47.964844 L 10.746094 45.957031 C 10.917969 45.910156 11.070313 45.820313 11.195313 45.695313 L 46.394531 10.5 C 46.40625 10.488281 46.410156 10.472656 46.417969 10.460938 C 46.507813 10.371094 46.570313 10.308594 46.570313 10.308594 C 48.476563 8.40625 48.476563 5.324219 46.574219 3.425781 Z M 45.160156 4.839844 C 46.277344 5.957031 46.277344 7.777344 45.160156 8.894531 C 44.828125 9.222656 44.546875 9.507813 44.304688 9.75 L 40.25 5.695313 C 40.710938 5.234375 41.105469 4.839844 41.105469 4.839844 C 41.644531 4.296875 42.367188 4 43.132813 4 C 43.898438 4 44.617188 4.300781 45.160156 4.839844 Z M 5.605469 41.152344 L 8.847656 44.394531 L 4.414063 45.585938 Z">
                                        </path>
                                    </svg>
                                </button>
                                <button @click="deleteForm(item.id)"
                                    class="text-blue-600 dark:text-blue-500 hover:underline w-8 h-8 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
                                        <path
                                            d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z">
                                        </path>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex justify-between items-center mt-4 text-sm text-gray-700 dark:text-gray-300">
                <div>
                    Halaman {{ props.store.data.meta.current_page }} dari {{ props.store.data.meta.last_page }}
                </div>
                <div class="space-x-1 flex items-center">
                    <button :disabled="props.store.data.meta.current_page <= 1"
                        @click="props.setPage(props.store.data.meta.current_page - 1)"
                        class="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50">
                        Prev
                    </button>

                    <button v-for="page in pagesToShow" :key="page" @click="props.setPage(page)" :class="[
                        'px-3 py-1 rounded',
                        page === props.store.data.meta.current_page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 text-gray-800 dark:text-white'
                    ]">
                        {{ page }}
                    </button>

                    <button :disabled="props.store.data.meta.current_page >= props.store.data.meta.last_page"
                        @click="props.setPage(props.store.data.meta.current_page + 1)"
                        class="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-xl shadow-lg p-6 relative">
                <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Form User</h2>

                <form @submit.prevent="submitForm">
                    <!-- v-for: Loop kolom yang bukan 'id' -->
                    <template v-for="col in columns" :key="col.key">
                        <div v-if="col.key !== 'id'" class="mb-4">
                            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                                {{ col.label }}
                            </label>
                            <input v-model="form[col.key]" :type="col.key === 'email' ? 'email' : 'text'"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required />
                        </div>
                    </template>

                    <div class="flex justify-end space-x-2">
                        <button type="button" @click="closeModal"
                            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-sm cursor-pointer">
                            Batal
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer">
                            Simpan
                        </button>
                    </div>
                </form>

                <button @click="closeModal"
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    ✕
                </button>
            </div>
        </div>

    </div>
</template>
