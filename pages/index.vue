<script setup lang="ts">
import { useUserStore } from '~/stores/admin/userStore';
import { storeToRefs } from 'pinia';
import { computed, watchEffect } from 'vue';
import Skeleton from '~/components/admin/user/Skeleton.vue';
import UserTable from '~/components/admin/user/UserTable.vue';

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore();
const { isLoading, error } = storeToRefs(userStore);

// Ambil data saat mount atau currentPage berubah (otomatis diatur oleh store)
watchEffect(() => {
   userStore.getUsers(userStore.currentPage, userStore.keyWordSearch);
});

const currentData = computed(() =>  userStore.usersWithSearch(userStore.currentPage, userStore.keyWordSearch));
</script>

<template>
  <ClientOnly class="w-full max-w-5xl mx-auto px-5 py-4 rounded-t shadow-xl">
    <template #fallback>
      <Skeleton />
    </template>
    <UserTable :store="{
      data: currentData,
      isLoading,
      error
    }" :userStore="userStore" />
  </ClientOnly>
</template>
