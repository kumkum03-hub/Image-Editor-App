type SettingsPanelProps = {
    activeTool: "draw" | "rectangle" | "circle";

    strokeColor: string;
    setStrokeColor: (color: string) => void;

    strokeWidth: number;
    setStrokeWidth: (width: number) => void;

    fillColor: string;
    setFillColor: (color: string) => void;

    shapeStrokeColor: string;
    setShapeStrokeColor: (color: string) => void;

    shapeStrokeWidth: number;
    setShapeStrokeWidth: (width: number) => void;

    updateSelectedShape: (
        property: "fill" | "stroke" | "strokeWidth",
        value: string | number
    ) => void;
};

function SettingsPanel({
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
}: SettingsPanelProps) {
    return (
        <div className="settings-panel">

            <h3>
                {activeTool === "draw" && "Draw Settings"}
                {activeTool === "rectangle" && "Rectangle Settings"}
                {activeTool === "circle" && "Circle Settings"}
            </h3>

            {activeTool === "draw" && (
                <>
                    <div className="setting-item">
                        <label>Stroke Color</label>

                        <div className="color-control">
                            <input
                                type="color"
                                value={strokeColor}
                                onChange={(e) => setStrokeColor(e.target.value)}
                            />

                            <span>{strokeColor}</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Stroke Width</label>

                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={strokeWidth}
                            onChange={(e) =>
                                setStrokeWidth(Number(e.target.value))
                            }
                        />

                        <span>{strokeWidth}px</span>
                    </div>



                </>
            )}
            {/* rect */}
            {activeTool === "rectangle" && (
                <>
                    <div className="setting-item">
                        <label>Fill Color</label>

                        <div className="color-control">
                            <input
                                type="color"
                                value={fillColor === "transparent" ? "#ffffff" : fillColor}
                                onChange={(e) => {
                                    setFillColor(e.target.value);
                                    updateSelectedShape("fill", e.target.value);
                                }}
                            />

                            <span>{fillColor}</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Stroke Color</label>

                        <div className="color-control">
                            <input
                                type="color"
                                value={shapeStrokeColor}
                                onChange={(e) => {
                                    setShapeStrokeColor(e.target.value);
                                    updateSelectedShape("stroke", e.target.value);
                                }}
                            />

                            <span>{shapeStrokeColor}</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Stroke Width</label>

                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={shapeStrokeWidth}
                            onChange={(e) => {
                                const width = Number(e.target.value);

                                setShapeStrokeWidth(width);
                                updateSelectedShape("strokeWidth", width);
                            }}
                        />

                        <span>{shapeStrokeWidth}px</span>
                    </div>
                </>
            )}
            {activeTool === "circle" && (
                <>
                    <div className="setting-item">
                        <label>Fill Color</label>

                        <div className="color-control">
                            <input
                                type="color"
                                value={fillColor === "transparent" ? "#ffffff" : fillColor}
                                onChange={(e) => {
                                    setFillColor(e.target.value);
                                    updateSelectedShape("fill", e.target.value);
                                }}
                            />

                            <span>{fillColor}</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Stroke Color</label>

                        <div className="color-control">
                            <input
                                type="color"
                                value={shapeStrokeColor}
                                onChange={(e) => {
                                    setShapeStrokeColor(e.target.value);
                                    updateSelectedShape("stroke", e.target.value);
                                }}
                            />

                            <span>{shapeStrokeColor}</span>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Stroke Width</label>

                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={shapeStrokeWidth}
                            onChange={(e) => {
                                const width = Number(e.target.value);

                                setShapeStrokeWidth(width);
                                updateSelectedShape("strokeWidth", width);
                            }}
                        />

                        <span>{shapeStrokeWidth}px</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default SettingsPanel;