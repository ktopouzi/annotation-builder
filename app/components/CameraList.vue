<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const target = ref("target");
const toast = useToast();
const isEditingAnnotation = ref(false);
const currentAnnotationId = ref(0);

const { state, selectedCameraId, selectedCamera, isEditing, addCamera } =
  useAnnotationBuilder();

// computed property to check if the selected camera has a valid name (annotation and camera name)
const hasValidName = computed(() => {
  return (
    selectedCamera.value.name &&
    selectedCamera.value.name.trim() !== "" &&
    state.value.every((camera) =>
      camera.annotations?.every((a) => a.name?.trim())
    )
  );
});

// extract the logic to show an error toast when name is invalid
const showErrorToast = () => {
  toast.add({
    title: "Something went wrong.",
    description: "Name is required to save the camera.",
    variant: "outline",
    color: "error",
    icon: "i-lucide-alert-triangle",
  });
};

// this can be improved but for simplicity, we will use the same logic for both camera and annotation editing
onClickOutside(target, () => {
  if (!hasValidName.value) {
    showErrorToast();
    return;
  }
  isEditing.value = false;
  isEditingAnnotation.value = false;
});

function saveEdit() {
  if (!hasValidName.value) {
    showErrorToast();
    return;
  }
  isEditing.value = false;
  isEditingAnnotation.value = false;
}

function handleClick(cameraId) {
  if (!hasValidName.value && cameraId !== selectedCameraId.value) {
    showErrorToast();
    return;
  }
  selectedCameraId.value = cameraId;
}

function handleAnnotationEdit(id) {
  if (currentAnnotationId.value === id) {
    isEditingAnnotation.value = false;
    currentAnnotationId.value = 0;
  } else {
    isEditingAnnotation.value = true;
    currentAnnotationId.value = id;
  }
}

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
  <div class="flex items-center justify-between p-2">
    <p class="text-lg font-bold">Camera List</p>

    <div class="flex items-center gap-2">
      <UButton
        class="font-bold rounded-full cursor-pointer"
        icon="i-lucide-plus"
        @click="handleAddCamera"
      />
      <UButton
        class="font-bold rounded-full"
        icon="i-lucide-edit"
        @click="isEditing = true"
      />
    </div>
  </div>
  <client-only>
    <div class="mt-4 md:overflow-y-auto max-h-[calc(100vh-100px)]">
      <ul ref="target" class="space-y-2">
        <div v-if="!state.length" class="text-center text-gray-500 p-4">
          No cameras detected.
          <span>Please add a camera using the button above.</span>
        </div>
        <li
          v-for="camera in state"
          v-else
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
                  camera.annotations?.length > 0
                    ? 'i-lucide-check'
                    : 'i-lucide-triangle-alert'
                "
                class="shrink-0 p-3"
                :class="{
                  'text-green-500': camera.annotations?.length > 0,
                  'text-orange-500': !camera.annotations?.length > 0,
                }"
              />
            </div>
            <div class="flex flex-col items-start overflow-hidden">
              <UInput
                v-if="isEditing && selectedCameraId === camera.id"
                v-model="camera.name"
                @keydown.enter="saveEdit"
              />
              <p v-else class="font-bold truncate w-full">{{ camera.name }}</p>
              <UInput
                v-if="isEditing && selectedCameraId === camera.id"
                v-model="camera.description"
                @keydown.enter="saveEdit"
              />
              <span v-else class="text-sm text-gray-200">{{
                camera.description
              }}</span>
            </div>

            <UButton
              v-if="selectedCameraId === camera.id"
              variant="outline"
              size="xs"
              color="error"
              icon="i-lucide-trash-2"
              class="ml-auto"
              @click.stop="
                state.splice(state.indexOf(camera), 1);
                isEditing = false;
                selectedCameraId = state.length > 0 ? state[0].id : null;
              "
            />
          </div>
          <ul
            v-if="
              camera.annotations?.length > 0 && selectedCameraId === camera.id
            "
            class="w-full p-4 flex flex-col gap-2"
          >
            <li
              v-for="annotation in camera.annotations"
              :key="annotation.id"
              class="flex items-center justify-between min-w-0 bg-primary-50 rounded-md p-1 text-gray-800"
            >
              <UInput
                v-if="
                  isEditingAnnotation && currentAnnotationId === annotation.id
                "
                v-model="annotation.name"
                @keydown.enter="saveEdit"
              />
              <span v-else class="text-sm"> {{ annotation.name }}</span>

              <span class="flex items-center gap-2 ml-2">
                <UButton
                  size="xs"
                  class="text-xs"
                  variant="outline"
                  color="primary"
                  icon="i-lucide-pencil"
                  @click.stop="handleAnnotationEdit(annotation.id)"
                />
                <UButton
                  variant="outline"
                  size="xs"
                  color="error"
                  icon="i-lucide-trash-2"
                  @click.stop="
                    camera.annotations.splice(
                      camera.annotations.indexOf(annotation),
                      1
                    )
                  "
                />
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <template #fallback>
      <UProgress color="neutral" />
    </template>
  </client-only>
</template>
