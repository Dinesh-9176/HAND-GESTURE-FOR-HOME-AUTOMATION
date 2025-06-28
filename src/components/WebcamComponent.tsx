import React, { useRef, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { drawHand } from '../utils/handUtils';

interface WebcamComponentProps {
  isDetecting: boolean;
  onFingerCountChange: (count: number) => void;
}

const WebcamComponent: React.FC<WebcamComponentProps> = ({ 
  isDetecting, 
  onFingerCountChange 
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handStatus, setHandStatus] = useState<string>('No hands detected');
  const socket = useSocket();

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function setupWebcam() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setHandStatus('Error accessing webcam');
      }
    }
    
    setupWebcam();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isDetecting || !socket) return;

    const intervalId = setInterval(() => {
      captureFrame();
    }, 100);

    return () => clearInterval(intervalId);
  }, [isDetecting, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('finger_count', (data) => {
      const count = data.count;
      onFingerCountChange(count);
      setHandStatus(`Detected ${count} finger${count !== 1 ? 's' : ''}`);
      
      if (canvasRef.current && data.hand_landmarks) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          drawHand(ctx, data.hand_landmarks);
        }
      }
    });

    return () => {
      socket.off('finger_count');
    };
  }, [socket, onFingerCountChange]);

  const captureFrame = () => {
    if (webcamRef.current && canvasRef.current && socket) {
      const video = webcamRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Flip horizontally for mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Send frame data to server if socket is connected
        canvas.toBlob((blob) => {
          if (blob && socket) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              socket.emit('process_frame', { image: base64data });
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.7);
      }
    }
  };

  return (
    <div className="webcam-container bg-gray-800 p-4">
      <h2 className="text-xl font-semibold mb-4">Webcam Feed</h2>
      <div className="relative rounded-lg overflow-hidden">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }}
          className="w-full h-auto"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full webcam-overlay"
        />
        <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 px-3 py-1 rounded-full text-sm">
          {isDetecting ? (
            <span className="flex items-center">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-2 pulse"></span>
              {handStatus}
            </span>
          ) : (
            <span className="flex items-center">
              <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
              Detection stopped
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamComponent;