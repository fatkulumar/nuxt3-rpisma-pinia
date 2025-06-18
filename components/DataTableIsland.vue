<script setup lang="ts"> 
import type { Ref } from 'vue';
import type { Pagination } from '~/types/pagination';

type T = Record<string, any>;

const props = defineProps<{
    store: {
        getData: () => Promise<void>;
        data: Pagination<T> | null;
        isLoading: boolean;
        error: string | null;
    };
    columns: Array<{ label: string; key: string }>;
}>();

onMounted(() => {
    props.store.getData();
});
</script>

<template>
    <div>
        <div v-if="props.store.isLoading">Memuat data...</div>
        <div v-else-if="props.store.error">Error: {{ props.store.error }}</div>
        <div v-else-if="!props.store.data || props.store.data.data.length === 0">
            Tidak ada data ditemukan.
        </div>
        <div v-else>
            <div class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th v-for="col in props.columns" :key="col.key" class="px-6 py-3">
                                {{ col.label }}
                            </th>
                            <th class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in props.store.data.data" :key="index"
                            class="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                            <td v-for="col in props.columns" :key="col.key" class="px-6 py-4">
                                {{ item[col.key] }}
                            </td>
                            <td class="px-6 py-4">
                                <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
