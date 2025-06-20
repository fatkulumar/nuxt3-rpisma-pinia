<script setup lang="ts">
import { useUserStore } from '~/stores/admin/userStore';
import { storeToRefs } from 'pinia';
import { computed, watchEffect } from 'vue';
import Skeleton from '~/components/admin/user/Skeleton.vue';
import UserTable from '~/components/admin/user/UserTable.vue';

const userStore = useUserStore();
const { isLoading, error } = storeToRefs(userStore);

// Ambil data saat mount atau currentPage berubah (otomatis diatur oleh store)
watchEffect(() => {
  userStore.getUsers(userStore.currentPage);
});

const currentData = computed(() => userStore.users(userStore.currentPage));
</script>

<template>
  <ClientOnly>
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
