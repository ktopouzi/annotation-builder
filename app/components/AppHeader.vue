<script setup lang="ts">
// set cameraid to the last used camera
const cameraId = ref(1);
</script>

<template>
  <header
    class="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800"
  >
    <p class="text-lg font-semibold">Dashboard Header</p>

    <UButton class="font-bold rounded-full" icon="i-lucide-check"
      >All cameras annotated</UButton
    >
    <div>
      <UPagination v-model:page="cameraId" :items-per-page="1" :total="2" />
    </div>
  </header>
</template>
