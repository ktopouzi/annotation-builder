import { useLocalStorage } from "@vueuse/core";

const defaultCameras = [
  {
    id: "camera1",
    name: "Receiving Dock",
    description: "The receiving dock camera monitors the loading area.",
    annotated: false, // useful if it comes from the server
    annotations: [],
    imageURL: "",
  },
  {
    id: "camera2",
    name: "High-Value Storage",
    description: "Operational area",
    annotated: true, // useful if it comes from the server
    annotations: [],
    imageURL: "",
  },
  {
    id: "camera3",
    name: "Picking",
    description: "Operational area",
    annotated: false, // useful if it comes from the server
    annotations: [],
    imageURL: "",
  },
  {
    id: "camera4",
    name: "Assembly Line",
    description: "Operational area",
    annotated: false, // useful if it comes from the server
    annotations: [],
    imageURL: "",
  },
];

export default function useAnnotationBuilder() {
  const isEditing = useState("isEditing", () => false);
  const imageRef = useState("imageRef", () => null);
  const selectedAnnotationIndex = useState(
    "selectedAnnotationIndex",
    () => null
  );
  const selectedTool = useState("selectedTool", () => "polygon");
  const tools = ref([
    { label: "Polygon", value: "polygon" },
    { label: "Directional", value: "directional" },
  ]);

  function setCurrentTool(tool = "polygon") {
    selectedTool.value = tool;
  }

  // create shared state for cameras.
  // this will be used to store the cameras in memory and in local storage
  // usually, you would use a database or an API to store this data
  const shared = useState("cameras", () => defaultCameras);
  const stored = useLocalStorage("cameras", defaultCameras, {
    mergeDefaults: true,
  });

  const state = computed({
    get: () => shared.value,
    set: (value) => {
      shared.value = value;
      stored.value = value;
    },
  });

  function read() {
    state.value = stored.value;
  }

  watch(state, (newValue) => {
    //if selectedCameraId is not in the new value, reset it to the first camera
    if (
      !newValue.some((camera) => camera.id === selectedCameraId.value) &&
      newValue.length > 0
    ) {
      selectedCameraId.value = newValue[0].id;
    }
  });

  const selectedCameraId = useState(
    "selectedCameraId",
    () => state.value[0].id
  );

  const selectedCamera = computed(() => {
    return (
      state.value.find((camera) => camera.id === selectedCameraId.value) || {}
    );
  });

  const currentCameraImageUrl = computed(() => {
    return selectedCamera.value.imageURL || "";
  });

  function addCamera(camera) {
    state.value.push(camera);

    selectedCamera.value = camera;
    selectedCameraId.value = camera.id;
    isEditing.value = true;
  }

  const camerasWithAnnotations = computed(() => {
    return state.value.reduce((count, camera) => {
      return (
        count + (camera.annotations && camera.annotations.length > 0 ? 1 : 0)
      );
    }, 0);
  });

  const annotationStats = computed(() => {
    const total = state.value.length;
    const annotated = camerasWithAnnotations.value;
    const fraction = `${annotated}/${total}`;

    const currentIndex = state.value.findIndex(
      (camera) => camera.id === selectedCameraId.value
    );

    return {
      annotated,
      total,
      fraction,
      currentIndex,
    };
  });

  // Navigation functions to switch between cameras
  // TODO: merge to a single function that takes a direction parameter
  // and handles both previous and next navigation

  function navigateToPreviousCamera() {
    const currentIndex = state.value.findIndex(
      (camera) => camera.id === selectedCameraId.value
    );
    if (currentIndex > 0) {
      selectedCameraId.value = state.value[currentIndex - 1].id;
    }
  }

  function navigateToNextCamera() {
    const currentIndex = state.value.findIndex(
      (camera) => camera.id === selectedCameraId.value
    );
    if (currentIndex < state.value.length - 1) {
      selectedCameraId.value = state.value[currentIndex + 1].id;
    }
  }

  onMounted(() => {
    nextTick(() => {
      // Ensure the state is initialized with the stored value
      read();
    });
  });

  return {
    addCamera,
    currentCameraImageUrl,
    isEditing,
    selectedCamera,
    selectedCameraId,
    state,
    read,
    annotationStats,
    selectedTool,
    tools,
    navigateToPreviousCamera,
    navigateToNextCamera,
    setCurrentTool,
    selectedAnnotationIndex,
    imageRef,
  };
}
