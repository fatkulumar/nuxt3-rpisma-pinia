import { defineStore } from 'pinia';
import type { Pagination } from '~/types/pagination';
import type { ResponseArray } from '~/types/response';
import type { User } from '~/types/user';
import { responseError, responseSuccess } from '~/server/utils/response.util';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userPages: {} as Record<number, Pagination<User>>,
    isLoading: false,
    error: null as Record<string, string> | null,
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
        const res = await requestValidation<ResponseArray<Pagination<User>>>(
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

    async createUser(data: Partial<User>): Promise<ResponseArray<Pagination<User>> | any> {
      this.isLoading = true;
      this.error = null;

      try {
        const users = await requestValidation<ResponseArray<Pagination<User>> | any>(`/api/admin/user`, {
          method: "POST",
          platform: 'app',
          body: data
        });
        if (users.code != 200) {
          this.error = users;
          return responseError(users.data, users.message, users.status, users.code);
        } else {
          this.addUserToState(users.data.data);
          return responseSuccess(users, "Berhasil Menyimpan Data", true, 200);
        }
      } catch (error: any) {
        if (error?.response?.status === 422) {
          const fieldErrors = error.response._data.errors;
          console.log('Field validation error:', fieldErrors);
          throw fieldErrors; // lempar ke komponen supaya bisa ditampilkan
        } else {
          throw error;
        }
      } finally {
        this.isLoading = false;
      }
    },

    async updateUser(data: Partial<User>): Promise<ResponseArray<Pagination<User>> | any> {
      this.isLoading = true;
      this.error = null;

      try {
        const res = await requestValidation<ResponseArray<User> | any>(`/api/admin/user`, {
          method: "PUT",
          platform: 'app',
          body: data
        });

        if (res.code !== 200) {
          this.error = res;
          return responseError(res.data, res.message, res.status, res.code);
        } else {
          this.replaceUserInState(res.data.data); // ⬅️ update state lokal
          return responseSuccess(res.data, "Berhasil update", true, 200);
        }
      } catch (error: any) {
        if (error?.response?.status === 422) {
          throw error.response._data.errors;
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteUser(data: Partial<User>): Promise<ResponseArray<Pagination<User>> | any> {
      this.isLoading = true;
      this.error = null;

      try {
        const users = await requestValidation<ResponseArray<Pagination<User>> | any>(`/api/admin/user`, {
          method: "DELETE",
          platform: 'app',
          body: data
        });
        if (users.code != 200) {
          this.error = users;
          return responseError(users.data, users.message, users.status, users.code);
        } else {
          this.removeUserFromState(data.id);
          return responseSuccess(users, "Berhasil Menghapus Data", true, 200);
        }
      } catch (error: any) {
        if (error?.response?.status === 422) {
          const fieldErrors = error.response._data.errors;
          console.log('Field validation error:', fieldErrors);
          throw fieldErrors; // lempar ke komponen supaya bisa ditampilkan
        } else {
          throw error;
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Tambahan: add user di state
    addUserToState(newUser: User) {
      const firstPage = this.userPages[1];
      if (firstPage) {
        firstPage.data.unshift(newUser); // tambahkan ke awal array
        // Optional: batasi jumlah sesuai per_page
        if (firstPage.data.length > firstPage.meta.per_page) {
          firstPage.data.pop(); // buang data terakhir jika lebih dari batas
        }
      }
    },

    // Tambahan: Update user di state
    replaceUserInState(updatedUser: User) {
      for (const page in this.userPages) {
        const pageNum = Number(page);
        const users = this.userPages[pageNum].data;
        const index = users.findIndex((u) => u.id === updatedUser.id);

        if (index !== -1) {
          const before = { ...users[index] }; // salin data sebelumnya
          this.userPages[pageNum].data.splice(index, 1, updatedUser); // reaktif
          break;
        }
      }
    },

    // Tambahan: Hapus user dari state
    removeUserFromState(userId: number) {
      for (const page in this.userPages) {
        const users = this.userPages[page].data;
        this.userPages[page].data = users.filter((u) => u.id !== userId);
      }
    },
  },
});
