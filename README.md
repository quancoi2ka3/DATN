# SUN MOVEMENT - E-COMMERCE PLATFORM

## 📋 Tổng quan dự án

Sun Movement là một nền tảng thương mại điện tử chuyên về các sản phẩm thể thao và sức khỏe, bao gồm:
- 🛍️ Hệ thống bán hàng online
- 🤖 Chatbot hỗ trợ khách hàng  
- 📊 Hệ thống quản lý và phân tích

## 🏗️ Kiến trúc hệ thống

```
sun-movement-project/
├── 🖥️  backend/           Backend API (.NET Core)
├── 🌐  frontend/          Frontend Web App (Next.js)
├── 🤖  chatbot/           AI Chatbot (RASA)
├── 📚  docs/              Documentation
├── 🔧  scripts/           Automation Scripts
├── 📊  diagrams/          Architecture Diagrams
├── 📝  logs/              System Logs
└── 🗂️  temp/             Temporary Files
```

## 🚀 Quick Start

### Yêu cầu hệ thống
- Node.js 18+
- .NET 8+
- Python 3.10+
- SQL Server

### Cài đặt và chạy

1. **Backend**
```bash
cd sun-movement-backend
dotnet restore
dotnet run --project SunMovement.Web
```

2. **Frontend**
```bash
cd sun-movement-frontend
npm install
npm run dev
```

3. **Chatbot**
```bash
cd sun-movement-chatbot
pip install -r requirements.txt
rasa run --enable-api
```

## 📚 Documentation

- 📋 [Guides & Tutorials](./docs/guides/)
- 🏗️ [Architecture](./docs/architecture/)
- 🔧 [Implementation](./docs/implementation/)
- 🧪 [Testing](./docs/testing/)
- 🤖 [Chatbot](./docs/chatbot/)

## 🔧 Scripts

- 🖥️ [Backend Scripts](./scripts/backend/)
- 🌐 [Frontend Scripts](./scripts/frontend/)
- 🤖 [Chatbot Scripts](./scripts/chatbot/)
- ⚙️ [System Scripts](./scripts/system/)

## 🛠️ Công nghệ sử dụng

### Backend
- **Framework**: ASP.NET Core 8
- **Database**: SQL Server
- **Authentication**: JWT + Identity
- **Architecture**: Clean Architecture

### Frontend
- **Framework**: Next.js 15
- **UI Library**: TailwindCSS + shadcn/ui
- **State Management**: Redux Toolkit
- **Type Safety**: TypeScript

### Chatbot
- **Framework**: RASA 3.6
- **NLU**: Vietnamese Language Support
- **Deployment**: Docker Ready

## 📊 Features

### 🛍️ E-commerce
- ✅ Product catalog & search
- ✅ Shopping cart & checkout
- ✅ Order management
- ✅ Payment integration
- ✅ User authentication

### 🤖 AI Features
- ✅ Vietnamese chatbot
- ✅ Product recommendations
- ✅ Customer support automation
- ✅ User behavior analytics

### 📱 User Experience
- ✅ Responsive design
- ✅ Performance optimized
- ✅ SEO friendly
- ✅ Accessibility compliant

## 🧪 Testing

Xem [Testing Guide](./docs/testing/) để biết chi tiết về testing strategy.

## 📈 Development Status

- 🟢 **Backend**: Production Ready
- 🟢 **Frontend**: Production Ready  
- 🟡 **Chatbot**: Active Development
- 🟢 **Documentation**: Complete

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

- 📧 Email: support@sunmovement.com
- 📱 Phone: +84 xxx xxx xxx
- 💬 Chat: Available 24/7 via website

---

**Built with ❤️ by Sun Movement Team**
