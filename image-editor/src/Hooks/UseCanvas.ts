import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";

const useCanvas = () => {

  const canvasRef = useRef<Canvas | null>(null);

  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {

    const newCanvas = new Canvas("canvas", {
      width: 800,
      height: 600,
      backgroundColor: "white",
    });

    canvasRef.current = newCanvas;

    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
      canvasRef.current = null;
      setCanvas(null);
    };

  }, []);

  return {
    canvasRef,
    canvas,
  };
};

export default useCanvas;