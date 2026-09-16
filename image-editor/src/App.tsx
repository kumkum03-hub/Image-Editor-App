import './App.css';
import { useRef, useState } from "react";
import Toolbar from "../src/Components/Toolbar";
import Navbar from './Components/Navbar';
import EdCanvas from './Components/EditorCanvas';
import useCanvas from './Hooks/UseCanvas';
import useHistory from './Hooks/UseHIstory';
import { createFabricImageFromFile, getImageDimensions } from "./Utils/imageUtils";
import { exportImage, exportJSON } from "./Utils/exportUtils";
import useEditorTools from "./Hooks/UseEditorTools";
import SettingsPanel from "./Components/SettingsPanel";

function App() {

  const { canvasRef, canvas } = useCanvas();

  const saveHistoryRef = useRef<() => void>(() => { });

  const { rotate, addText, addCircle, addRectangle, draw, zoomIn, zoomOut, isDrawing, cropMode, crop, applyCrop, resetCropMode,
    strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, activeTool, fillColor, setFillColor, shapeStrokeColor,
    setShapeStrokeColor, shapeStrokeWidth, setShapeStrokeWidth, updateSelectedShape, } = useEditorTools(canvasRef, () => saveHistoryRef.current());

  const { saveHistory, undo, redo } = useHistory(canvasRef, canvas, resetCropMode);

  console.log("Active tool:", activeTool);

  // keep ref in sync
  saveHistoryRef.current = saveHistory;

  const [darkMode, setDarkMode] = useState(true);

  //handle export
  const handleExport = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    exportImage(canvas);
  };

  //handle json export
  const handleExportJSON = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    exportJSON(canvas);
  };

  //upload toggle
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const img = await createFabricImageFromFile(file);

    const { width, height } = getImageDimensions(img);

    canvas.setDimensions({
      width,
      height,
    });

    img.set({
      left: 0,
      top: 0,
      scaleX: 1,
      scaleY: 1,
    });

    canvas.centerObject(img);
    img.setCoords();

    canvas.clear();
    canvas.add(img);

    canvas.requestRenderAll();

    saveHistoryRef.current();
  };


  return (
    <div className={`app-root ${darkMode ? 'dark' : 'light'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="app-layout">
        <Toolbar
          onUpload={handleImageUpload}
          onDraw={draw}
          onAddRectangle={addRectangle}
          onAddCircle={addCircle}
          onAddText={addText}
          onRotate={rotate}
          onUndo={undo}
          onRedo={redo}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onCrop={crop}
          onApplyCrop={applyCrop}
          onExport={handleExport}
          onExportJSON={handleExportJSON}
          isDrawing={isDrawing}
          isCropping={cropMode}
        />

        <div className="editor-container">

          <EdCanvas />

          {activeTool && (

            <SettingsPanel
              activeTool={activeTool}

              strokeColor={strokeColor}
              setStrokeColor={setStrokeColor}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}

              fillColor={fillColor}
              setFillColor={setFillColor}

              shapeStrokeColor={shapeStrokeColor}
              setShapeStrokeColor={setShapeStrokeColor}

              shapeStrokeWidth={shapeStrokeWidth}
              setShapeStrokeWidth={setShapeStrokeWidth}

              updateSelectedShape={updateSelectedShape}
            />
          )};
        </div>

      </div>
    </div>
  );
}

export default App;