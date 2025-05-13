"use client";

import React from 'react';

export function TailwindLoader() {
  React.useEffect(() => {
    // This is a hack to force Tailwind CSS to load properly
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Force Tailwind styles */
      .force-tailwind {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f3f3fb;
        color: #3f3b3b;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        font-family: 'SF Pro Display', sans-serif;
      }
      
      /* Sun Movement Custom Colors */
      .sun-red { color: #eb4d3c; }
      .sun-bg { background-color: #f3f3fb; }
      .sun-dark { color: #3f3b3b; }
      .sun-blue { color: #18aec2; }
      .sun-pink { color: #e87c90; }
      .sun-beige { color: #f3ccb3; }
      .sun-gold { color: #d7ac84; }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  return (
    <div className="hidden">
      {/* Force Tailwind classes to be included */}
      <div className="bg-sunred text-white"></div>
      <div className="bg-sunbg text-sundark"></div>
      <div className="bg-sundark text-white"></div>
      <div className="bg-sunblue text-white"></div>
      <div className="bg-sunpink text-white"></div>
      <div className="bg-sunbeige text-sundark"></div>
      <div className="bg-sungold text-white"></div>
      
      {/* Basic Tailwind utilities */}
      <div className="flex flex-col items-center justify-center p-4 m-4 rounded-md shadow-md"></div>
    </div>
  );
}
