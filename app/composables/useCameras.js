export default function useCameras() {
  const cameras = useState("cameras", () => [
    {
      id: "camera1",
      name: "Receiving Dock",
      description: "The receiving dock camera monitors the loading area.",
      annotated: false,
      annotations: [],
      imageURL: "",
    },
    {
      id: "camera2",
      name: "High-Value Storage",
      description: "Operational area",
      annotated: false,
      annotations: [],
      imageURL: "",
    },
    {
      id: "camera3",
      name: "Picking",
      description: "Operational area",
      annotated: false,
      annotations: [],
      imageURL: "",
    },
    {
      id: "camera4",
      name: "Assembly Line",
      description: "Operational area",
      annotated: false,
      annotations: [],
      imageURL: "",
    },
  ]);

  const selectedCamera = useState("selectedCamera", () => cameras.value[0]);

  return { cameras, selectedCamera };
}
