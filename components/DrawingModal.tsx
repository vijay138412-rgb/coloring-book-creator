
import React, { useRef, useEffect, useState } from 'react';
import { CloseIcon, PencilIcon, EraserIcon, UndoIcon, RedoIcon, TrashIcon, PaintBucketIcon, DownloadIcon, SprayCanIcon } from './Icons';

interface DrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  initialHistory?: ImageData[];
  onSave: (imageData: string, history: ImageData[]) => void;
}

const colors = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#A52A2A', '#000000', '#FFFFFF', '#FFC0CB', '#40E0D0', '#C39797'];
const lineSizes = [5, 10, 20];

const DrawingModal: React.FC<DrawingModalProps> = ({ isOpen, onClose, imageSrc, initialHistory, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'paintBucket' | 'spray'>('paintBucket');
  const [color, setColor] = useState('#FF0000');
  const [lineWidth, setLineWidth] = useState(5);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!isOpen) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const aspectRatio = image.width / image.height;
      const maxWidth = window.innerWidth * 0.7;
      const maxHeight = window.innerHeight * 0.7;
      let width = maxWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });

      const context = canvas.getContext('2d');
      if (!context) return;
      contextRef.current = context;
      
      setRedoStack([]);

      if (initialHistory && initialHistory.length > 0) {
        setHistory(initialHistory);
        context.putImageData(initialHistory[initialHistory.length - 1], 0, 0);
      } else {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const initialImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialImageData]);
      }
    };
  }, [isOpen, imageSrc, initialHistory]);

  const hexToRgba = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
        let c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        const i = parseInt(`0x${c.join('')}`);
        r = (i >> 16) & 255;
        g = (i >> 8) & 255;
        b = i & 255;
    }
    return { r, g, b };
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (!context) return;

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    context.lineWidth = lineWidth;
    
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    const context = contextRef.current;
    if (!isDrawing || !context) return;
    if(tool === 'pencil' || tool === 'eraser') {
      context.closePath();
    }
    setIsDrawing(false);
    
    if (canvasRef.current) {
        setHistory(prev => [...prev, contextRef.current!.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height)]);
        setRedoStack([]);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const context = contextRef.current;
    if (!context) return;
    const { offsetX, offsetY } = nativeEvent;

    if (tool === 'pencil' || tool === 'eraser') {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    } else if (tool === 'spray') {
        const sprayRadius = lineWidth;
        const density = sprayRadius > 15 ? 40 : (sprayRadius > 8 ? 25 : 15);
        
        context.fillStyle = color;
        context.globalCompositeOperation = 'source-over';

        for (let i = 0; i < density; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * sprayRadius;
            const x = offsetX + radius * Math.cos(angle);
            const y = offsetY + radius * Math.sin(angle);
            context.beginPath();
            context.arc(x, y, 1, 0, 2 * Math.PI, false);
            context.fill();
        }
    }
  };

    const floodFill = (x: number, y: number) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const { r: fillR, g: fillG, b: fillB } = hexToRgba(color);

        const getPixelIndex = (x: number, y: number) => (y * canvas.width + x) * 4;

        const startIdx = getPixelIndex(x, y);
        const startR = data[startIdx];
        const startG = data[startIdx + 1];
        const startB = data[startIdx + 2];

        if (startR === fillR && startG === fillG && startB === fillB) return;

        const isLine = (r, g, b) => r + g + b < 255;
        if (isLine(startR, startG, startB)) return;

        const visited = new Uint8Array(canvas.width * canvas.height);
        const queue: [number, number][] = [[x, y]];
        visited[y * canvas.width + x] = 1;

        while (queue.length > 0) {
            const [curX, curY] = queue.shift()!;
            
            const currentIdx = getPixelIndex(curX, curY);
            data[currentIdx] = fillR;
            data[currentIdx + 1] = fillG;
            data[currentIdx + 2] = fillB;
            data[currentIdx + 3] = 255;
            
            const neighbors: [number, number][] = [
                [curX + 1, curY], [curX - 1, curY], [curX, curY + 1], [curX, curY - 1]
            ];

            for (const [nx, ny] of neighbors) {
                if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height && !visited[ny * canvas.width + nx]) {
                    visited[ny * canvas.width + nx] = 1;
                    const neighborIdx = getPixelIndex(nx, ny);
                    const neighborR = data[neighborIdx];
                    const neighborG = data[neighborIdx + 1];
                    const neighborB = data[neighborIdx + 2];
                    
                    const colorMatch = Math.abs(neighborR - startR) < 20 &&
                                       Math.abs(neighborG - startG) < 20 &&
                                       Math.abs(neighborB - startB) < 20;

                    if (colorMatch) {
                        queue.push([nx, ny]);
                    }
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Save state after fill is complete
        setHistory(prev => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
        setRedoStack([]);
    };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'paintBucket') {
        const { offsetX, offsetY } = e.nativeEvent;
        floodFill(Math.floor(offsetX), Math.floor(offsetY));
    } else {
        startDrawing(e);
    }
  };
  
  const handleUndo = () => {
    if (history.length > 1) {
      const lastState = history[history.length - 1];
      setRedoStack(prev => [lastState, ...prev]);

      const newHistory = history.slice(0, -1);
      setHistory(newHistory);

      const prevState = newHistory[newHistory.length - 1];
      if (prevState) {
          contextRef.current?.putImageData(prevState, 0, 0);
      }
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory(prev => [...prev, nextState]);
      
      const newRedoStack = redoStack.slice(1);
      setRedoStack(newRedoStack);
      
      if (nextState) {
          contextRef.current?.putImageData(nextState, 0, 0);
      }
    }
  };
  
  const handleClear = () => {
    if (canvasRef.current && contextRef.current && history.length > 0) {
        // Revert to the original image state
        const originalState = history[0];
        contextRef.current.putImageData(originalState, 0, 0);
        setHistory([originalState]);
        setRedoStack([]);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png').split(',')[1];
    onSave(dataUrl, history);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'colored-page.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4 max-w-5xl w-full max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold font-fredoka text-gray-700">Coloring Time!</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Toolbar */}
            <div className="flex md:flex-col gap-3 p-3 bg-gray-100 rounded-xl border border-gray-200">
                <button title="Paint Bucket" onClick={() => setTool('paintBucket')} className={`p-3 rounded-lg ${tool === 'paintBucket' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-200'}`}><PaintBucketIcon className="w-6 h-6" /></button>
                <button title="Pencil" onClick={() => setTool('pencil')} className={`p-3 rounded-lg ${tool === 'pencil' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-200'}`}><PencilIcon className="w-6 h-6" /></button>
                <button title="Spray Paint" onClick={() => setTool('spray')} className={`p-3 rounded-lg ${tool === 'spray' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-200'}`}><SprayCanIcon className="w-6 h-6" /></button>
                <button title="Eraser" onClick={() => setTool('eraser')} className={`p-3 rounded-lg ${tool === 'eraser' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-200'}`}><EraserIcon className="w-6 h-6" /></button>
                <div className="h-px md:h-auto md:w-px bg-gray-300 my-2 md:my-0 md:mx-2"></div>
                <button title="Undo" onClick={handleUndo} disabled={history.length <= 1} className="p-3 rounded-lg bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon className="w-6 h-6 text-gray-600" /></button>
                <button title="Redo" onClick={handleRedo} disabled={redoStack.length === 0} className="p-3 rounded-lg bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon className="w-6 h-6 text-gray-600" /></button>
                <button title="Clear All" onClick={handleClear} className="p-3 rounded-lg bg-white hover:bg-gray-200"><TrashIcon className="w-6 h-6 text-red-500" /></button>
            </div>
             {/* Canvas Area */}
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200" style={{ width: canvasSize.width, height: canvasSize.height }}>
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseOut={finishDrawing}
                className="cursor-crosshair"
                style={{ cursor: tool === 'paintBucket' ? 'pointer' : 'crosshair' }}
              />
            </div>
             {/* Options */}
             <div className="flex md:flex-col gap-3 p-3 bg-gray-100 rounded-xl border border-gray-200">
                 <div className="flex flex-wrap md:flex-col gap-2 justify-center">
                    {colors.map(c => (
                        <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 border-2 ${color === c && (tool === 'pencil' || tool === 'spray') ? 'ring-2 ring-offset-2 ring-pink-500' : 'border-gray-300'}`} title={c}></button>
                    ))}
                 </div>
                 <div className="h-px md:h-auto md:w-px bg-gray-300 my-2 md:my-0 md:mx-2"></div>
                 <div className="flex md:flex-col gap-2">
                    {lineSizes.map(size => (
                        <button key={size} onClick={() => setLineWidth(size)} className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${lineWidth === size ? 'bg-pink-500' : 'bg-white'}`} title={`${size}px`}>
                            <div className="bg-gray-500 rounded-full" style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }}></div>
                        </button>
                    ))}
                 </div>
             </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-2">
            <button onClick={handleDownload} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 self-center font-fredoka text-lg shadow-md inline-flex items-center gap-2">
                <DownloadIcon className="w-5 h-5" />
                Download
            </button>
            <button onClick={handleSave} className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 self-center font-fredoka text-lg shadow-md">
                Save & Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingModal;
