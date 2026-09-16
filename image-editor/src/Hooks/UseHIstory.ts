import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";

type HistoryEntry = {
  json: string;
  width: number;
  height: number;
};

const useHistory = (
  canvasRef: React.RefObject<Canvas | null>,
  canvas: Canvas | null,
  onRestore?: () => void
) => {
  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const saveHistory = () => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;
    if (isRestoringRef.current) return;

    const entry: HistoryEntry = {
      json: JSON.stringify(currentCanvas.toJSON(['src', 'crossOrigin'])),
      width: currentCanvas.getWidth(),
      height: currentCanvas.getHeight(),
    };

    const currentIndex = historyIndexRef.current;
    const newHistory = historyRef.current.slice(0, currentIndex + 1);

    if (newHistory.length > 0) {
      const last = newHistory[newHistory.length - 1];
      if (last.json === entry.json && last.width === entry.width && last.height === entry.height) return;
    }

    newHistory.push(entry);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistory(newHistory);
  };

  useEffect(() => {
    if (!canvas) return;

    const initialEntry: HistoryEntry = {
      json: JSON.stringify(canvas.toJSON(['src', 'crossOrigin'])),
      width: canvas.getWidth(),
      height: canvas.getHeight(),
    };

    historyRef.current = [initialEntry];
    historyIndexRef.current = 0;
    setHistory([initialEntry]);

    const handleObjectModified = () => saveHistory();
    const handlePathCreated = () => saveHistory();

    canvas.on("object:modified", handleObjectModified);
    canvas.on("path:created", handlePathCreated);

    return () => {
      canvas.off("object:modified", handleObjectModified);
      canvas.off("path:created", handlePathCreated);
    };
  }, [canvas]);

  const undo = async () => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const currentIndex = historyIndexRef.current;
    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;
    isRestoringRef.current = true;
    historyIndexRef.current = newIndex;

    try {
      const entry = historyRef.current[newIndex];
      currentCanvas.setDimensions({ width: entry.width, height: entry.height });
      await currentCanvas.loadFromJSON(entry.json);
      currentCanvas.requestRenderAll();
      onRestore?.();
    } finally {
      isRestoringRef.current = false;
    }
  };

  const redo = async () => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const currentIndex = historyIndexRef.current;
    if (currentIndex >= historyRef.current.length - 1) return;

    const newIndex = currentIndex + 1;
    isRestoringRef.current = true;
    historyIndexRef.current = newIndex;

    try {
      const entry = historyRef.current[newIndex];
      currentCanvas.setDimensions({ width: entry.width, height: entry.height });
      await currentCanvas.loadFromJSON(entry.json);
      currentCanvas.requestRenderAll();
      onRestore?.();
    } finally {
      isRestoringRef.current = false;
    }
  };

  return { history, saveHistory, undo, redo };
};

export default useHistory;