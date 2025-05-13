"use client";

import { useEffect } from "react";

export function ClientBody({ children }: { children: React.ReactNode }) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased min-h-screen bg-sunbg flex flex-col";
    
    // Force tailwind to load
    const style = document.createElement('style');
    style.textContent = `
      /* Force Tailwind CSS to be applied */
      body { display: flex; flex-direction: column; min-height: 100vh; }
    `;
    document.head.appendChild(style);
  }, []);

  return <div className="antialiased min-h-screen bg-sunbg flex flex-col">{children}</div>;
}
