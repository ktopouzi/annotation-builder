<script setup>
const {
  currentCameraImageUrl,
  state,
  selectedCameraId,
  selectedCamera,
  selectedTool,
  tools,
} = useAnnotationBuilder();

const imageRef = ref(null);
const annotations = ref([]);

const drawing = ref(false);
const currentPoints = ref([]);
const previewPoint = ref(null);

const imageRect = ref({ width: 0, height: 0, left: 0, top: 0 });

// For interactivity
const selectedAnnotationIndex = ref(null);
const selectedPointIndex = ref(null);
const dragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

function updateImageRect() {
  requestAnimationFrame(() => {
    if (imageRef.value) {
      const rect = imageRef.value.getBoundingClientRect();
      imageRect.value = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
    }
  });
}

function getRelativePoint(e) {
  const { left, top, width, height } = imageRect.value;
  const x = ((e.clientX - left) / width) * 100;
  const y = ((e.clientY - top) / height) * 100;
  return { x, y };
}

function pointsDistance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function reset() {
  drawing.value = false;
  currentPoints.value = [];
  previewPoint.value = null;
  selectedAnnotationIndex.value = null;
  selectedPointIndex.value = null;
  dragging.value = false;
  dragStart.value = { x: 0, y: 0 };
}

function onImageClick(e) {
  if (dragging.value) return; // don't create when dragging

  updateImageRect();
  const point = getRelativePoint(e);

  // If editing mode active (selected annotation) do nothing here for drawing, but allow deselect
  if (selectedAnnotationIndex.value !== null) {
    // Click outside polygons or directional lines will deselect below
    // But clicks on annotation elements stop propagation
    // So here, we assume this click is on background → deselect
    selectedAnnotationIndex.value = null;
    selectedPointIndex.value = null;
    drawing.value = false;
    currentPoints.value = [];
    previewPoint.value = null;
    return;
  }

  if (!drawing.value) {
    drawing.value = true;
    currentPoints.value = [];
    previewPoint.value = null;
  }

  if (selectedTool.value === "polygon") {
    currentPoints.value.push(point);

    if (currentPoints.value.length > 2) {
      const first = currentPoints.value[0];
      const dist = pointsDistance(point, first);
      if (dist < 5) {
        // Close polygon and save
        annotations.value.push({
          name: `Polygon ${annotations.value.length + 1}`,
          id: annotations.value.length + 1,
          type: "polygon",
          points: [...currentPoints.value.slice(0, -1)],
        });
        drawing.value = false;
        currentPoints.value = [];
        previewPoint.value = null;
      }
    }
  } else if (selectedTool.value === "directional") {
    currentPoints.value.push(point);
    if (currentPoints.value.length === 2) {
      annotations.value.push({
        name: `Arrow ${annotations.value.length + 1}`,
        id: annotations.value.length + 1,
        type: "directional",
        from: currentPoints.value[0],
        to: currentPoints.value[1],
      });
      drawing.value = false;
      currentPoints.value = [];
      previewPoint.value = null;
    }
  }
}

function onMouseMove(e) {
  updateImageRect();
  if (drawing.value) {
    if (
      selectedTool.value === "directional" &&
      currentPoints.value.length === 1
    ) {
      previewPoint.value = getRelativePoint(e);
    } else if (
      selectedTool.value === "polygon" &&
      currentPoints.value.length > 0
    ) {
      previewPoint.value = getRelativePoint(e);
    }
  }

  if (dragging.value && selectedAnnotationIndex.value !== null) {
    const point = getRelativePoint(e);
    const ann = annotations.value[selectedAnnotationIndex.value];

    if (ann.type === "polygon") {
      if (selectedPointIndex.value === null) {
        // Move whole polygon
        const dx = point.x - dragStart.value.x;
        const dy = point.y - dragStart.value.y;
        ann.points = ann.points.map((p) => ({
          x: Math.min(100, Math.max(0, p.x + dx)),
          y: Math.min(100, Math.max(0, p.y + dy)),
        }));
        dragStart.value = point;
      } else {
        // Move a single point of polygon
        ann.points[selectedPointIndex.value] = {
          x: Math.min(100, Math.max(0, point.x)),
          y: Math.min(100, Math.max(0, point.y)),
        };
      }
    } else if (ann.type === "directional") {
      // selectedPointIndex 0 = from, 1 = to, null = move whole
      if (selectedPointIndex.value === 0) {
        ann.from = {
          x: Math.min(100, Math.max(0, point.x)),
          y: Math.min(100, Math.max(0, point.y)),
        };
      } else if (selectedPointIndex.value === 1) {
        ann.to = {
          x: Math.min(100, Math.max(0, point.x)),
          y: Math.min(100, Math.max(0, point.y)),
        };
      } else {
        // Move whole arrow
        const dx = point.x - dragStart.value.x;
        const dy = point.y - dragStart.value.y;
        ann.from = {
          x: Math.min(100, Math.max(0, ann.from.x + dx)),
          y: Math.min(100, Math.max(0, ann.from.y + dy)),
        };
        ann.to = {
          x: Math.min(100, Math.max(0, ann.to.x + dx)),
          y: Math.min(100, Math.max(0, ann.to.y + dy)),
        };
        dragStart.value = point;
      }
    }
  }
}

function onMouseDownOnPoint(e, annIndex, pointIndex) {
  e.stopPropagation();
  selectedAnnotationIndex.value = annIndex;
  selectedPointIndex.value = pointIndex;
  dragging.value = true;
  dragStart.value = getRelativePoint(e);
}

function onMouseDownOnAnnotation(e, annIndex) {
  e.stopPropagation();
  reset();
  selectedAnnotationIndex.value = annIndex;
  selectedPointIndex.value = null;
  dragging.value = true;
  dragStart.value = getRelativePoint(e);
}

function onMouseUp() {
  dragging.value = false;
  selectedPointIndex.value = null;
  dragStart.value = { x: 0, y: 0 };
}

function onAnnotationClick(e, annIndex) {
  e.stopPropagation();
  selectedAnnotationIndex.value = annIndex;
}

function onAnnotationDblClick(e, annIndex) {
  e.stopPropagation();
  annotations.value.splice(annIndex, 1);
  selectedAnnotationIndex.value = null;
  selectedPointIndex.value = null;
}

onMounted(() => {
  nextTick(() => {
    updateImageRect();
    window.addEventListener("resize", updateImageRect);
  });
});

watch(
  annotations,
  (newAnnotations) => {
    const camera = state.value.find((c) => c.id === selectedCameraId.value);

    if (camera) {
      camera.annotations = newAnnotations;
    }
  },
  { immediate: true, deep: true }
);

watch(
  selectedCameraId,
  (newCameraId) => {
    const camera = state.value.find((c) => c.id === newCameraId);
    if (camera) {
      annotations.value = camera.annotations || [];
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div
      class="relative w-full"
      @click="onImageClick"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <img
        v-if="currentCameraImageUrl"
        ref="imageRef"
        :src="currentCameraImageUrl"
        alt="Annotation Target"
        class="w-full h-auto object-cover"
        @load="updateImageRect"
        draggable="false"
      />

      <svg
        class="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="4"
            markerHeight="4"
            refX="0"
            refY="2"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,4 L4,2 Z" fill="red" />
          </marker>
        </defs>

        <!-- Existing annotations -->
        <template v-for="(ann, index) in annotations" :key="index">
          <polygon
            v-if="ann.type === 'polygon'"
            :points="ann.points.map((p) => `${p.x},${p.y}`).join(' ')"
            :class="{
              'stroke-2 z-50': selectedAnnotationIndex === index,
            }"
            fill="rgba(0, 150, 255, 0.3)"
            stroke="primary"
            stroke-width="0.5"
            style="pointer-events: auto; cursor: move"
            @mousedown.prevent="onMouseDownOnAnnotation($event, index)"
            @click.stop="onAnnotationClick($event, index)"
            @dblclick.stop="onAnnotationDblClick($event, index)"
          />

          <!-- Polygon points for resizing -->
          <template
            v-if="selectedAnnotationIndex === index && ann.type === 'polygon'"
          >
            <circle
              v-for="(point, pIndex) in ann.points"
              :key="'point-' + pIndex"
              :cx="point.x"
              :cy="point.y"
              r="1"
              fill="blue"
              stroke="white"
              stroke-width="0.3"
              style="pointer-events: auto; cursor: pointer"
              @mousedown.prevent="onMouseDownOnPoint($event, index, pIndex)"
            />
          </template>

          <line
            v-if="ann.type === 'directional'"
            :x1="ann.from.x"
            :y1="ann.from.y"
            :x2="ann.to.x"
            :y2="ann.to.y"
            :class="{
              'annotation-selected': selectedAnnotationIndex === index,
            }"
            stroke="red"
            stroke-width="0.5"
            marker-end="url(#arrowhead)"
            style="pointer-events: auto; cursor: move"
            @mousedown.prevent="onMouseDownOnAnnotation($event, index)"
            @click="onAnnotationClick($event, index)"
            @dblclick="onAnnotationDblClick($event, index)"
          />

          <!-- Directional points for resizing -->
          <circle
            v-if="
              selectedAnnotationIndex === index && ann.type === 'directional'
            "
            :cx="ann.from.x"
            :cy="ann.from.y"
            r="1.5"
            fill="red"
            stroke="white"
            stroke-width="0.3"
            style="pointer-events: auto; cursor: pointer"
            @mousedown.prevent="onMouseDownOnPoint($event, index, 0)"
          />
          <circle
            v-if="
              selectedAnnotationIndex === index && ann.type === 'directional'
            "
            :cx="ann.to.x"
            :cy="ann.to.y"
            r="1.5"
            fill="red"
            stroke="white"
            stroke-width="0.3"
            style="pointer-events: auto; cursor: pointer"
            @mousedown.prevent="onMouseDownOnPoint($event, index, 1)"
          />
        </template>

        <!-- In-progress polygon -->
        <polyline
          v-if="
            drawing && selectedTool === 'polygon' && currentPoints.length > 0
          "
          :points="
            [...currentPoints, previewPoint ? previewPoint : null]
              .filter(Boolean)
              .map((p) => `${p.x},${p.y}`)
              .join(' ')
          "
          fill="none"
          stroke="blue"
          stroke-dasharray="1,1"
          stroke-width="0.5"
        />

        <!-- In-progress directional -->
        <line
          v-if="
            drawing &&
            selectedTool === 'directional' &&
            currentPoints.length === 1 &&
            previewPoint
          "
          :x1="currentPoints[0].x"
          :y1="currentPoints[0].y"
          :x2="previewPoint.x"
          :y2="previewPoint.y"
          stroke="red"
          stroke-dasharray="1,1"
          stroke-width="0.5"
          marker-end="url(#arrowhead)"
        />
      </svg>
    </div>
  </div>
</template>
