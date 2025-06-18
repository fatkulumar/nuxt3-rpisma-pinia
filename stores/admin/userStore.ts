import type { Pagination } from "~/types/pagination";
import type { ResponseArray } from "~/types/response";
import type { User } from "~/types/user";

export const useUserStore = defineStore('userStore', () => {
  const users = ref<Pagination<User> | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await $fetch<ResponseArray<Pagination<User>>>('/api/admin/user');
      users.value = res.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    error,
    getUsers,
  };
});
