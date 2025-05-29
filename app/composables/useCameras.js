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
      annotations: [
        {
          id: "annotation1",
          name: "High-Value Item",
          type: "box",
          coordinates: { x: 100, y: 150, width: 200, height: 100 },
          label: "High-Value Item",
        },

        {
          id: "annotation2",
          name: "High-Value Item 2",
          type: "box",
          coordinates: { x: 300, y: 250, width: 150, height: 80 },
          label: "High-Value Item 2",
        },
      ],
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
  const selectedCameraId = useState(
    "selectedCameraId",
    () => selectedCamera.value.id
  );

  return { cameras, selectedCamera, selectedCameraId };
}
