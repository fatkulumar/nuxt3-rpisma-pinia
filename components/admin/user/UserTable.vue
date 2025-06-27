<script setup lang="ts">
import type { Pagination } from '~/types/pagination';
import type { User } from '~/types/user';
import { useUserStore } from '~/stores/admin/userStore';
import PaginationComponent from '~/components/utils/Pagination.vue';
import ModalForm from '~/components/utils/ModalForm.vue';
import PlusIcon from '~/components/utils/PlusIcon.vue';
import PencilIcon from '~/components/utils/PencilIcon.vue';
import TrashIcon from '~/components/utils/TrashIcon.vue';
import SearchIcon from '~/components/utils/SearchIcon.vue';

const props = defineProps<{
    store: {
        data: Pagination<User> | null;
        isLoading: boolean;
        error: Record<string, string> | any;
    };
    userStore: ReturnType<typeof useUserStore>;
}>();

</script>

<template>
    <div>

       <div v-show="props.userStore.isLoading">Memuat data...</div>
        <div v-show="!props.userStore.isLoading && (!props.store.data || props.store.data.data.length === 0)">
            <div class="w-10 h-10 cursor-pointer">
                <PlusIcon class="h-8 w-8" @click="props.userStore.openModal" />
            </div>
            Tidak ada data ditemukan.
        </div>
        <div v-show="props.userStore.isLoading || (props.store.data && props.store.data.data.length > 0)">
            <template v-for="col in props.userStore.columns" :key="col.key">
                <div v-if="col.key !== 'id'" class="mb-4">
                    <span v-if="props.store.error" class="text-red-500 text-sm">
                        {{ props.store.error.data[col.key] }}
                    </span>
                </div>
            </template>
            <div class="w-full h-10 flex justify-between items-center cursor-pointer">
                <PlusIcon class="h-8 w-8" @click="props.userStore.openModal" />
                <div class="flex items-center gap-2 border-2 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                    <SearchIcon class="w-5 h-5 text-gray-500 scale-x-[-1]" />
                    <input
                        type="text"
                        placeholder="Cari sesuatu..."
                        class="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                </div>

            </div>

            <div ref="tableSection" class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th v-for="col in props.userStore.columns" :key="col.key" class="px-6 py-3">
                                {{ col.label }}
                            </th>
                            <th class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in props.store.data?.data" :key="item.id ?? index"
                            class="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                            <td class="px-6 py-4">
                                {{
                                    ((props.store.data?.meta?.per_page ?? 0) * ((props.store.data?.meta?.current_page ?? 1) - 1)) + index + 1
                                }}
                            </td>
                            <td v-for="col in props.userStore.columnFields" :key="col.key" class="px-6 py-4">
                                {{ (item as Record<string, any>)[col.key] }}
                            </td>
                            <td class="px-6 py-4 flex gap-2">
                                <button @click="props.userStore.editForm(item as User)"
                                    class="text-blue-600 dark:text-blue-500 hover:underline w-8 h-8 cursor-pointer">
                                    <PencilIcon />
                                </button>
                                <button @click="props.userStore.deleteForm(item)"
                                    class="text-blue-600 dark:text-blue-500 hover:underline w-8 h-8 cursor-pointer">
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <PaginationComponent
                v-if="props.store.data"
                :meta="props.store.data.meta"
                :pagesToShow="props.userStore.pagesToShow"
                :setPage="props.userStore.setPage"
            />
        </div>

       <ModalForm
            :title="props.userStore.isEdit == false ? 'Tambah User' : 'Edit User'"
            :showModal="props.userStore.showModal"
            :form="props.userStore.form"
            :columns="props.userStore.columns"
            :error="props.store.error"
            :submitForm="props.userStore.submitForm"
            :closeModal="props.userStore.closeModal"
        />

    </div>
</template>
