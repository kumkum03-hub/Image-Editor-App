import { useEffect, useState } from "react";
import { Canvas, Rect, FabricImage, PencilBrush, Circle, IText, } from "fabric";

const useEditor = (
    canvasRef: React.RefObject<Canvas | null>,
    saveHistory: () => void
) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [cropMode, setCropMode] = useState(false);
    const [activeTool, setActiveTool] = useState<
        "draw" | "rectangle" | "circle" | null
    >(null);

    //states for draw settingPanel
    const [strokeColor, setStrokeColor] = useState("black");
    const [strokeWidth, setStrokeWidth] = useState(5);

    //states for rect settingPanel
    const [fillColor, setFillColor] = useState("transparent");
    const [shapeStrokeColor, setShapeStrokeColor] = useState("#000000");
    const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);

    //func to uodate the settings of selected shape
    const updateSelectedShape = (
        property: "fill" | "stroke" | "strokeWidth",
        value: string | number
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const activeObject = canvas.getActiveObject();

        if (!activeObject) return;

        activeObject.set(property, value);

        activeObject.setCoords();
        canvas.requestRenderAll();

        // saveHistory();
    };

    //rotate handle
    const rotate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const activeObject = canvas.getActiveObject();
        if (!activeObject) return;

        const currentAngle = activeObject.angle ?? 0;

        activeObject.set({ angle: currentAngle + 90 });
        activeObject.setCoords();

        if (activeObject instanceof FabricImage) {
            const { width, height } = activeObject.getBoundingRect();
            canvas.setDimensions({ width, height });
            canvas.centerObject(activeObject);
            activeObject.setCoords();
        }

        canvas.requestRenderAll();
        saveHistory();
    };

    //handle add text
    const addText = () => {
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
    };

    //handle circle
    const addCircle = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setActiveTool("circle");
        const circle = new Circle({
            left: 100,
            top: 100,
            radius: 60,
            fill: fillColor,
            stroke: shapeStrokeColor,
            strokeWidth: shapeStrokeWidth,
        });

        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.requestRenderAll();

        saveHistory();
    };

    //handle rect
    const addRectangle = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setActiveTool("rectangle");
        const rectangle = new Rect({
            left: 300,
            top: 200,
            width: 200,
            height: 100,
            fill: fillColor,
            stroke: shapeStrokeColor,
            strokeWidth: shapeStrokeWidth,
        });

        canvas.add(rectangle);
        canvas.setActiveObject(rectangle);
        canvas.requestRenderAll();

        saveHistory();
    };

    //draw handle
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.isDrawingMode = !canvas.isDrawingMode;

        setIsDrawing(canvas.isDrawingMode);

        if (canvas.isDrawingMode) {
            setActiveTool("draw");
            const brush = new PencilBrush(canvas);

            brush.width = strokeWidth;
            brush.color = strokeColor;

            canvas.freeDrawingBrush = brush;
        } else {
            setActiveTool(null);
        }
    };
    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = strokeColor;
            canvas.freeDrawingBrush.width = strokeWidth;
        }
    }, [strokeColor, strokeWidth, canvasRef]);
    //handle zoom in
    const zoomIn = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const zoom = canvas.getZoom() * 1.1;

        canvas.setZoom(zoom);
    };

    //handle zoom out
    const zoomOut = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const zoom = canvas.getZoom() / 1.1;

        canvas.setZoom(zoom);
    };

    //crop
    const crop = () => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        if (cropMode) {
            const cropBox = canvas.getObjects().find(
                (obj) => obj instanceof Rect && !(obj instanceof FabricImage)
            );
            if (cropBox) canvas.remove(cropBox);
            canvas.requestRenderAll();
            setCropMode(false);
            return;
        }

        const activeObject = canvas.getActiveObject();

        if (!activeObject) return;

        if (!(activeObject instanceof FabricImage)) return;

        const image = activeObject;

        setCropMode(true);

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

        canvas.requestRenderAll();
        saveHistory();
    };
    //apply ycrop
    const applyCrop = async () => {
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

        const croppedImageURL =
            croppedCanvas.toDataURL("image/png");

        const croppedImage =
            await FabricImage.fromURL(croppedImageURL);

        croppedImage.set({
            left: cropBounds.left,
            top: cropBounds.top,
        });

        croppedImage.scaleToWidth(cropBounds.width);
        croppedImage.scaleToHeight(cropBounds.height);

        canvas.remove(image);
        canvas.remove(cropBox);

        canvas.add(croppedImage);
        canvas.setDimensions({
            width: cropBounds.width,
            height: cropBounds.height,
        });

        canvas.centerObject(croppedImage);
        croppedImage.setCoords();

        canvas.setActiveObject(croppedImage);

        canvas.requestRenderAll();

        setCropMode(false);

        saveHistory();
    };

    return {
        rotate,
        addText,
        addCircle,
        addRectangle,
        draw,
        zoomIn,
        zoomOut,
        crop,
        applyCrop,
        isDrawing,
        cropMode,
        resetCropMode: () => setCropMode(false),
        activeTool,

        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,

        fillColor,
        setFillColor,
        shapeStrokeColor,
        setShapeStrokeColor,
        shapeStrokeWidth,
        setShapeStrokeWidth,
        updateSelectedShape,
    };
};

export default useEditor;