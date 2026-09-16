import { Canvas } from "fabric";

export const exportImage = (canvas: Canvas) => {
  const imageURL = canvas.toDataURL();

  const link = document.createElement("a");

  link.href = imageURL;
  link.download = "edited-image.png";

  link.click();
};

export const exportJSON = (canvas: Canvas) => {
  const canvasData = canvas.toJSON();

  const exportData = {
    canvas: {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
    },

    metadata: {
      exportedAt: new Date().toISOString(),
      objectCount: canvas.getObjects().length,
    },

    objects: canvasData.objects,
  };

  const jsonString = JSON.stringify(
    exportData,
    null,
    2
  );

  const blob = new Blob([jsonString], {
    type: "application/json",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "edited-image.json";

  link.click();

  URL.revokeObjectURL(link.href);
};