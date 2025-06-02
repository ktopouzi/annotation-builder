<script setup>
const {
  annotationStats,
  currentCameraImageUrl,
  selectedTool,
  tools,
  navigateToPreviousCamera,
  navigateToNextCamera,
  selectedCamera,
} = useAnnotationBuilder();

const { exportAsJson, exportAsImage } = useAnnotationExporter();

const exportItems = computed(() => [
  {
    label: "Export as JSON",
    icon: "i-lucide-download",
    disabled: !selectedCamera.value?.annotations.length,
    onSelect() {
      handleExportJson();
    },
  },
  {
    label: "Export as PNG",
    icon: "i-lucide-download",
    onSelect() {
      exportAsImage();
    },
  },
]);

function handleExportJson() {
  exportAsJson(selectedCamera.value?.annotations, selectedCamera.value?.id);
}
</script>

<template>
  <header
    class="h-auto md:h-16 p-2 gap-2 flex flex-wrap justify-center w-full md:flex-row shrink-0 items-center md:justify-between border-b border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800"
  >
    <div class="flex items-center">
      <UPopover arrow>
        <UButton icon="i-lucide-info" color="primary" variant="ghost" />

        <template #content>
          <div class="text-md font-semibold p-2 flex flex-col gap-2">
            Hint:

            <p>Right click on an annotation point to delete it!</p>
            <p>Double click on an annotation to delete it!</p>

            <p>Use <UKbd>[</UKbd> to select the previous camera</p>
            <p>Use <UKbd>]</UKbd> to select the next camera</p>

            <p>Use <UKbd>P</UKbd> to select the polygon tool</p>
            <p>Use <UKbd>D</UKbd> to select the directional tool</p>
            <p>Press <UKbd>ESC</UKbd> to clear your selections</p>
          </div>
        </template>
      </UPopover>
      <UButton
        icon="i-lucide-chevron-left"
        variant="ghost"
        :disabled="annotationStats.currentIndex === 0"
        @click="navigateToPreviousCamera"
      >
        Previous
      </UButton>
      <UButton
        icon="i-lucide-chevron-right"
        variant="ghost"
        trailing
        :disabled="annotationStats.currentIndex === annotationStats.total - 1"
        @click="navigateToNextCamera"
      >
        Next
      </UButton>
    </div>

    <UBadge size="sm" class="font-bold rounded-full"
      >{{ annotationStats.fraction }} cameras annotated</UBadge
    >
    <div class="flex items-center gap-2">
      <USelect
        v-if="currentCameraImageUrl"
        v-model="selectedTool"
        :items="tools"
        option-attribute="label"
        value-attribute="value"
        class="shrink-0 w-32"
      />

      <UDropdownMenu
        arrow
        :items="exportItems"
        :ui="{
          content: 'w-48',
        }"
      >
        <UButton
          label="Export"
          trailing
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="outline"
        />
      </UDropdownMenu>
    </div>
  </header>
</template>
