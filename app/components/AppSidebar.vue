<script setup lang="ts">
const { addCamera, isEditing } = useCameras();

function handleAddCamera() {
  addCamera({
    id: Date.now(),
    name: "New Camera",
    description: "New camera description",
    annotated: false,
    annotations: [],
  });
}
</script>

<template>
  <aside
    class="w-64 bg-gray-100 border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800"
  >
    <div class="p-4">
      <div class="flex items-center justify-between">
        <p class="text-lg font-bold">Camera List</p>

        <UButton
          class="font-bold rounded-full cursor-pointer"
          icon="i-lucide-plus"
          @click="handleAddCamera"
        />
        <UButton
          class="font-bold rounded-full"
          icon="i-lucide-edit"
          @click.stop="isEditing = true"
        />
      </div>
      <CameraList />
    </div>
  </aside>
</template>
