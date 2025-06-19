<script setup lang="ts">
import { useUserStore } from '~/stores/admin/userStore';
import { storeToRefs } from 'pinia';
import { ref, computed, watchEffect } from 'vue';
import DataTableIsland from '~/components/DataTableIsland.vue';
import Skeleton from '~/components/utils/Skeleton.vue';

const userStore = useUserStore();
const { isLoading, error } = storeToRefs(userStore);

const currentPage = ref(1);

watchEffect(() => {
  userStore.getUsers(currentPage.value);
});

const currentData = computed(() => userStore.users(currentPage.value));
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <Skeleton />
    </template>
    <DataTableIsland :store="{
      getData: userStore.getUsers,
      data: currentData,
      isLoading,
      error
    }" :currentPage="currentPage" :setPage="(page: number) => currentPage = page" :createUser="userStore.createUser" />
  </ClientOnly>
</template>
