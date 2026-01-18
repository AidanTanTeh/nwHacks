import React, { useRef, useState, useEffect } from 'react';
import { Camera, Check, RotateCcw, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', aspectRatio: 3/4 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Could not access camera. Please allow permissions.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally for mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={onCancel} className="px-4 py-2 bg-zinc-800 rounded-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="relative flex-1 overflow-hidden bg-zinc-900">
        {!capturedImage ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        )}
        
        <div className="absolute top-4 left-0 right-0 flex justify-between px-6 z-10">
            <button onClick={onCancel} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
                <X size={24} />
            </button>
        </div>
      </div>

      <div className="h-32 bg-black flex items-center justify-center gap-12 px-6">
        {!capturedImage ? (
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group"
          >
            <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform"></div>
          </button>
        ) : (
          <>
            <button 
              onClick={retake}
              className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <div className="p-4 bg-zinc-800 rounded-full">
                <RotateCcw size={24} />
              </div>
              <span className="text-xs font-medium">Retake</span>
            </button>
            
            <button 
              onClick={confirm}
              className="flex flex-col items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <div className="p-4 bg-orange-600 rounded-full text-white shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                <Check size={28} strokeWidth={3} />
              </div>
               <span className="text-xs font-bold text-orange-500">Post Run</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
