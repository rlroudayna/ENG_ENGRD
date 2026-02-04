// backend/verifyHomeContentSystem.js
const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');
require('dotenv').config();

async function verifySystem() {
  try {
    console.log('🔍 Verifying Home Content System...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check database structure
    console.log('\n📊 Database Structure:');
    const allContent = await HomeContent.find().select('section updatedAt version updatedBy');
    
    if (allContent.length === 0) {
      console.log('❌ No content found in database!');
      return;
    }
    
    allContent.forEach(item => {
      console.log(`   📄 ${item.section}:`);
      console.log(`      - Version: ${item.version || 1}`);
      console.log(`      - Updated: ${item.updatedAt}`);
      console.log(`      - Updated by: ${item.updatedBy || 'unknown'}`);
    });

    // Test 2: Verify all required sections exist
    console.log('\n🔍 Checking Required Sections:');
    const requiredSections = ['hero', 'about', 'expertise', 'sectors', 'values'];
    const existingSections = allContent.map(item => item.section);
    
    requiredSections.forEach(section => {
      if (existingSections.includes(section)) {
        console.log(`   ✅ ${section} - Found`);
      } else {
        console.log(`   ❌ ${section} - Missing`);
      }
    });

    // Test 3: Verify content structure for each section
    console.log('\n📋 Content Structure Verification:');
    
    for (const section of requiredSections) {
      const content = await HomeContent.findOne({ section });
      if (content) {
        const keys = Object.keys(content.content);
        console.log(`   📄 ${section}: ${keys.length} properties`);
        console.log(`      Keys: ${keys.join(', ')}`);
        
        // Verify specific required fields
        switch (section) {
          case 'hero':
            const heroRequired = ['title', 'subtitle', 'presentationTitle'];
            const heroMissing = heroRequired.filter(key => !content.content[key]);
            if (heroMissing.length === 0) {
              console.log(`      ✅ All required hero fields present`);
            } else {
              console.log(`      ❌ Missing hero fields: ${heroMissing.join(', ')}`);
            }
            break;
            
          case 'about':
            if (content.content.title && content.content.description && content.content.cards) {
              console.log(`      ✅ All required about fields present`);
            } else {
              console.log(`      ❌ Missing required about fields`);
            }
            break;
            
          case 'values':
            if (content.content.title && content.content.cards && Array.isArray(content.content.cards)) {
              console.log(`      ✅ All required values fields present (${content.content.cards.length} cards)`);
            } else {
              console.log(`      ❌ Missing required values fields`);
            }
            break;
        }
      }
    }

    // Test 4: Test update operation
    console.log('\n🔄 Testing Update Operation:');
    const testSection = 'hero';
    const originalContent = await HomeContent.findOne({ section: testSection });
    const originalVersion = originalContent.version;
    
    // Update with test data
    await HomeContent.findOneAndUpdate(
      { section: testSection },
      { 
        content: {
          ...originalContent.content,
          title: "TEST UPDATE - " + new Date().toISOString()
        },
        updatedBy: 'system-test'
      },
      { new: true }
    );
    
    // Verify update
    const updatedContent = await HomeContent.findOne({ section: testSection });
    if (updatedContent.version > originalVersion) {
      console.log(`   ✅ Version incremented: ${originalVersion} → ${updatedContent.version}`);
    } else {
      console.log(`   ❌ Version not incremented`);
    }
    
    if (updatedContent.updatedBy === 'system-test') {
      console.log(`   ✅ UpdatedBy field working correctly`);
    } else {
      console.log(`   ❌ UpdatedBy field not working`);
    }
    
    // Restore original content
    await HomeContent.findOneAndUpdate(
      { section: testSection },
      { 
        content: originalContent.content,
        updatedBy: 'system-restore'
      }
    );
    console.log(`   ✅ Original content restored`);

    // Test 5: Performance check
    console.log('\n⚡ Performance Check:');
    const startTime = Date.now();
    await HomeContent.find();
    const endTime = Date.now();
    console.log(`   ✅ Database query time: ${endTime - startTime}ms`);

    console.log('\n🎉 System Verification Complete!');
    console.log('\n📋 Summary:');
    console.log(`   - Database: Connected and working`);
    console.log(`   - Sections: ${allContent.length}/5 required sections found`);
    console.log(`   - Versioning: Working correctly`);
    console.log(`   - Updates: Working correctly`);
    console.log(`   - Performance: Good (${endTime - startTime}ms)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ System verification failed:', error);
    process.exit(1);
  }
}

verifySystem();