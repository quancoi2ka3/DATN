# ZOHO MAIL API INTEGRATION GUIDE

## 🎯 Overview

Zoho Mail API provides professional email sending capabilities with excellent deliverability rates. This guide shows how to integrate Zoho Mail API with the Sun Movement backend.

## 📋 Prerequisites

1. **Zoho Account**: Create a Zoho account if you don't have one
2. **Domain**: Own a domain (recommended for production)
3. **Developer Console Access**: Access to Zoho API Console

## 🚀 Quick Setup (Development)

### Step 1: Create Zoho Developer Application

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click **"Add Client"**
3. Choose **"Server-based Applications"**
4. Fill in:
   - **Client Name**: `Sun Movement Email Service`
   - **Homepage URL**: `https://localhost:5001`
   - **Authorized Redirect URIs**: `https://localhost:5001/auth/zoho/callback`

### Step 2: Get Client Credentials

After creating the application, note down:
- **Client ID**
- **Client Secret**

### Step 3: Generate OAuth2 Token

#### 3.1 Authorization URL
```
https://accounts.zoho.com/oauth/v2/auth?
scope=ZohoMail.messages.CREATE,ZohoMail.accounts.READ&
client_id=YOUR_CLIENT_ID&
response_type=code&
access_type=offline&
redirect_uri=https://localhost:5001/auth/zoho/callback
```

#### 3.2 Get Authorization Code
1. Open the authorization URL in browser
2. Grant permissions
3. Copy the `code` parameter from the redirect URL

#### 3.3 Exchange for Tokens
```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=https://localhost:5001/auth/zoho/callback" \
  -d "code=YOUR_AUTHORIZATION_CODE"
```

Response:
```json
{
  "access_token": "1000.xxx",
  "refresh_token": "1000.yyy",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### Step 4: Get Account ID

```bash
curl -X GET "https://www.zohoapis.com/mail/v1/accounts" \
  -H "Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN"
```

Response will contain your Account ID.

### Step 5: Update Configuration

**appsettings.Development.json:**
```json
{
  "Email": {
    "Provider": "zoho"
  },
  "Zoho": {
    "ApiKey": "1000.xxx_YOUR_ACCESS_TOKEN",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Sun Movement Fitness Center",
    "AccountId": "your_account_id_here",
    "BaseUrl": "https://www.zohoapis.com/mail/v1"
  }
}
```

## 🔄 Token Refresh

Access tokens expire after 1 hour. Use refresh token to get new access tokens:

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=refresh_token" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN"
```

## 🏗️ Production Setup

### 1. Domain Verification

1. **Add Domain to Zoho**: Add your domain in Zoho Mail
2. **DNS Configuration**: Set up SPF, DKIM, and DMARC records
3. **Verify Domain**: Complete domain verification process

### 2. Environment Variables

Set these environment variables in production:

```bash
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_FROM_EMAIL=noreply@yourdomain.com
ZOHO_ACCOUNT_ID=your_account_id
```

### 3. Production Configuration

**appsettings.Production.json:**
```json
{
  "Email": {
    "Provider": "zoho"
  },
  "Zoho": {
    "ApiKey": "#{ZOHO_ACCESS_TOKEN}#",
    "FromEmail": "#{ZOHO_FROM_EMAIL}#",
    "FromName": "Sun Movement Fitness Center",
    "AccountId": "#{ZOHO_ACCOUNT_ID}#",
    "BaseUrl": "https://www.zohoapis.com/mail/v1"
  }
}
```

## 🧪 Testing

### Test Email Sending

```bash
# Test via API
curl -X POST http://localhost:5000/api/debug/test-email \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test@example.com\",
    \"firstName\": \"Test User\"
  }"
```

### Run Integration Test

```bash
# Windows
zoho-mail-integration-test.bat

# Linux/Mac
bash zoho-mail-integration-test.sh
```

## 📊 API Limits

- **Free Plan**: Limited emails per day
- **Paid Plans**: Higher limits based on subscription
- **Rate Limiting**: Respect API rate limits

## 🔧 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check OAuth token validity
   - Refresh token if expired
   - Verify client credentials

2. **403 Forbidden**
   - Check API permissions/scopes
   - Verify account ID
   - Ensure domain is verified

3. **400 Bad Request**
   - Check email format
   - Verify required fields
   - Check JSON payload structure

### Debug Logging

Enable debug logging in `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "SunMovement.Infrastructure.Services.ZohoEmailService": "Debug"
    }
  }
}
```

## 🔄 Alternative Solutions

If Zoho setup is too complex, consider:

### 1. SendGrid (Recommended)
- **Pros**: Easy setup, excellent deliverability
- **Cons**: Requires API key
- **Free Tier**: 100 emails/day
- **Setup**: Just need API key

### 2. Mailgun
- **Pros**: Good for high volume
- **Cons**: More complex pricing
- **Free Tier**: First 10,000 emails free
- **Setup**: API key + domain verification

### 3. SMTP (Gmail)
- **Pros**: Simplest setup
- **Cons**: Limited to 500 emails/day
- **Setup**: Email + App Password

## 🎯 Recommendation

**For Development**: Use SMTP with Gmail App Password
**For Production**: Use SendGrid or Mailgun for simplicity, Zoho for advanced features

## 📞 Support

- **Zoho Support**: [Zoho Developer Documentation](https://www.zoho.com/mail/help/api/)
- **Project Issues**: Create GitHub issue with `email-integration` label

## ✅ Next Steps

1. Choose your email provider based on needs
2. Update configuration files
3. Test email sending functionality
4. Deploy to production with proper security
5. Monitor email deliverability and logs

---

**Note**: This integration is production-ready but requires proper OAuth2 token management in production environments.
