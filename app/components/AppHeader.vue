<script setup lang="ts">
const {
  annotationStats,
  currentCameraImageUrl,
  selectedTool,
  tools,
  navigateToPreviousCamera,
  navigateToNextCamera,
} = useAnnotationBuilder();
</script>

<template>
  <header
    class="h-auto md:h-16 p-2 flex flex-wrap justify-center w-full md:flex-row shrink-0 items-center md:justify-between border-b border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800"
  >
    <div class="flex items-center space-x-2">
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
    <div>
      <USelect
        v-if="currentCameraImageUrl"
        v-model="selectedTool"
        :items="tools"
        option-attribute="label"
        value-attribute="value"
        class="shrink-0 w-32"
      />
    </div>
  </header>
</template>
