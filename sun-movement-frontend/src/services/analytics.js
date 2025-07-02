// src/services/analytics.js
import mixpanel from 'mixpanel-browser';

// Initialize mixpanel
export const initMixpanel = () => {
  mixpanel.init('YOUR_MIXPANEL_TOKEN', { 
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: true,
    persistence: 'localStorage'
  });
};

// Track page view
export const trackPageView = (pageName) => {
  mixpanel.track('Page View', {
    page_name: pageName,
    timestamp: new Date()
  });
};

// Track product view
export const trackProductView = (userId, product) => {
  mixpanel.track('Product View', {
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
export const trackAddToCart = (userId, product, quantity) => {
  mixpanel.track('Add to Cart', {
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
export const trackAddToWishlist = (userId, product) => {
  mixpanel.track('Add to Wishlist', {
    user_id: userId,
    product_id: product.id,
    product_name: product.name,
    product_price: product.price,
    timestamp: new Date()
  });
  
  // Also send to backend for recommendation system
  fetch('/api/interactions/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      productId: product.id
    }),
  }).catch(error => console.error('Error tracking add to wishlist:', error));
};

// Track purchase
export const trackPurchase = (userId, order) => {
  mixpanel.track('Purchase', {
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
  order.items.forEach(item => {
    fetch('/api/interactions/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        productId: item.productId
      }),
    }).catch(error => console.error('Error tracking purchase:', error));
  });
};

// Track product rating
export const trackProductRating = (userId, productId, rating) => {
  mixpanel.track('Product Rating', {
    user_id: userId,
    product_id: productId,
    rating: rating,
    timestamp: new Date()
  });
  
  // Send to backend for recommendation system
  fetch('/api/interactions/rating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      productId: productId,
      rating: rating
    }),
  }).catch(error => console.error('Error tracking product rating:', error));
};

// Track recommendation shown
export const trackRecommendationShown = (userId, productId, recommendationType, sourceProductId = null) => {
  mixpanel.track('Recommendation Impression', {
    user_id: userId,
    product_id: productId,
    recommendation_type: recommendationType,
    source_product_id: sourceProductId,
    timestamp: new Date()
  });
  
  // Send to backend for recommendation system
  fetch('/api/recommendations/track/shown', {
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
  }).catch(error => console.error('Error tracking recommendation shown:', error));
};

// Track recommendation click
export const trackRecommendationClick = (userId, productId, recommendationType) => {
  mixpanel.track('Recommendation Click', {
    user_id: userId,
    product_id: productId,
    recommendation_type: recommendationType,
    timestamp: new Date()
  });
  
  // Send to backend for recommendation system
  fetch('/api/recommendations/track/clicked', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      productId: productId,
      recommendationType: recommendationType
    }),
  }).catch(error => console.error('Error tracking recommendation click:', error));
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

// Identify user
export const identifyUser = (user) => {
  mixpanel.identify(user.id);
  
  mixpanel.people.set({
    $email: user.email,
    $name: user.name,
    $created: user.createdAt,
    $last_login: new Date(),
    accountType: user.accountType || 'user'
  });
};
