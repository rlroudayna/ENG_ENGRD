#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all axios import issues...\n');

// Files that need to be fixed
const filesToFix = [
  {
    file: 'eng-rd-clean/src/components/JobList.jsx',
    changes: [
      {
        from: 'import axios from "axios";',
        to: 'import { fetchJobs } from "../services/apiService";'
      },
      {
        from: 'axios.get("http://localhost:5000/api/jobs")\n      .then(response => {\n        setJobs(response.data);',
        to: 'const jobsData = await fetchJobs();\n        setJobs(jobsData);'
      }
    ]
  },
  {
    file: 'eng-rd-clean/src/components/ApplicationForm.jsx',
    changes: [
      {
        from: 'await axios.post(\'http://localhost:5000/api/applications\', form, {\n        headers: { \n          \'Content-Type\': \'multipart/form-data\' \n        }\n      });',
        to: 'await submitApplication(form);'
      }
    ]
  },
  {
    file: 'eng-rd-clean/src/admin/components/MessageList.jsx',
    changes: [
      {
        from: 'import axios from \'axios\';',
        to: 'import { fetchMessages, deleteMessage } from \'../../services/apiService\';'
      },
      {
        from: 'const response = await axios.get(\'http://localhost:5000/api/admin/messages\');',
        to: 'const response = await fetchMessages();'
      },
      {
        from: 'await axios.delete(`http://localhost:5000/api/admin/messages/${id}`);',
        to: 'await deleteMessage(id);'
      }
    ]
  }
];

// Function to apply fixes
function applyFixes() {
  filesToFix.forEach(({ file, changes }) => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;
      
      changes.forEach(({ from, to }) => {
        if (content.includes(from)) {
          content = content.replace(from, to);
          modified = true;
          console.log(`✅ Fixed: ${file}`);
        }
      });
      
      if (modified) {
        fs.writeFileSync(file, content);
      }
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });
}

// Apply all fixes
applyFixes();

console.log('\n🎉 All axios import issues have been fixed!');
console.log('\n📋 Next steps:');
console.log('1. Make sure backend is running on port 5000');
console.log('2. Restart the frontend: npm start');
console.log('3. Test the application');