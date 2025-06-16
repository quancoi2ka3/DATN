# SAFE DEVELOPMENT PROCESS - SUN MOVEMENT PROJECT

## 🚨 **CRITICAL REMEMBER: Always Kill Processes First!**

### **WHY THIS IS IMPORTANT:**
- Prevents port conflicts (5000, 5001, 3000, 3001)
- Avoids "Address already in use" errors
- Prevents file locking issues during builds
- Ensures clean startup every time

---

## 📋 **MANDATORY STEPS BEFORE ANY START COMMAND**

### **Before Backend Operations:**
```cmd
# Always run this first!
taskkill /f /im dotnet.exe

# Then proceed with:
dotnet build
dotnet run --urls=https://localhost:5001
```

### **Before Frontend Operations:**
```cmd
# Always run this first!
taskkill /f /im node.exe
taskkill /f /im npm.exe
taskkill /f /im yarn.exe

# Then proceed with:
npm run dev
# or
yarn dev
```

---

## 🛠️ **AUTOMATED SCRIPTS CREATED**

### **1. Kill All Processes:**
```cmd
kill-all-processes.bat
```
- Kills all dotnet.exe and node.exe processes
- Frees up ports 3000, 3001, 5000, 5001
- Shows final status

### **2. Safe Backend Start:**
```cmd
safe-start-backend.bat
```
- Kills existing dotnet processes
- Checks and frees ports
- Builds and runs backend safely

### **3. Safe Frontend Start:**
```cmd
safe-start-frontend.bat
```
- Kills existing node processes
- Checks and frees ports
- Starts frontend development server

---

## ⚡ **QUICK REFERENCE COMMANDS**

### **Emergency Kill All:**
```cmd
# Kill everything related to the project
kill-all-processes.bat
```

### **Safe Backend Restart:**
```cmd
# Method 1: Use script
safe-start-backend.bat

# Method 2: Manual
taskkill /f /im dotnet.exe
cd sun-movement-backend\SunMovement.Web
dotnet build && dotnet run --urls=https://localhost:5001
```

### **Safe Frontend Restart:**
```cmd
# Method 1: Use script
safe-start-frontend.bat

# Method 2: Manual
taskkill /f /im node.exe
cd [frontend-directory]
npm run dev
```

---

## 🔍 **TROUBLESHOOTING COMMON ISSUES**

### **"Port 5001 is already in use"**
```cmd
# Find and kill the process
netstat -ano | findstr :5001
taskkill /f /pid [PID_NUMBER]
```

### **"Port 3000 is already in use"**
```cmd
# Find and kill the process
netstat -ano | findstr :3000
taskkill /f /pid [PID_NUMBER]
```

### **Build Fails with File Lock Errors**
```cmd
# Kill all dotnet processes and try again
taskkill /f /im dotnet.exe
timeout /t 3
dotnet build
```

### **npm/yarn Won't Start**
```cmd
# Kill all node processes and try again
taskkill /f /im node.exe
taskkill /f /im npm.exe
timeout /t 3
npm run dev
```

---

## 📝 **DEVELOPMENT WORKFLOW**

### **Daily Development Start:**
1. Run `kill-all-processes.bat` first
2. Start backend: `safe-start-backend.bat`
3. Start frontend: `safe-start-frontend.bat`
4. Begin development

### **After Each Major Change:**
1. Kill processes: `taskkill /f /im dotnet.exe`
2. Rebuild: `dotnet build`
3. Restart: `dotnet run`

### **Before Testing:**
1. Ensure clean environment: `kill-all-processes.bat`
2. Start services in correct order
3. Verify ports are free

---

## ⚠️ **IMPORTANT NOTES**

- **NEVER** start multiple instances without killing previous ones
- **ALWAYS** check ports are free before starting services
- **USE** the automated scripts to avoid manual errors
- **REMEMBER** to kill processes when switching branches
- **BACKUP** data before killing processes if needed

---

## 🎯 **AUTOMATION LEVEL**

All scripts now automatically:
- Kill existing processes
- Check port availability
- Free up occupied ports
- Provide status feedback
- Handle errors gracefully

**Result: Zero port conflicts, clean restarts every time!**
