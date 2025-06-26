# Zoho Mail API Integration Guide - Sun Movement

## Overview

This guide provides step-by-step instructions for integrating Zoho Mail API with the Sun Movement backend system for sending emails (OTP verification, password reset, welcome emails, etc.).

## Why Zoho Mail API?

- **Professional Business Email**: Better deliverability than SMTP
- **Cost-Effective**: Competitive pricing for small to medium businesses
- **Reliable**: Enterprise-grade email infrastructure
- **Easy Integration**: REST API with OAuth 2.0 authentication
- **Better than Gmail**: No App Password security concerns

## Prerequisites

1. **Zoho Mail Account**: Active Zoho Mail business account
2. **Verified Domain**: Your domain must be verified in Zoho Mail
3. **API Console Access**: Access to Zoho API Console

## Step 1: Setup Zoho API Console

### 1.1 Create Application

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Add Client" > "Server-based Applications"
3. Fill in application details:
   - **Client Name**: Sun Movement Backend
   - **Homepage URL**: `http://localhost:5000` (for local development) or `https://yourdomain.com` (for production)
   - **Authorized Redirect URIs**: `http://localhost:5000/oauth/callback` (for local) or `https://yourdomain.com/oauth/callback` (for production)
4. Click "Create"
5. Note down **Client ID** and **Client Secret**

**💡 Important Note**: You can use `localhost` URLs for development. No need to deploy first!

### 1.2 Generate OAuth Token

**For Local Development (Recommended):**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Generate Token" (simple method)
3. Set scope: `ZohoMail.messages.ALL` or `ZohoMail.messages.CREATE`
4. Complete OAuth flow in your browser
5. Copy the **Access Token** (this is your API Key)

**For Production (Full Application):**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Select your application (created in step 1.1)
3. Click "Generate Token"
4. Set scope: `ZohoMail.messages.ALL` or `ZohoMail.messages.CREATE`
5. Complete OAuth flow
6. Copy the **Access Token** (this is your API Key)

**✨ The token works immediately on localhost - no deployment needed!**

**Important**: OAuth tokens expire. For production, implement token refresh mechanism.

## Step 2: Get Account ID

### Method 1: From Zoho Mail Settings
1. Login to Zoho Mail
2. Go to Settings > Account Settings
3. Find your Account ID in account information

### Method 2: From API Call
```bash
curl -X GET "https://www.mail.zoho.com/api/accounts" \
  -H "Authorization: Zoho-oauthtoken YOUR_OAUTH_TOKEN"
```

## Step 3: Configure Sun Movement Backend

### 3.1 Update appsettings.Development.json

```json
{
  "Email": {
    "Provider": "zoho"
  },
  "Zoho": {
    "ApiKey": "YOUR_ZOHO_OAUTH_TOKEN",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Sun Movement Fitness Center",
    "AccountId": "YOUR_ZOHO_ACCOUNT_ID", 
    "BaseUrl": "https://www.mail.zoho.com/api"
  }
}
```

### 3.2 Update appsettings.Production.json

```json
{
  "Email": {
    "Provider": "zoho"
  },
  "Zoho": {
    "ApiKey": "PRODUCTION_ZOHO_OAUTH_TOKEN",
    "FromEmail": "noreply@sunmovement.com",
    "FromName": "Sun Movement Fitness Center",
    "AccountId": "PRODUCTION_ZOHO_ACCOUNT_ID",
    "BaseUrl": "https://www.mail.zoho.com/api"
  }
}
```

## Step 4: Email Templates

The system includes professional email templates for:

- **Verification Code**: OTP email with branded design
- **Welcome Email**: New user welcome message
- **Password Reset**: Secure password reset with link
- **Order Confirmation**: E-commerce order details
- **Contact Notifications**: Customer inquiry notifications

## Step 5: Testing

### 5.1 Quick Test Script

Run the provided test script:
```bash
zoho-mail-api-test.bat
```

### 5.2 Manual API Test

```bash
# Test email sending via API
curl -X POST "http://localhost:5000/api/debug/send-test-email" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test email from Sun Movement"
  }'
```

### 5.3 Test Through Web Interface

1. Start backend: `dotnet run --urls="http://localhost:5000"`
2. Open: `http://localhost:5000/api/debug/test-email`
3. Enter test email and send

## Step 6: Production Deployment

### 6.1 Domain Verification

Ensure your production domain is verified in Zoho Mail:
1. Add domain to Zoho Mail
2. Configure MX records
3. Verify SPF, DKIM, DMARC records

### 6.2 Token Management

For production, implement proper OAuth token management:
- Store refresh tokens securely
- Implement token refresh logic
- Handle token expiration gracefully

### 6.3 Rate Limiting

Zoho Mail API has rate limits:
- **Free Plan**: 100 emails/day
- **Standard Plan**: 500 emails/day  
- **Professional Plan**: Unlimited

## API Endpoints

### Send Email
```
POST https://www.mail.zoho.com/api/accounts/{accountId}/messages

Headers:
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json

Body:
{
  "fromAddress": "noreply@yourdomain.com",
  "toAddress": "recipient@example.com",
  "ccAddress": "",
  "bccAddress": "",
  "subject": "Email Subject",
  "content": "<html>Email content</html>",
  "mailFormat": "html",
  "askReceipt": "no"
}
```

## Error Handling

### Common Error Codes

- **401 Unauthorized**: Invalid or expired OAuth token
- **403 Forbidden**: Insufficient permissions or wrong Account ID
- **400 Bad Request**: Invalid email format or missing required fields
- **429 Too Many Requests**: Rate limit exceeded

### Troubleshooting

1. **Authentication Errors**:
   - Verify OAuth token is valid
   - Check token scope includes email sending
   - Ensure Account ID is correct

2. **Email Delivery Issues**:
   - Verify from email domain is authorized
   - Check SPF/DKIM records
   - Ensure recipient email is valid

3. **Rate Limiting**:
   - Implement exponential backoff
   - Queue emails for retry
   - Upgrade Zoho plan if needed

## Security Best Practices

1. **Token Security**:
   - Store OAuth tokens in secure configuration
   - Use environment variables in production
   - Never commit tokens to source control

2. **Email Validation**:
   - Validate recipient email addresses
   - Sanitize email content
   - Implement rate limiting on your side

3. **Monitoring**:
   - Log email sending success/failure
   - Monitor API usage and limits
   - Set up alerts for delivery issues

## Advanced Features

### Email Templates with Personalization

```csharp
var htmlContent = GenerateVerificationEmailTemplate(
    firstName: "John",
    verificationCode: "123456"
);
```

### Bulk Email Sending

For sending emails to multiple recipients, consider:
- Implementing email queues
- Batch processing with delays
- Using Zoho Campaigns API for marketing emails

### Email Analytics

Track email performance:
- Delivery rates
- Open rates (if tracking pixels implemented)
- Click-through rates
- Bounce rates

## Conclusion

Zoho Mail API provides a robust, professional email solution for the Sun Movement platform. With proper configuration and implementation, it offers:

- ✅ **High Deliverability**: Better than SMTP
- ✅ **Professional Appearance**: Branded emails from your domain
- ✅ **Scalability**: Can handle growing email volume
- ✅ **Reliability**: Enterprise-grade infrastructure
- ✅ **Cost-Effective**: Competitive pricing

The system is now ready for production deployment with professional email capabilities.

## Support

For additional help:
- [Zoho Mail API Documentation](https://www.zoho.com/mail/help/api/)
- [Zoho API Console](https://api-console.zoho.com/)
- [Zoho Mail Support](https://help.zoho.com/portal/en/community/zoho-mail)

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Status**: Production Ready ✅

## 🏠 Local Development - NO DEPLOYMENT NEEDED!

### Can I use Zoho API on localhost?
**YES! Absolutely!** You don't need to deploy your project to use Zoho Mail API. Here's why:

1. **Zoho API is server-to-server**: Your backend makes direct API calls to Zoho servers
2. **No webhooks required**: Unlike some APIs, Zoho Mail doesn't need to call back to your server
3. **OAuth tokens work everywhere**: Once generated, tokens work from any environment
4. **Local testing is recommended**: Test thoroughly before deploying

### Local Development Setup

#### Option 1: Simple Token Generation (Recommended for Development)
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Generate Token" (quick option)
3. Enter scope: `ZohoMail.messages.ALL`
4. Complete OAuth flow in browser
5. Copy the generated token
6. Use this token in your local `appsettings.Development.json`

**This token will work immediately on localhost!**

#### Option 2: Full Application Setup (For Production Planning)
Use the application setup method described above, but with localhost URLs:
- **Homepage URL**: `http://localhost:5000`
- **Redirect URI**: `http://localhost:5000/oauth/callback`

### Local Configuration Example
```json
{
  "Email": {
    "Provider": "zoho"
  },
  "Zoho": {
    "ApiKey": "1000.abc123def456.789xyz",
    "FromEmail": "test@yourdomain.com",
    "FromName": "Sun Movement (Local Dev)",
    "AccountId": "your_account_id",
    "BaseUrl": "https://www.mail.zoho.com/api"
  }
}
```

### Quick Local Test Steps
1. ✅ Generate OAuth token (takes 2 minutes)
2. ✅ Update local appsettings.json
3. ✅ Run: `dotnet run --urls="http://localhost:5000"`
4. ✅ Test: Open `http://localhost:5000/api/debug/test-email`
5. ✅ Send test email and check inbox

**No deployment, no domain setup, no hosting required!**
