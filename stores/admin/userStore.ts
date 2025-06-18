import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Pagination } from '~/types/pagination';
import type { ApiResponse } from '~/types/apiResponse';
import type { User } from '~/types/user';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: ref<Pagination<User> | null>(null),
        isLoading: ref(false),
        error: ref<string | null>(null),
    }),
    actions: {
        async getUsers() {
            this.isLoading = true;
            this.error = null;
            try {
                const res = await $fetch<ApiResponse<Pagination<User>>>('/api/admin/user');
                this.users = res.data;
            } catch (err: any) {
                this.error = err?.data?.message || err.message || 'Gagal memuat data';
            } finally {
                this.isLoading = false;
            }
        }
    }
});
