"use client";

import React from 'react';

interface RobotIconProps {
  showNotification?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const RobotIcon: React.FC<RobotIconProps> = ({ 
  showNotification = false, 
  className = '', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div 
      className={`robot-icon-container ${sizeClasses[size]} ${className}`}
      style={{ pointerEvents: 'none' }} // Prevent blocking click events
    >
      <div className="robot-head robot-active">
        <div className="robot-antenna" />
        <div className="robot-eyes">
          <div className="robot-eye" />
          <div className="robot-eye" />
        </div>
        <div className="robot-mouth" />
      </div>
      <div className="robot-body" />
      {showNotification && <div className="notification-dot" />}
    </div>
  );
};
