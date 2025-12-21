import React, { useRef, useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configurer le worker PDF.js - utiliser le fichier depuis node_modules
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Déclarer les fonctions avant le useEffect
  const initializeBlankCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 700;
    canvas.height = 350;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    setLoading(false);
  };

  const loadImage = (imagePath: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Adapter les dimensions
      const maxWidth = 700;
      const maxHeight = 350;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      setLoading(false);
    };
    img.onerror = () => {
      setError('Erreur lors du chargement de l\'image');
      initializeBlankCanvas();
    };
    img.crossOrigin = 'anonymous';
    img.src = imagePath;
  };

  const loadPDF = async (pdfPath: string) => {
    try {
      // Essayer de charger le PDF
      const pdf = await pdfjsLib.getDocument(pdfPath).promise;
      const page = await pdf.getPage(1);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Définir l'échelle pour adapter à la taille max
      const viewport = page.getViewport({ scale: 1.5 });
      let scale = 1.5;

      if (viewport.width > 700) {
        scale = (700 / viewport.width) * 1.5;
      }

      const scaledViewport = page.getViewport({ scale });

      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: scaledViewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;
      setLoading(false);
    } catch (err) {
      console.error('Erreur PDF:', err);
      // En cas d'erreur, afficher juste une surface blanche
      initializeBlankCanvas();
    }
  };

  // Charger et afficher le document
  useEffect(() => {
    if (!documentPath) {
      initializeBlankCanvas();
      return;
    }

    setLoading(true);
    setError(null);

    // Déterminer le type: utiliser documentType si fourni, sinon vérifier l'URL
    const isPdf = documentType === 'pdf' || documentPath.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      loadPDF(documentPath);
    } else {
      loadImage(documentPath);
    }
  }, [documentPath, documentType]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
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
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    // Simplement réinitialiser le flag isEmpty
    setIsEmpty(true);
    
    // Recharger le document
    if (documentPath) {
      setLoading(true);
      setError(null);
      
      if (documentPath.toLowerCase().endsWith('.pdf')) {
        loadPDF(documentPath);
      } else {
        loadImage(documentPath);
      }
    } else {
      initializeBlankCanvas();
    }
  };

  const handleSign = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const signatureData = canvas.toDataURL('image/png');
    onSign(signatureData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div ref={containerRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
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
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
          Signez sur le document avec votre souris ou votre doigt (en rouge)
        </p>

        {/* Canvas avec le document */}
        <div className="mb-4 bg-gray-100 dark:bg-slate-700 rounded-lg border-2 border-gray-300 dark:border-slate-600 p-2 sm:p-4 flex items-center justify-center min-h-[350px]">
          {loading && (
            <div className="text-gray-500 dark:text-gray-400">Chargement du document...</div>
          )}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white dark:bg-slate-900 rounded cursor-crosshair border border-gray-300 dark:border-slate-600"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-2 sm:gap-3 justify-end flex-wrap">
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
            onClick={handleSign}
            disabled={isEmpty}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-all text-sm whitespace-nowrap ${
              isEmpty
                ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <Check className="w-4 h-4" />
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
