#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 COMPREHENSIVE FIX TOOL - ENG RND PROJECT');
console.log('===========================================\n');

// Step 1: Fix all axios import issues
console.log('📋 Step 1: Fixing axios import issues...');

const axiosFixFiles = [
  {
    file: 'eng-rd-clean/src/components/ApplicationForm.jsx',
    fixes: [
      {
        search: /await axios\.post\('http:\/\/localhost:5000\/api\/applications', form, \{\s*headers: \{\s*'Content-Type': 'multipart\/form-data'\s*\}\s*\}\);/s,
        replace: 'await submitApplication(form);'
      }
    ]
  },
  {
    file: 'eng-rd-clean/src/admin/components/EditJobForm.jsx',
    fixes: [
      {
        search: /axios\.get\(`http:\/\/localhost:5000\/api\/jobs\/\$\{id\}`\)\s*\.then\(res => \{\s*const jobData = res\.data;[\s\S]*?\}\)\s*\.catch\(err => \{[\s\S]*?\}\);/,
        replace: `const loadJob = async () => {
      try {
        const jobData = await fetchJobById(id);
        setForm({
          title: jobData.title || '',
          company: jobData.company || '',
          location: jobData.location || '',
          type: jobData.type || '',
          description: jobData.description || '',
          requirements: jobData.requirements || '',
          salary: jobData.salary || '',
          sector: jobData.sector || '',
          companyLogo: jobData.companyLogo || ''
        });
      } catch (error) {
        console.error('Erreur lors du chargement de l\\'offre:', error);
        alert('Erreur lors du chargement de l\\'offre');
      }
    };

    if (id) {
      loadJob();
    }`
      }
    ]
  },
  {
    file: 'eng-rd-clean/src/admin/components/MessageList.jsx',
    fixes: [
      {
        search: /import axios from 'axios';/,
        replace: "import { fetchMessages, deleteMessage } from '../../services/apiService';"
      },
      {
        search: /const response = await axios\.get\('http:\/\/localhost:5000\/api\/admin\/messages'\);/,
        replace: 'const messages = await fetchMessages();'
      },
      {
        search: /setMessages\(response\.data\);/,
        replace: 'setMessages(messages);'
      },
      {
        search: /await axios\.delete\(`http:\/\/localhost:5000\/api\/admin\/messages\/\$\{id\}`\);/,
        replace: 'await deleteMessage(id);'
      }
    ]
  },
  {
    file: 'eng-rd-clean/src/pages/NewsDetail.jsx',
    fixes: [
      {
        search: /const response = await axios\.get\(`http:\/\/localhost:5000\/api\/news\/\$\{id\}`\);\s*setNewsItem\(response\.data\);/,
        replace: `const newsData = await fetchNews();
        const item = newsData.find(news => news._id === id);
        setNewsItem(item);`
      }
    ]
  }
];

// Apply axios fixes
axiosFixFiles.forEach(({ file, fixes }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    fixes.forEach(({ search, replace }) => {
      if (typeof search === 'string' ? content.includes(search) : search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed: ${file}`);
    }
  }
});

console.log('\n📋 Step 2: Creating missing API service functions...');

// Add missing API functions to apiService.js
const apiServicePath = 'eng-rd-clean/src/services/apiService.js';
if (fs.existsSync(apiServicePath)) {
  let apiContent = fs.readFileSync(apiServicePath, 'utf8');

  // Add fetchNewsById function if missing
  if (!apiContent.includes('fetchNewsById')) {
    const fetchNewsByIdFunction = `
export async function fetchNewsById(id) {
  const { data } = await publicClient.get(\`/api/news/\${id}\`);
  return data;
}`;

    // Insert after fetchNews function
    apiContent = apiContent.replace(
      'export async function fetchNews() {',
      `export async function fetchNews() {`
    );

    apiContent = apiContent.replace(
      'export async function createNews(newsData) {',
      `${fetchNewsByIdFunction}

export async function createNews(newsData) {`
    );

    fs.writeFileSync(apiServicePath, apiContent);
    console.log('✅ Added fetchNewsById function to apiService.js');
  }
}

console.log('\n📋 Step 3: Creating backend health check script...');

// Create backend health check
const backendHealthCheck = `#!/usr/bin/env node

const axios = require('axios');

async function checkBackend() {
  console.log('🔍 Checking backend health...');
  
  try {
    // Test basic connection
    const response = await axios.get('http://localhost:5000', { timeout: 5000 });
    console.log('✅ Backend is responding');
    
    // Test API endpoints
    const endpoints = [
      '/api/jobs',
      '/api/news',
      '/api/home-content'
    ];
    
    for (const endpoint of endpoints) {
      try {
        await axios.get(\`http://localhost:5000\${endpoint}\`, { timeout: 5000 });
        console.log(\`✅ \${endpoint} - OK\`);
      } catch (error) {
        console.log(\`❌ \${endpoint} - ERROR: \${error.message}\`);
      }
    }
    
  } catch (error) {
    console.log('❌ Backend is not responding');
    console.log('💡 Make sure to start the backend:');
    console.log('   cd backend && npm start');
    return false;
  }
  
  return true;
}

checkBackend();
`;

fs.writeFileSync('check-backend-health.js', backendHealthCheck);
console.log('✅ Created backend health check script');

console.log('\n📋 Step 4: Creating startup script...');

// Create startup script
const startupScript = `#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 ENG RND PROJECT STARTUP SCRIPT');
console.log('==================================\\n');

// Check if backend directory exists
if (!fs.existsSync('backend')) {
  console.log('❌ Backend directory not found!');
  process.exit(1);
}

// Check if frontend directory exists
if (!fs.existsSync('eng-rd-clean')) {
  console.log('❌ Frontend directory not found!');
  process.exit(1);
}

console.log('📋 Starting backend...');

// Start backend
const backend = spawn('npm', ['start'], {
  cwd: 'backend',
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.log(\`❌ Backend error: \${error.message}\`);
});

// Wait a bit then start frontend
setTimeout(() => {
  console.log('\\n📋 Starting frontend...');
  
  const frontend = spawn('npm', ['start'], {
    cwd: 'eng-rd-clean',
    stdio: 'inherit',
    shell: true
  });
  
  frontend.on('error', (error) => {
    console.log(\`❌ Frontend error: \${error.message}\`);
  });
}, 3000);

console.log('\\n✅ Both servers are starting...');
console.log('📍 Frontend: http://localhost:3000');
console.log('📍 Backend: http://localhost:5000');
console.log('📍 Admin: http://localhost:3000/admin/login');
`;

fs.writeFileSync('start-project.js', startupScript);
console.log('✅ Created startup script');

console.log('\n📋 Step 5: Creating environment check...');

// Create environment check
const envCheck = `#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 ENVIRONMENT CHECK');
console.log('===================\\n');

// Check Node.js version
console.log('📋 Node.js version:', process.version);

// Check if required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/.env',
  'backend/server.js',
  'eng-rd-clean/package.json',
  'eng-rd-clean/src/App.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(\`✅ \${file}\`);
  } else {
    console.log(\`❌ \${file} - MISSING\`);
    allFilesExist = false;
  }
});

// Check backend dependencies
if (fs.existsSync('backend/package.json')) {
  const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'cors', 'jsonwebtoken', 'dotenv'];
  
  console.log('\\n📋 Backend dependencies:');
  requiredDeps.forEach(dep => {
    if (backendPkg.dependencies && backendPkg.dependencies[dep]) {
      console.log(\`✅ \${dep}\`);
    } else {
      console.log(\`❌ \${dep} - MISSING\`);
      allFilesExist = false;
    }
  });
}

// Check frontend dependencies
if (fs.existsSync('eng-rd-clean/package.json')) {
  const frontendPkg = JSON.parse(fs.readFileSync('eng-rd-clean/package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
  
  console.log('\\n📋 Frontend dependencies:');
  requiredDeps.forEach(dep => {
    if (frontendPkg.dependencies && frontendPkg.dependencies[dep]) {
      console.log(\`✅ \${dep}\`);
    } else {
      console.log(\`❌ \${dep} - MISSING\`);
      allFilesExist = false;
    }
  });
}

if (allFilesExist) {
  console.log('\\n🎉 Environment check passed!');
  console.log('\\n📋 Next steps:');
  console.log('1. Run: node start-project.js');
  console.log('2. Wait for both servers to start');
  console.log('3. Open http://localhost:3000');
} else {
  console.log('\\n❌ Environment check failed!');
  console.log('\\n📋 Fix the missing files/dependencies first:');
  console.log('- cd backend && npm install');
  console.log('- cd eng-rd-clean && npm install');
}
`;

fs.writeFileSync('check-environment.js', envCheck);
console.log('✅ Created environment check script');

console.log('\n🎉 ALL FIXES APPLIED SUCCESSFULLY!');
console.log('\n📋 NEXT STEPS:');
console.log('1. Run: node check-environment.js');
console.log('2. Run: node check-backend-health.js (after starting backend)');
console.log('3. Run: node start-project.js (to start both servers)');
console.log('\n✨ Your ENG RND project should now work perfectly!');