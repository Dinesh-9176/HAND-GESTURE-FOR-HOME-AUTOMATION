import React from 'react';
import { Lightbulb, Fan, Fingerprint } from 'lucide-react';

interface DeviceStatusProps {
  fingerCount: number;
  ledStatus: boolean;
  motorStatus: boolean;
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ 
  fingerCount, 
  ledStatus, 
  motorStatus 
}) => {
  return (
    <div className="control-card p-6">
      <h2 className="text-xl font-semibold mb-4">Device Status</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Fingerprint className="h-5 w-5 text-blue-400 mr-2" />
          <span className="text-lg">Current Gesture:</span>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
          <span className="text-3xl font-bold">
            {fingerCount} {fingerCount === 1 ? 'finger' : 'fingers'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
          <div className="flex items-center">
            <Lightbulb className={`h-5 w-5 mr-2 ${ledStatus ? 'text-yellow-400' : 'text-gray-500'}`} />
            <span>LED Light</span>
          </div>
          <span className={ledStatus ? 'device-active' : 'device-inactive'}>
            {ledStatus ? 'ON' : 'OFF'}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
          <div className="flex items-center">
            <Fan className={`h-5 w-5 mr-2 ${motorStatus ? 'text-blue-400' : 'text-gray-500'}`} />
            <span>Motor</span>
          </div>
          <span className={motorStatus ? 'device-active' : 'device-inactive'}>
            {motorStatus ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeviceStatus;