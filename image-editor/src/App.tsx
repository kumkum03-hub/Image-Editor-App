import './App.css';
import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, FabricImage, PencilBrush, Circle, IText } from "fabric";
import Toolbar from "../src/Components/Toolbar";

function App() {

  const canvasRef = useRef<Canvas | null>(null);
  const historyIndexRef = useRef(-1);
  const historyRef = useRef<string[]>([]);

  const [history, setHistory] = useState<string[]>([]);

  const [cropMode, setCropMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);

  

  //to save history for undo and redo 
  const saveHistory = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());

    const currentIndex = historyIndexRef.current;

    const newHistory = historyRef.current.slice(0, currentIndex + 1);

    newHistory.push(json);

    historyRef.current = newHistory;
    setHistory(newHistory);

    const newIndex = newHistory.length - 1;

    historyIndexRef.current = newIndex;
  };

  //handle rotate
  const HandleRotate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const currentAngle = activeObject.angle ?? 0;

    activeObject.set({
      angle: currentAngle + 90,
    });

    activeObject.setCoords();
    canvas.requestRenderAll();
    saveHistory();
  }

  //to add text 
  const handleAddText = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const text = new IText("Your text", {
      left: 200,
      top: 150,
      fontSize: 20,
      fill: "black",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();

    saveHistory();
  }

  //to add circle
  const handleAddCircle = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 60,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
    })

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();

    saveHistory();
  }

  //to add rect
  const handleAddRectangle = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rectangle = new Rect({
      left: 300,
      top: 200,
      width: 200,
      height: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
    })

    canvas.add(rectangle);
    canvas.setActiveObject(rectangle);
    canvas.requestRenderAll();

    saveHistory();
  }

  //undo
  const handleUndo = async () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const currentIndex = historyIndexRef.current;

    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;

    await canvas.loadFromJSON(history[newIndex]);

    canvas.requestRenderAll();

    historyIndexRef.current = newIndex;
  };

  //redo
  const handleRedo = async () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const currentIndex = historyIndexRef.current;

    if (currentIndex >= history.length - 1) return;

    const newIndex = currentIndex + 1;

    await canvas.loadFromJSON(history[newIndex]);

    canvas.requestRenderAll();

    historyIndexRef.current = newIndex;
  };

  //draw mode
  const handleDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = !canvas.isDrawingMode;
    setIsDrawing(canvas.isDrawingMode);

    if (canvas.isDrawingMode) {
      const brush = new PencilBrush(canvas);
      brush.width = 5;
      brush.color = "black";
      canvas.freeDrawingBrush = brush;
    }
  };

    //zoom in
  const handleZoomIn = () =>{
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoom = canvas.getZoom() * 1.1; 
    canvas.setZoom(zoom);
  }

   //zoom out
  const handleZoomOut = () =>{
    const canvas = canvasRef.current;
    if (!canvas) return;

    const zoom = canvas.getZoom() / 1.1;
    canvas.setZoom(zoom);
  }

  //crop
  const handleCrop = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const activeObject = canvas.getActiveObject();

    if (!activeObject) return;

    if (!(activeObject instanceof FabricImage)) return;

    setCropMode(true);

    const image = activeObject;

    const cropBox = new Rect({
      left: image.left,
      top: image.top,
      width: image.getScaledWidth(),
      height: image.getScaledHeight(),
      fill: "rgba(0, 0, 0, 0.2)",
      stroke: "black",
      strokeWidth: 2,
      transparentCorners: false,
    });

    canvas.add(cropBox);
    canvas.setActiveObject(cropBox);

    setCropMode(true);

    canvas.requestRenderAll();
  };

  //apply crop
  const handleApplyCrop = async () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const cropBox = canvas.getActiveObject();

    if (!cropBox) return;

    const objects = canvas.getObjects();

    const image = objects.find(
      (object) => object instanceof FabricImage
    );

    if (!image) return;

    const imageBounds = image.getBoundingRect();

    const cropBounds = cropBox.getBoundingRect();

    const imageElement = image.getElement();

    const scaleX = imageElement.width / imageBounds.width;
    const scaleY = imageElement.height / imageBounds.height;

    const sourceX =
      (cropBounds.left - imageBounds.left) * scaleX;

    const sourceY =
      (cropBounds.top - imageBounds.top) * scaleY;

    const sourceWidth =
      cropBounds.width * scaleX;

    const sourceHeight =
      cropBounds.height * scaleY;

    const croppedCanvas = document.createElement("canvas");

    croppedCanvas.width = sourceWidth;
    croppedCanvas.height = sourceHeight;

    const ctx = croppedCanvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      imageElement,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sourceWidth,
      sourceHeight
    );

    const croppedImageURL = croppedCanvas.toDataURL("image/png");

    const croppedImage = await FabricImage.fromURL(croppedImageURL);

    croppedImage.set({
      left: cropBounds.left,
      top: cropBounds.top,
    });

    croppedImage.scaleToWidth(cropBounds.width);
    croppedImage.scaleToHeight(cropBounds.height);

    canvas.remove(image);
    canvas.remove(cropBox);

    canvas.add(croppedImage);
    canvas.setActiveObject(croppedImage);

    canvas.requestRenderAll();

    setCropMode(false);

    saveHistory();
  };

  //handle export

  const handleExport = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const imageURL = canvas.toDataURL();

    const link = document.createElement("a");

    link.href = imageURL;
    link.download = "edited-image.png";

    link.click();
  };

  //handle json export 
  const handleExportJSON = () => {
  const canvas = canvasRef.current;

  if (!canvas) return;

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

  const jsonString = JSON.stringify(exportData, null, 2);

  const blob = new Blob([jsonString], {
    type: "application/json",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "edited-image.json";

  link.click();

  URL.revokeObjectURL(link.href);
};

  //upload toggle
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;
    const imageURL = URL.createObjectURL(file);

    FabricImage.fromURL(imageURL).then((img) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      );

      img.scale(scale);
      img.set({
        left: (canvas.width! - img.getScaledWidth()) / 2,
        top: (canvas.height! - img.getScaledHeight()) / 2,
      });

      canvas.centerObject(img);
      img.setCoords();
      canvas.add(img);

      canvas.requestRenderAll();

      saveHistory();
    });


    console.log(file);
  };

  useEffect(() => {
    const canvas = new Canvas("canvas", {
      width: 800,
      height: 600,
      backgroundColor: "white",
    });

    canvasRef.current = canvas;

    const initialState = JSON.stringify(canvas.toJSON());

    historyRef.current = [initialState];

    setHistory([initialState]);
    historyIndexRef.current = 0;

    const handleObjectModified = () => {
      saveHistory();
    };

    canvas.on("object:modified", handleObjectModified);

    const handlePathCreated = () => {
      saveHistory();
    };

    canvas.on("path:created", handlePathCreated);

    return () => {
      canvas.off("object:modified", handleObjectModified);
      canvas.off("path:created", handlePathCreated);

      canvas.dispose();
      canvasRef.current = null;
    };
  }, []);

  return (
    <div className={`app-root ${darkMode ? 'dark' : 'light'}`}>
      <nav className="navbar">
        <div className="navbar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Image Editor</span>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </nav>
      <div className="app-layout">
        <Toolbar
          onUpload={handleImageUpload}
          onDraw={handleDraw}
          onAddRectangle={handleAddRectangle}
          onAddCircle={handleAddCircle}
          onAddText={handleAddText}
          onRotate={HandleRotate}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onCrop={handleCrop}
          onZoomIn = {handleZoomIn}
          onZoomOut = {handleZoomOut}
          onApplyCrop={handleApplyCrop}
          onExport={handleExport}
          onExportJSON={handleExportJSON}
          isDrawing={isDrawing}
          isCropping={cropMode}
        />
        <main className="editor-area">
          <div className="canvas-wrapper">
            <canvas id="canvas" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;