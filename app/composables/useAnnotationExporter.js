import html2canvas from "html2canvas-pro";

export function useAnnotationExporter() {
  const { containerRef } = useAnnotationBuilder();

  function exportAsJson(annotations, cameraId = "camera-1") {
    const payload = {
      cameraId,
      annotations: annotations.map((a) => {
        if (a.type === "polygon") {
          return {
            type: "polygon",
            points: a.points,
          };
        } else if (a.type === "direction") {
          return {
            type: "direction",
            start: { x: a.start.x, y: a.start.y },
            end: { x: a.end.x, y: a.end.y },
          };
        }
        return a;
      }),
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${cameraId}_annotations.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportAsImage() {
    if (!containerRef.value) return;

    console.log("here");

    const canvas = await html2canvas(containerRef.value, {
      useCORS: true,
      backgroundColor: null,
      scale: window.devicePixelRatio,
    });

    // Convert to PNG and download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "annotated-image.png";
    link.href = dataUrl;
    link.click();
  }
  return {
    exportAsJson,
    exportAsImage,
  };
}
