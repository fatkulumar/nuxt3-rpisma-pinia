<script setup lang="ts">
import { useUserStore } from '~/stores/admin/userStore';
import { storeToRefs } from 'pinia';
import DataTableIsland from '~/components/DataTableIsland.vue';

const userStore = useUserStore();
const { users, isLoading, error } = storeToRefs(userStore);

const columns = [
  { label: 'Name', key: 'name' },
  { label: 'Email', key: 'email' }
];
</script>

<template>
  <ClientOnly>
    <DataTableIsland
      :store="{
        getData: userStore.getUsers,
        data: users,
        isLoading,
        error
      }"
      :columns="columns"
    />
  </ClientOnly>
</template>
