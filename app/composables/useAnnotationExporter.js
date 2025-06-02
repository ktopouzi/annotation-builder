export function useAnnotationExporter() {
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

  // export as image can go here  with the help of html2canvas or similar library

  return {
    exportAsJson,
  };
}
