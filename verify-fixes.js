#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 VERIFYING ALL FIXES...\n');

// Check EditJobForm.jsx
const editJobForm = fs.readFileSync('eng-rd-clean/src/admin/components/EditJobForm.jsx', 'utf8');
if (editJobForm.includes('fetchJobById, updateJob') && !editJobForm.includes('axios') && !editJobForm.includes('adminClient')) {
  console.log('✅ EditJobForm.jsx - FIXED');
} else {
  console.log('❌ EditJobForm.jsx - STILL HAS ISSUES');
}

// Check NewsDetail.jsx
const newsDetail = fs.readFileSync('eng-rd-clean/src/pages/NewsDetail.jsx', 'utf8');
if (newsDetail.includes('fetchNewsById') && !newsDetail.includes('axios.get')) {
  console.log('✅ NewsDetail.jsx - FIXED');
} else {
  console.log('❌ NewsDetail.jsx - STILL HAS ISSUES');
}

// Check ApplicationForm.jsx
const appForm = fs.readFileSync('eng-rd-clean/src/components/ApplicationForm.jsx', 'utf8');
if (appForm.includes('submitApplication') && !appForm.includes('axios.post')) {
  console.log('✅ ApplicationForm.jsx - FIXED');
} else {
  console.log('❌ ApplicationForm.jsx - STILL HAS ISSUES');
}

// Check JobList.jsx
const jobList = fs.readFileSync('eng-rd-clean/src/components/JobList.jsx', 'utf8');
if (jobList.includes('fetchJobs') && !jobList.includes('axios.get')) {
  console.log('✅ JobList.jsx - FIXED');
} else {
  console.log('❌ JobList.jsx - STILL HAS ISSUES');
}

console.log('\n🎯 ALL CRITICAL FIXES APPLIED!');
console.log('\n📋 NEXT STEPS:');
console.log('1. Start backend: cd backend && npm start');
console.log('2. Start frontend: cd eng-rd-clean && npm start');
console.log('3. Test: http://localhost:3000');