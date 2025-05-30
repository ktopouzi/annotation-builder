<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const target = ref("target");
const toast = useToast();

const { cameras, selectedCameraId, selectedCamera, isEditing } = useCameras();

onClickOutside(target, () => {
  if (!selectedCamera.value.name) {
    toast.add({
      title: "Something went wrong.",
      description: "Name is required to save the camera.",
      variant: "outline",
      color: "error",
      icon: "i-lucide-alert-triangle",
    });
    return;
  }
  isEditing.value = false;
});

function handleClick(cameraId) {
  if (isEditing.value) {
    isEditing.value = false;
  }
  selectedCameraId.value = cameraId;
  selectedCamera.value = cameras.value.find((camera) => camera.id === cameraId);
}
</script>

<template>
  <div class="mt-4">
    <ul ref="target" class="space-y-2">
      <li
        v-for="camera in cameras"
        :key="camera.id"
        class="flex flex-col items-center gap-4 border border-primary rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
        @click="handleClick(camera.id)"
      >
        <div
          class="flex items-center p-2 gap-2 w-full rounded-xl shadow"
          :class="{
            'bg-primary-900': selectedCameraId === camera.id,
          }"
        >
          <div
            class="shrink-0 bg-gray-300 p-2 rounded-xl flex items-center justify-center"
          >
            <UIcon
              :name="
                camera.annotated ? 'i-lucide-check' : 'i-lucide-triangle-alert'
              "
              class="shrink-0 p-3"
              :class="{
                'text-green-500': camera.annotated,
                'text-orange-500': !camera.annotated,
              }"
            />
          </div>
          <div class="flex flex-col items-start overflow-hidden">
            <UInput
              v-if="isEditing && selectedCameraId === camera.id"
              v-model="camera.name"
            />
            <p v-else class="font-bold truncate w-full">{{ camera.name }}</p>
            <UInput
              v-if="isEditing && selectedCameraId === camera.id"
              v-model="camera.description"
            />
            <span v-else class="text-sm text-gray-200">{{
              camera.description
            }}</span>
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
