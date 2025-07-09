"use client";

import { useEffect } from 'react';
import { trackPageView } from '@/services/analytics';

export function HomePageTracker() {
  useEffect(() => {
    trackPageView('/');
  }, []);

  return null;
}
