import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressTrackerProps {
  steps: Step[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="relative">
            <div className="flex items-start space-x-3">
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : step.status === 'current' ? (
                  <Clock className="w-6 h-6 text-umd-red" />
                ) : (
                  <Circle className="w-6 h-6 text-umd-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  step.status === 'completed' 
                    ? 'text-green-700' 
                    : step.status === 'current'
                    ? 'text-umd-red'
                    : 'text-umd-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className="text-sm text-umd-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="absolute left-3 top-8 w-px h-6 bg-umd-gray-200" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;