type ToolbarProps = {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDraw: () => void;
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onAddText: () => void;
  onRotate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCrop: () => void;
  onApplyCrop: () => void;
  onExport: () => void;
  onExportJSON: () => void;
  isDrawing: boolean;
  isCropping: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

function Toolbar({ onUpload, onDraw, onAddRectangle, onAddCircle, onAddText, onRotate, onUndo, onRedo, onCrop, onApplyCrop, onExport, onExportJSON, onZoomIn, onZoomOut, isDrawing, isCropping }: ToolbarProps) {
  return (
    <div className="toolbar">

      <div className="toolbar-brand">Edit</div>

      <div className="toolbar-group">

        <label className="tool-btn upload-btn" title="Upload Image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <span>Upload</span>
          <input type="file" accept="image/*" onChange={onUpload} />
        </label>
      </div>

      <div className="toolbar-group">

        <button className={`tool-btn ${isDrawing ? 'tool-btn--active' : ''}`} onClick={onDraw} title="Free Draw">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
          <span>Draw</span>
        </button>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-group-label">Shapes</span>
        <button className="tool-btn" onClick={onAddRectangle} title="Add Rectangle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="6" width="18" height="12" rx="1" /></svg>
          <span>Rect</span>
        </button>
        <button className="tool-btn" onClick={onAddCircle} title="Add Circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /></svg>
          <span>Circle</span>
        </button>
        <button className="tool-btn" onClick={onAddText} title="Add Text">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
          <span>Text</span>
        </button>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-group-label">Transform</span>
        <button className="tool-btn" onClick={onRotate} title="Rotate 90°">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
          <span>Rotate</span>
        </button>
        <button className={`tool-btn ${isCropping ? 'tool-btn--active' : ''}`} onClick={onCrop} title="Start Crop">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" /></svg>
          <span>Crop</span>
        </button>
        <button className="tool-btn " onClick={onApplyCrop} id="applyCrop" title="Apply Crop" style={{
          display: isCropping ? 'flex' : 'none',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          <span>Apply Crop</span>
        </button>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-group-label">History</span>
        <button className="tool-btn" onClick={onUndo} title="Undo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>
          <span>Undo</span>
        </button>
        <button className="tool-btn" onClick={onRedo} title="Redo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>
          <span>Redo</span>
        </button>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-group-label">Zoom</span>
        <button className="tool-btn" onClick={onZoomIn} title="Undo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" /></svg>
          <span>Zoom in</span>
        </button>
        <button className="tool-btn" onClick={onZoomOut} title="Redo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="8" x2="14" y1="11" y2="11" /></svg>
          <span>Zoom Out</span>
        </button>
      </div>

      <div className="toolbar-group">
        <span className="toolbar-group-label">Export</span>
        <button className="tool-btn export-btn" onClick={onExport} title="Export as PNG">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          <span>Export</span>
        </button>
        <button className="tool-btn export-json-btn" onClick={onExportJSON} title="Export as JSON">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          <span>JSON</span>
        </button>
      </div>

    </div>
  );
}

export default Toolbar;