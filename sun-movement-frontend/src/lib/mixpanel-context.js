'use client';

import { createContext, useContext, useEffect } from 'react';
import { initMixpanel, identifyUser, trackPageView } from '@/services/analytics';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

// Create context
const MixpanelContext = createContext(null);

export const MixpanelProvider = ({ children }) => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Initialize Mixpanel once on mount
  useEffect(() => {
    initMixpanel();
  }, []);
  
  // Track page views when pathname changes
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);
  
  // Identify user when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      identifyUser(user);
    }
  }, [isAuthenticated, user]);
  
  return (
    <MixpanelContext.Provider value={null}>
      {children}
    </MixpanelContext.Provider>
  );
};

export const useMixpanel = () => useContext(MixpanelContext);
