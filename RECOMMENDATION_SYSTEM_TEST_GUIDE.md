# Recommendation System and User Analytics Integration Testing Guide

This guide provides a comprehensive test plan for validating the functionality of the Sun Movement recommendation system and user analytics implementation.

## Prerequisites

1. Ensure migrations have been applied: Run `create-recommendation-migration.bat`
2. Start the backend and frontend services: Run `start-full-system.bat`
3. Verify all services are running correctly: Run `check-system-status.bat`

## Test Cases

### 1. User Interaction Tracking

#### Test 1.1: Track Product Views
1. Log in as a test user
2. Visit several product pages
3. Verify in database that `UserInteractions` table contains records with `Viewed = true`
4. Check Mixpanel dashboard for "Product View" events

#### Test 1.2: Track Add to Cart
1. Add products to cart
2. Verify in database that `UserInteractions` table contains records with `AddedToCart = true`
3. Check Mixpanel dashboard for "Add to Cart" events

#### Test 1.3: Track Purchases
1. Complete a purchase flow
2. Verify in database that `UserInteractions` table contains records with `Purchased = true`
3. Check Mixpanel dashboard for "Purchase" events

### 2. Recommendation Display

#### Test 2.1: Personalized Recommendations
1. Log in as a user with previous interactions
2. Visit the home page
3. Verify that "Dành riêng cho bạn" section shows personalized products
4. Check browser network tab to confirm API call to `/api/recommendations/personal/{userId}`

#### Test 2.2: Similar Products
1. Visit a product detail page
2. Verify that the "Sản phẩm tương tự" section shows similar items
3. Check browser network tab to confirm API call to `/api/recommendations/similar/{productId}`

#### Test 2.3: Recommendation for New Users
1. Browse in incognito/private mode (or as a new user)
2. Visit the home page
3. Verify that "Dành riêng cho bạn" section shows trending products instead
4. Check browser network tab to confirm API call to `/api/recommendations/trending`

### 3. Recommendation Analytics

#### Test 3.1: Recommendation Tracking
1. Log in as a test user
2. View personalized recommendations on the home page
3. Click on one of the recommended products
4. Verify in database that `ProductRecommendation` table has records with `Shown = true` and `Clicked = true`

#### Test 3.2: Admin Dashboard Access
1. Log in as an admin user
2. Navigate to Admin area
3. Access Analytics Dashboard
4. Verify that metrics for CTR, conversion rate, and impressions are displayed

### 4. User Behavior Analysis

#### Test 4.1: User Behavior Dashboard
1. Log in as an admin user
2. Navigate to Admin area > Analytics > User Behavior
3. Verify charts for user engagement, category views, segments and time spent are displayed
4. Check that the user interactions table shows recent interactions

#### Test 4.2: Conversion Funnel Analysis
1. Log in as an admin user
2. Navigate to Admin area > Analytics > Conversion Funnel
3. Verify the funnel visualization shows the full conversion path
4. Check that product and category conversion tables contain data

## Performance Tests

### Test 5.1: Recommendation API Response Time
1. Use browser developer tools to measure response time for recommendation API endpoints
2. All endpoints should respond within 500ms under normal load

### Test 5.2: Recommendation Algorithm Scaling
1. In the database, simulate a large number of user interactions (1000+)
2. Measure the time taken to generate recommendations
3. Verify the system still performs acceptably (under 1 second)

## Expected Results

- All user interactions are properly tracked in the database and Mixpanel
- Recommendations are displayed appropriately based on user history
- Admin dashboards show accurate metrics
- All API endpoints respond within acceptable time limits

## Troubleshooting

If tests fail:

1. Check application logs for errors
2. Verify database migrations were applied correctly
3. Ensure Mixpanel API keys are configured properly
4. Check browser console for JavaScript errors
