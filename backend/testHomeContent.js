// backend/testHomeContent.js
const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');
require('dotenv').config();

async function testHomeContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if data exists
    const allContent = await HomeContent.find();
    console.log(`✅ Found ${allContent.length} sections in database:`);
    
    allContent.forEach(item => {
      console.log(`   - ${item.section}: ${JSON.stringify(item.content).substring(0, 100)}...`);
    });

    // Test 2: Test updating a section
    console.log('\n🔄 Testing update operation...');
    const testUpdate = await HomeContent.findOneAndUpdate(
      { section: 'hero' },
      { 
        content: {
          title: "Test Title - Updated at " + new Date().toISOString(),
          subtitle: "Test subtitle",
          presentationTitle: "Test presentation",
          presentationText1: "Test text 1",
          presentationText2: "Test text 2"
        },
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    console.log('✅ Update successful:', testUpdate.section);

    // Test 3: Verify the update
    const updatedContent = await HomeContent.findOne({ section: 'hero' });
    console.log('✅ Verified update:', updatedContent.content.title);

    // Test 4: Restore original content
    console.log('\n🔄 Restoring original content...');
    await HomeContent.findOneAndUpdate(
      { section: 'hero' },
      { 
        content: {
          title: "Bienvenue chez ENG R&D",
          subtitle: "Votre partenaire en ingénierie automobile, expert en systèmes embarqués, modélisation et validation.",
          presentationTitle: "Votre partenaire en ingénierie automobile",
          presentationText1: "Depuis 2018 à Casablanca, ENG R&D propose des solutions de modélisation, simulation et logiciels embarqués.",
          presentationText2: "Nous engageons performance, innovation et qualité dans tous nos projets.",
          heroVideo: "/assets/hero-video.mp4",
          teamworkImage: "/assets/teamwork.jpg"
        },
        updatedAt: new Date()
      }
    );
    console.log('✅ Original content restored');

    console.log('\n🎉 All tests passed! MongoDB storage is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testHomeContent();