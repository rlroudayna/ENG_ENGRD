@echo off
echo 🚀 Starting backend server...
cd backend
start "Backend Server" cmd /k "npm start"

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 🔄 Resetting jobs with sectors...
node resetJobs.js

echo ✅ Done! Check your application now.
pause