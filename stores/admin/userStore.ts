import { defineStore } from 'pinia';
import type { Pagination } from '~/types/pagination';
import type { ResponseArray } from '~/types/response';
import type { User } from '~/types/user';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userPages: {} as Record<number, Pagination<User>>,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    users: (state) => (page: number): Pagination<User> | null =>
      state.userPages[page] ?? null,
  },

  actions: {
    async getUsers(page = 1): Promise<void> {
      if (this.userPages[page]) return; // gunakan cache kalau ada

      this.isLoading = true;
      this.error = null;

      try {
        const res = await useClientFetchWithValidation<ResponseArray<Pagination<User>>>(
          `/api/admin/user`,
          {
            method: 'GET',
            platform: 'app', // bisa 'browser' juga kalau perlu
            query: { page },
          }
        );
        this.userPages[page] = res.data;
      } catch (err: any) {
        this.error = err?.data?.message || err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async createUser() {
      this.isLoading = true;
      this.error = null;

      try {
        const res = await $fetch<ResponseArray<Pagination<User>>>(`/api/admin/user`, {
          method: "POST"
        });
      } catch (err: any) {
        this.error = err?.data?.message || err.message;
      } finally {
        this.isLoading = false;
      }
    }
  },
});
