<script setup>
const { navigateToPreviousCamera, navigateToNextCamera, setCurrentTool } =
  useAnnotationBuilder();

defineShortcuts({
  "[": () => navigateToPreviousCamera(),
  "]": () => navigateToNextCamera(),
  p: () => setCurrentTool(),
  d: () => setCurrentTool("directional"),
});
</script>

<template>
  <div class="flex h-screen">
    <AppSidebar />
    <div class="flex flex-col flex-1">
      <AppHeader />
      <AppBody />
    </div>
  </div>
</template>
