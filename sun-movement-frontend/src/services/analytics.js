// src/services/analytics.js
import mixpanel from 'mixpanel-browser';

let mixpanelInitialized = false;

// Initialize mixpanel
export const initMixpanel = () => {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  
  if (!token || token === 'demo-token') {
    console.warn('⚠️ Mixpanel token not configured! Using backend proxy only');
    console.log('📝 Analytics will use backend proxy for tracking');
    mixpanelInitialized = false;
    return;
  }
  
  console.log('🎯 Initializing Mixpanel with backend proxy only (bypassing ad blockers)');
  
  // Don't initialize Mixpanel SDK to avoid ad blocker issues
  // Just mark as "initialized" to use backend proxy
  mixpanelInitialized = false; // Force backend proxy usage
  
  console.log('✅ Backend proxy mode initialized (no client-side Mixpanel SDK)');
};

// Safe mixpanel track wrapper with backend proxy ONLY
const safeMixpanelTrack = async (eventName, properties) => {
  // Always log the event for debugging
  console.log('📊 Tracking event:', eventName, properties);
  
  // Enhanced properties with better defaults
  const enhancedProperties = {
    ...properties,
    page_url: window.location.href,
    page_title: document.title,
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    session_id: sessionStorage.getItem('session_id') || `session-${Date.now()}`,
    referrer: document.referrer || 'direct'
  };
  
  // Set session ID if not exists
  if (!sessionStorage.getItem('session_id')) {
    sessionStorage.setItem('session_id', enhancedProperties.session_id);
  }
  
  // Use ONLY backend proxy (most reliable, bypasses ad blockers)
  const proxySuccess = await trackViaBackendProxy(eventName, enhancedProperties);
  
  if (proxySuccess) {
    console.log('✅ Backend proxy tracking successful:', eventName);
    return true;
  } else {
    console.error('❌ Backend proxy tracking failed for event:', eventName);
    return false;
  }
};

// Test backend proxy connection
export const testBackendProxy = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    
    console.log('🔍 Testing backend proxy connection...');
    
    const response = await fetch(`${backendUrl}/api/MixpanelProxy/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend proxy health check successful:', result);
      return result;
    } else {
      console.error('❌ Backend proxy health check failed:', response.status);
      return { status: 'unhealthy', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Backend proxy health check error:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

// Test Mixpanel connection via backend proxy
export const testMixpanelConnection = async () => {
  try {
    // Test via backend proxy instead of direct Mixpanel call
    const result = await trackViaBackendProxy('Connection Test', {
      test: true,
      timestamp: new Date(),
      user_agent: navigator.userAgent
    });
    
    if (result) {
      console.log('✅ Mixpanel connection test successful via backend proxy');
      return true;
    } else {
      console.error('❌ Mixpanel connection test failed via backend proxy');
      return false;
    }
  } catch (error) {
    console.error('❌ Mixpanel connection test error:', error);
    return false;
  }
};

// Track via backend proxy (most reliable method)
const trackViaBackendProxy = async (eventName, properties) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    
    const requestData = {
      eventName: eventName,
      distinctId: properties.user_id || properties.distinct_id || `anonymous-${Date.now()}`,
      properties: properties
    };
    
    console.log('🔄 Sending event via backend proxy:', eventName);
    
    const response = await fetch(`${backendUrl}/api/MixpanelProxy/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend proxy tracking successful:', eventName, result);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Backend proxy tracking failed:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend proxy tracking error:', error);
    
    // Final fallback: Log to console for debugging
    console.log('📝 Event logged for debugging:', {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      note: 'Backend proxy failed - logged for debugging'
    });
    
    return false;
  }
};

// Alternative tracking method using Image pixel (most reliable for CORS)
const fallbackTrack = async (eventName, properties) => {
  try {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
    
    if (!token || token === 'demo-token') {
      console.error('❌ No Mixpanel token available for fallback tracking');
      // Log to console for debugging
      console.log('📝 Event logged for debugging:', {
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
        note: 'No token available - logged for debugging'
      });
      return false;
    }
    
    // Use Mixpanel's image pixel tracking (most reliable method)
    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        token: token,
        time: Math.floor(Date.now() / 1000),
        distinct_id: properties.user_id || `anonymous-${Date.now()}`,
        $browser: navigator.userAgent,
        $current_url: window.location.href,
        $referrer: document.referrer,
        mp_lib: 'web-fallback'
      }
    };
    
    // Base64 encode the data with UTF-8 support
    const jsonData = JSON.stringify(eventData);
    // Use TextEncoder for proper UTF-8 encoding
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(jsonData);
    
    // Convert to base64 using btoa with proper encoding
    let binary = '';
    dataBytes.forEach(byte => binary += String.fromCharCode(byte));
    const encodedData = btoa(binary);
    
    // Use image pixel method - most reliable, no CORS issues
    return new Promise((resolve) => {
      const img = new Image();
      const url = `https://api.mixpanel.com/track?data=${encodeURIComponent(encodedData)}&img=1`;
      
      img.onload = () => {
        console.log('✅ Fallback tracking sent (image pixel):', eventName);
        resolve(true);
      };
      
      img.onerror = () => {
        console.warn('⚠️ Image pixel tracking failed, trying secondary method:', eventName);
        
        // Secondary fallback: Use navigator.sendBeacon if available
        if (navigator.sendBeacon) {
          try {
            const beaconUrl = `https://api.mixpanel.com/track?data=${encodeURIComponent(encodedData)}`;
            const sent = navigator.sendBeacon(beaconUrl);
            if (sent) {
              console.log('✅ Fallback tracking sent (beacon):', eventName);
              resolve(true);
            } else {
              console.log('📝 Event logged for debugging (beacon failed):', eventName);
              resolve(false);
            }
          } catch (beaconError) {
            console.log('📝 Event logged for debugging (beacon error):', eventName);
            resolve(false);
          }
        } else {
          console.log('📝 Event logged for debugging (no beacon support):', eventName);
          resolve(false);
        }
      };
      
      // Set src to trigger the request
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => {
        console.log('📝 Event logged for debugging (timeout):', eventName);
        resolve(false);
      }, 5000);
    });
    
  } catch (error) {
    console.error('❌ Fallback tracking error:', error);
    
    // Final fallback: Log to console for debugging
    console.log('📝 Event logged for debugging:', {
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      note: 'This event was logged due to tracking failure'
    });
    
    return false;
  }
};

// Track page view
export const trackPageView = async (pageName) => {
  await safeMixpanelTrack('Page View', {
    page_name: pageName,
    timestamp: new Date(),
    url: window.location.href,
    referrer: document.referrer
  });
};

// Track search
export const trackSearch = async (userId, searchTerm, resultsCount = 0) => {
  await safeMixpanelTrack('Search', {
    user_id: userId,
    search_term: searchTerm.toLowerCase(),
    results_count: resultsCount,
    timestamp: new Date()
  });
};

// Track product view
export const trackProductView = async (userId, product) => {
  await safeMixpanelTrack('Product View', {
    user_id: userId,
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    category: product.category,
    timestamp: new Date()
  });
  
  // Also send to backend for recommendation system
  fetch('/api/interactions/view', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      productId: product.id
    }),
  }).catch(error => console.error('Error tracking product view:', error));
};

// Track add to cart
export const trackAddToCart = async (userId, product, quantity) => {
  await safeMixpanelTrack('Add to Cart', {
    user_id: userId,
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    quantity: quantity,
    timestamp: new Date()
  });
  
  // Also send to backend for recommendation system
  fetch('/api/interactions/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      productId: product.id
    }),
  }).catch(error => console.error('Error tracking add to cart:', error));
};

// Track add to wishlist
export const trackAddToWishlist = async (userId, product) => {
  await safeMixpanelTrack('Add to Wishlist', {
    user_id: userId,
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    timestamp: new Date()
  });
  
  // Also send to backend for recommendation system
  try {
    await fetch('/api/interactions/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: product.id
      }),
    });
  } catch (error) {
    console.error('Error tracking add to wishlist:', error);
  }
};

// Track purchase
export const trackPurchase = async (userId, order) => {
  await safeMixpanelTrack('Purchase', {
    user_id: userId,
    order_id: order.id,
    products: order.items.map(item => ({
      id: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity
    })),
    total: order.totalAmount,
    timestamp: new Date()
  });
  
  // Send each product purchased to backend for recommendation system
  try {
    for (const item of order.items) {
      await fetch('/api/interactions/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: item.productId
        }),
      });
    }
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
};

// Track product rating
export const trackProductRating = async (userId, productId, rating) => {
  await safeMixpanelTrack('Product Rating', {
    user_id: userId,
    product_id: productId,
    rating: rating,
    timestamp: new Date()
  });
  
  // Send to backend for recommendation system
  try {
    await fetch('/api/interactions/rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        rating: rating
      }),
    });
  } catch (error) {
    console.error('Error tracking product rating:', error);
  }
};

// Track recommendation shown
export const trackRecommendationShown = async (userId, productId, recommendationType, sourceProductId = null) => {
  await safeMixpanelTrack('Recommendation Impression', {
    user_id: userId,
    product_id: productId,
    recommendation_type: recommendationType,
    source_product_id: sourceProductId,
    timestamp: new Date()
  });
  
  // Send to backend for recommendation system
  try {
    await fetch('/api/recommendations/track/shown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        recommendationType: recommendationType,
        sourceProductId: sourceProductId
      }),
    });
  } catch (error) {
    console.error('Error tracking recommendation shown:', error);
  }
};

// Track recommendation click
export const trackRecommendationClick = async (userId, productId, recommendationType) => {
  await safeMixpanelTrack('Recommendation Click', {
    user_id: userId,
    product_id: productId,
    recommendation_type: recommendationType,
    timestamp: new Date()
  });
  
  // Send to backend for recommendation system
  try {
    await fetch('/api/recommendations/track/clicked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        recommendationType: recommendationType
      }),
    });
  } catch (error) {
    console.error('Error tracking recommendation click:', error);
  }
};

// Track view time
export const trackViewTime = (userId, productId, seconds) => {
  // Only send to backend, not needed in Mixpanel directly
  fetch('/api/interactions/view-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      productId: productId,
      seconds: seconds
    }),
  }).catch(error => console.error('Error tracking view time:', error));
};

// Identify user - using backend proxy instead of direct Mixpanel calls
export const identifyUser = async (user) => {
  try {
    // Send user identification via backend proxy
    await trackViaBackendProxy('User Identification', {
      user_id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.createdAt,
      last_login: new Date(),
      account_type: user.accountType || 'user'
    });
    
    console.log('✅ User identified via backend proxy:', user.id);
  } catch (error) {
    console.error('❌ Failed to identify user via backend proxy:', error);
  }
};
