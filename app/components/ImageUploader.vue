<script setup>
const { selectedCamera, currentCameraImageUrl } = useCameras();

const uploadedUrl = ref("");
const dragging = ref(false);
const fileInput = ref(null);

function handleFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result;
    const res = await $fetch("/api/upload-image", {
      method: "POST",
      body: {
        name: file.name,
        data: base64,
      },
    });
    uploadedUrl.value = res.path;
    selectedCamera.value.imageURL = res.path;
  };
  reader.readAsDataURL(file);
}

function onDrop(e) {
  e.preventDefault();
  dragging.value = false;
  const file = e.dataTransfer.files[0];
  handleFile(file);
}

function onFileChange(e) {
  const file = e.target.files[0];
  handleFile(file);
}

function triggerFilePicker() {
  fileInput.value?.click();
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full p-4">
    <div v-if="uploadedUrl && currentCameraImageUrl.length" class="w-full">
      <img :src="uploadedUrl" class="object-cover rounded shadow" />
    </div>

    <div
      v-else
      class="w-full h-full border-2 border-dashed border-gray-300 flex flex-col justify-center items-center rounded cursor-pointer hover:border-blue-400 transition"
      :class="{ 'bg-blue-50': dragging }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop="onDrop"
      @click="triggerFilePicker"
    >
      <span class="text-gray-500">Drag & drop image here</span>
      <span class="text-sm text-gray-400 mt-1">or click to browse</span>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      />
    </div>
  </div>
</template>
