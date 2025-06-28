import React from 'react';
import { Play, Square, Info } from 'lucide-react';

interface ControlPanelProps {
  isDetecting: boolean;
  onToggleDetection: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  isDetecting, 
  onToggleDetection 
}) => {
  return (
    <div className="control-card p-6">
      <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Gesture Detection</h3>
        <button
          onClick={onToggleDetection}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-white font-medium ${
            isDetecting ? 'stop-button' : 'start-button'
          }`}
        >
          {isDetecting ? (
            <>
              <Square className="h-5 w-5 mr-2" />
              Stop Detection
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Detection
            </>
          )}
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-300">
            <p className="mb-2">Use these gestures to control your devices:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>1 finger: Turn on LED</li>
              <li>2 fingers: Turn on motor</li>
              <li>5 fingers: Turn off all devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;