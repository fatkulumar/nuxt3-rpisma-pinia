<script setup lang="ts">
import { useUserStore } from '~/stores/admin/userStore';
const userStore = useUserStore();
useAsyncData('getUserData', async () => {
    await userStore.getUsers();
});
</script>

<template>
    <div>
        <div v-if="userStore.isLoading">Memuat data pengguna...</div>
        <div v-else-if="userStore.error">Error: {{ userStore.error }}</div>
        <div v-else-if="!userStore.users || userStore.users.data.length === 0">
            Tidak ada data pengguna.
        </div>
        <div v-else>
            <div class="relative overflow-x-auto shadow-md">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th class="px-6 py-3">Name</th>
                            <th class="px-6 py-3">Email</th>
                            <th class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in userStore.users.data" :key="index"
                            class="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                            <td class="px-6 py-4">{{ item.email }}</td>
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
