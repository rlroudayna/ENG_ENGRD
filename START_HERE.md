# 🚀 ENG RND PROJECT - START HERE

## ✅ QUICK START (3 STEPS)

### 1. **RUN THE FIX TOOL**
```bash
node fix-all-issues.js
```

### 2. **START THE BACKEND**
```bash
cd backend
npm install
npm start
```
**Wait until you see:** `MongoDB connected` and `Server running on port 5000`

### 3. **START THE FRONTEND** (in new terminal)
```bash
cd eng-rd-clean
npm install
npm start
```

## 🎯 **EXPECTED RESULT**
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000  
- ✅ Admin: http://localhost:3000/admin/login
- ✅ Login: admin / admin123

## 🔧 **IF PROBLEMS OCCUR**

### **Backend won't start:**
```bash
cd backend
cat .env
# Should show: PORT=5000, MONGO_URI, etc.
```

### **Frontend shows axios errors:**
```bash
node check-backend-health.js
```

### **404 Errors:**
- Make sure backend is running on port 5000
- Check: `curl http://localhost:5000/api/jobs`

## 📱 **TEST THE APPLICATION**

1. **Public Site:** http://localhost:3000
   - ✅ Jobs page loads
   - ✅ Contact form works
   - ✅ News page loads

2. **Admin Panel:** http://localhost:3000/admin/login
   - ✅ Login with admin/admin123
   - ✅ Can add/edit jobs
   - ✅ Can manage content

## 🎉 **SUCCESS!**
If everything works, your ENG RND project is ready for production deployment!

---
**Need help? Check the error messages and run the diagnostic scripts.**