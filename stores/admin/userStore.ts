import { defineStore } from 'pinia';
import type { Pagination } from '~/types/pagination';
import type { ResponseArray } from '~/types/response';
import type { User } from '~/types/user';
import { responseError, responseSuccess } from '~/server/utils/response.util';

type Column = {
  label: string;
  key: keyof User;
};

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userPages: {} as Record<number, Pagination<User>>,
    isLoading: false as boolean,
    error: null as Record<string, string> | any | null,
    form: ref<Partial<User>>({
      id: '',
      name: '',
      email: '',
    }),
    showModal: false as boolean,
    columns: [
      { label: 'Nomor', key: 'no' },
      { label: 'Nama', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Password', key: 'password' },
    ] as Column[],
    currentPage: 1,
    isEdit: false as boolean
  }),

  getters: {
    users: (state) => (page: number): Pagination<User> | null =>
      state.userPages[page] ?? null,

    columnFields: (state) => {
      const firstPage = Object.values(state.userPages)[0]; // ambil halaman pertama
      const sample = firstPage?.data?.[0];
      if (!sample) return [];
      return Object.keys(sample)
        .filter((key) => key !== 'id')
        .map((key) => ({ key }));
    },

     pagesToShow(state): number[] {
      const current = state.currentPage;
      const last = state.userPages[current]?.meta.last_page ?? 1;

      const maxButtons = 5;
      let start = Math.max(current - Math.floor(maxButtons / 2), 1);
      let end = start + maxButtons - 1;

      if (end > last) {
        end = last;
        start = Math.max(end - maxButtons + 1, 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
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
            platform: 'browser', // bisa set di composable requestValidation
            query: { page },
          }
        );
        this.userPages[page] = res.data;
        this.currentPage = page;
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
          this.addUserToState(users.data);
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
          this.replaceUserInState(res.data); // ⬅️ update state lokal
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
          throw fieldErrors; 
        } else {
          throw error;
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Tambahan: add user di state
    addUserToState(newUser: User): void {
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
    replaceUserInState(updatedUser: User): void {
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
    removeUserFromState(userId: number): void {
      for (const page in this.userPages) {
        const users = this.userPages[page].data;
        this.userPages[page].data = users.filter((u) => u.id !== userId);
      }
    },

    openModal(): void {
      this.form = { id: '', name: '', email: '' };
      this.showModal = true;
    },

    closeModal(): void {
      this.isEdit = false;
      this.showModal = false;
    },

    async createForm(): Promise<void> {
      try {
        const users = await this.createUser(this.form);
        if (users.code == 200) {
          this.closeModal();
        }
      } catch (errors: any) {
        console.error('Error Form:', errors);
      }
    },

    async updateForm(): Promise<void> {
      try {
        const users = await this.updateUser(this.form);
        if (users.code == 200) {
          this.closeModal();
        }
      } catch (errors: any) {
        console.error('Error Form:', errors);
      }
    },

    async submitForm(): Promise<void> {
      try {
        if (this.form.id) {
          this.updateForm();
        } else {
          this.createForm();
        }
        this.closeModal();
      } catch (errors) {
        this.error = errors;
      }
    },

    editForm(data: User): void {
      this.form = { ...data };
      this.isEdit = true;
      this.showModal = true;
    },

    deleteForm(data: User): void {
      const konfirm = confirm(`Hapus ${data.name} ?`)
      if (konfirm) {
        this.deleteUser(data);
      }
    },

    setPage(page: number): void {
      if (page !== this.currentPage) {
        this.currentPage = page;
        this.getUsers(page);
      }
    }
  },
});
