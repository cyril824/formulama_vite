import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SignaturePadProps {
  onSign: (signatureData: string) => void;
  onCancel: () => void;
  documentName?: string;
  documentPath?: string;
  documentType?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSign, onCancel, documentName, documentPath, documentType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!documentPath) return;

    const loadDocument = async () => {
      try {
        setLoadError(null);
        const response = await fetch(documentPath);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error('Erreur lors du chargement du document:', err);
        setLoadError('Impossible de charger le document');
      }
    };

    loadDocument();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [documentPath]);

  useEffect(() => {
    initializeCanvas();
  }, [blobUrl]);

  // Désactiver le scroll du body quand la modale est ouverte
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const container = viewerContainerRef.current;
    
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x, y;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x, y;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setIsEmpty(false);
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }
    
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    setIsEmpty(true);
  };

  const handleValidate = () => {
    if (isEmpty) {
      alert('Veuillez signer le document avant de valider.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    onSign(signatureData);
  };

  const isPDF = documentType === 'pdf' || documentPath?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 p-4 sm:p-6 border-b border-gray-300 dark:border-slate-700">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Signer le document</h2>
            {documentName && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">Document: {documentName}</p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4 sm:px-6 mb-4">
          Signez sur le document avec votre souris ou votre doigt (en rouge)
        </p>

        {/* Document Viewer with Canvas Overlay */}
        <div 
          ref={viewerContainerRef}
          className="flex-1 relative overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900 mx-4 sm:mx-6 mb-4"
          style={{ minHeight: 0 }}
        >
          {loadError ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Erreur lors du chargement du document</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{loadError}</p>
              </div>
            </div>
          ) : blobUrl ? (
            <div className="relative w-full h-full">
              {/* PDF/Document Viewer using iframe with blob URL */}
              <iframe
                ref={iframeRef}
                src={blobUrl}
                className="w-full h-full border-none"
                style={{ display: 'block' }}
              />
              
              {/* Canvas Overlay for Signature */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute top-0 left-0 cursor-crosshair"
                style={{
                  zIndex: 10,
                  opacity: isEmpty ? 0.2 : 1,
                  transition: 'opacity 0.2s',
                  pointerEvents: isDrawing ? 'auto' : 'none',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Chargement du document...</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 justify-end flex-wrap px-4 sm:px-6 pb-4 sm:pb-6">
          <button
            onClick={clearSignature}
            disabled={isEmpty}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isEmpty
                ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            Effacer
          </button>
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleValidate}
            disabled={isEmpty}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              isEmpty
                ? 'bg-indigo-300 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg'
            }`}
          >
            ✓ Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
