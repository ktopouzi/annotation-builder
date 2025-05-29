<script setup lang="ts">
const { cameras, selectedCameraId } = useCameras();
</script>

<template>
  <div class="mt-4">
    <ul class="space-y-2">
      <li
        v-for="camera in cameras"
        :key="camera.id"
        class="flex flex-col items-center gap-4 border border-primary rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
        @click="selectedCameraId = camera.id"
      >
        <div
          class="flex items-center p-2 gap-4 w-full rounded-xl shadow"
          :class="{
            'bg-primary-900': selectedCameraId === camera.id,
          }"
        >
          <div
            class="shrink-0 bg-gray-400 p-2 rounded-xl flex items-center justify-center"
          >
            <UIcon
              :name="
                camera.annotated ? 'i-lucide-check' : 'i-lucide-triangle-alert'
              "
              class="shrink-0 p-3"
            />
          </div>
          <div class="flex flex-col items-start overflow-hidden">
            <p class="font-bold truncate w-full">{{ camera.name }}</p>
            <span class="text-sm text-gray-200">{{ camera.description }}</span>
          </div>
        </div>
        <ul
          v-if="camera.annotations.length > 0 && selectedCameraId === camera.id"
          class="w-full p-4"
        >
          <li v-for="annotation in camera.annotations" :key="annotation.id">
            {{ annotation.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
