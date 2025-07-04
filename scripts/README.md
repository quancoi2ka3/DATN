# 🔧 AUTOMATION SCRIPTS

Thư mục này chứa tất cả các script tự động hóa cho dự án Sun Movement.

## 📁 Cấu trúc thư mục

### 🖥️ [backend/](./backend/)
Scripts liên quan đến backend (.NET Core):
- Migration scripts
- Database seeding
- Testing scripts
- Build automation

### 🌐 [frontend/](./frontend/)  
Scripts liên quan đến frontend (Next.js):
- Build optimization
- Performance testing
- Asset management
- Deployment scripts

### 🤖 [chatbot/](./chatbot/)
Scripts liên quan đến chatbot (RASA):
- Model training
- Data validation
- Testing & debugging
- Deployment automation

### ⚙️ [system/](./system/)
Scripts quản lý hệ thống tổng thể:
- Service management
- System monitoring
- Cleanup utilities
- Health checks

## 🚀 Quick Commands

### Start Services
```bash
# Start all services
scripts/system/start-full-system.bat

# Start individual services
scripts/system/start-backend-server.bat
scripts/system/start-action-server.bat
```

### System Management
```bash
# Check system status
scripts/system/check-system-status.bat

# Stop all services
scripts/system/stop-all-services.bat

# Quick system test
scripts/system/quick-system-test.bat
```

### Development
```bash
# Database migration
scripts/backend/create-recommendation-migration.bat

# Frontend restart
scripts/frontend/restart-frontend.bat

# Chatbot training
scripts/chatbot/retrain-enhanced-chatbot.bat
```

## 📋 Script Categories

### 🏗️ Setup & Installation
- Environment setup
- Dependency installation
- Initial configuration

### 🔄 Development Workflow
- Build & compile
- Testing & validation
- Code generation

### 🚀 Deployment
- Production builds
- Service deployment
- Environment promotion

### 🔧 Maintenance
- Cleanup utilities
- Health monitoring
- Performance optimization

### 🐛 Debugging
- Error diagnosis
- Log analysis
- System troubleshooting

## ⚠️ Important Notes

### Prerequisites
- **Windows**: Most scripts are .bat files
- **Permissions**: Run as Administrator if needed
- **Dependencies**: Check individual script requirements

### Safety Guidelines
- ✅ Always backup before running destructive scripts
- ✅ Test scripts in development environment first
- ✅ Read script documentation before execution
- ❌ Never run unknown scripts in production

### Error Handling
- Check script output for errors
- Review logs in `/logs/` directory
- Consult troubleshooting guides in `/docs/`

## 📊 Script Status

### ✅ Production Ready
- System start/stop scripts
- Health check scripts
- Basic monitoring

### 🔄 Active Development
- Advanced deployment scripts
- Performance optimization
- Enhanced error handling

### 🧪 Experimental
- AI-powered debugging
- Auto-scaling scripts
- Advanced analytics

## 🛠️ Development

### Adding New Scripts
1. Choose appropriate category folder
2. Follow naming convention: `[action]-[component]-[target].bat`
3. Add documentation header
4. Test thoroughly
5. Update this README

### Script Template
```batch
@echo off
REM ============================================
REM Script: [Script Name]
REM Purpose: [Brief Description]
REM Author: [Your Name]
REM Date: [Date]
REM ============================================

echo Starting [Script Name]...

REM Your script content here

echo [Script Name] completed successfully!
pause
```

## 📞 Support

If you encounter issues with any scripts:
1. Check the script documentation
2. Review error logs
3. Consult troubleshooting guides
4. Contact development team

---

💡 **Tip**: Use `scripts/system/quick-system-test.bat` to verify everything is working correctly.
