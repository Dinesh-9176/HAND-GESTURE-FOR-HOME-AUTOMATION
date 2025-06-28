import React, { useState } from 'react';
import WebcamComponent from './components/WebcamComponent';
import ControlPanel from './components/ControlPanel';
import DeviceStatus from './components/DeviceStatus';
import Header from './components/Header';
import { SocketProvider } from './context/SocketContext';
import './App.css';

function App() {
  const [fingerCount, setFingerCount] = useState<number>(0);
  const [ledStatus, setLedStatus] = useState<boolean>(false);
  const [motorStatus, setMotorStatus] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const handleFingerCountChange = (count: number) => {
    setFingerCount(count);
    
    // Update device statuses based on finger count
    if (count === 1) {
      setLedStatus(true);
    } else if (count === 2) {
      setMotorStatus(true);
    } else if (count === 5) {
      setLedStatus(false);
      setMotorStatus(false);
    }
  };

  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
  };

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WebcamComponent 
                isDetecting={isDetecting}
                onFingerCountChange={handleFingerCountChange}
              />
            </div>
            <div className="space-y-8">
              <ControlPanel 
                isDetecting={isDetecting} 
                onToggleDetection={toggleDetection} 
              />
              <DeviceStatus 
                fingerCount={fingerCount}
                ledStatus={ledStatus}
                motorStatus={motorStatus}
              />
            </div>
          </div>
        </main>
      </div>
    </SocketProvider>
  );
}

export default App;