#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 FIXING ALL ADMIN COMPONENTS...\n');

// Fix ApplicationList.jsx
const appListPath = 'eng-rd-clean/src/admin/components/ApplicationList.jsx';
if (fs.existsSync(appListPath)) {
  let content = fs.readFileSync(appListPath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import.*adminClient.*from.*axiosConfig.*/,
    "import { fetchApplications, deleteApplication } from '../../services/apiService';"
  );
  
  // Replace API calls
  content = content.replace(
    /await adminClient\.get\('\/admin\/applications'\)/g,
    'await fetchApplications()'
  );
  
  content = content.replace(
    /await adminClient\.delete\(`\/admin\/applications\/\$\{.*?\}`\)/g,
    'await deleteApplication(id)'
  );
  
  fs.writeFileSync(appListPath, content);
  console.log('✅ Fixed ApplicationList.jsx');
}

// Fix ContactList.jsx
const contactListPath = 'eng-rd-clean/src/admin/components/ContactList.jsx';
if (fs.existsSync(contactListPath)) {
  let content = fs.readFileSync(contactListPath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import.*adminClient.*from.*axiosConfig.*/,
    "import { fetchMessages, deleteMessage } from '../../services/apiService';"
  );
  
  // Replace API calls
  content = content.replace(
    /await adminClient\.get\('\/admin\/messages'\)/g,
    'await fetchMessages()'
  );
  
  content = content.replace(
    /await adminClient\.delete\(`\/admin\/messages\/\$\{.*?\}`\)/g,
    'await deleteMessage(id)'
  );
  
  fs.writeFileSync(contactListPath, content);
  console.log('✅ Fixed ContactList.jsx');
}

// Fix NewsList.jsx
const newsListPath = 'eng-rd-clean/src/admin/components/NewsList.jsx';
if (fs.existsSync(newsListPath)) {
  let content = fs.readFileSync(newsListPath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import.*adminClient.*from.*axiosConfig.*/,
    "import { fetchNews, createNews, updateNews, deleteNews } from '../../services/apiService';"
  );
  
  // Replace API calls
  content = content.replace(
    /await adminClient\.get\('\/admin\/news'\)/g,
    'await fetchNews()'
  );
  
  content = content.replace(
    /await adminClient\.post\('\/admin\/news'/g,
    'await createNews('
  );
  
  content = content.replace(
    /await adminClient\.put\(`\/admin\/news\/\$\{.*?\}`/g,
    'await updateNews(id'
  );
  
  content = content.replace(
    /await adminClient\.delete\(`\/admin\/news\/\$\{.*?\}`\)/g,
    'await deleteNews(id)'
  );
  
  fs.writeFileSync(newsListPath, content);
  console.log('✅ Fixed NewsList.jsx');
}

// Fix AddJobForm.jsx
const addJobPath = 'eng-rd-clean/src/admin/components/AddJobForm.jsx';
if (fs.existsSync(addJobPath)) {
  let content = fs.readFileSync(addJobPath, 'utf8');
  
  // Replace imports
  content = content.replace(
    /import.*adminClient.*from.*axiosConfig.*/,
    "import { createJob } from '../../services/apiService';"
  );
  
  // Replace API calls
  content = content.replace(
    /await adminClient\.post\('\/admin\/jobs'/g,
    'await createJob('
  );
  
  fs.writeFileSync(addJobPath, content);
  console.log('✅ Fixed AddJobForm.jsx');
}

console.log('\n🎉 ALL ADMIN COMPONENTS FIXED!');
console.log('\n📋 The admin interface should now work properly.');
console.log('🔄 Refresh your browser to see the changes.');