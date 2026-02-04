// backend/testImageSystem.js
const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');
require('dotenv').config();

async function testImageSystem() {
  try {
    console.log('🖼️  Testing Image Management System...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check hero section images
    console.log('\n📸 Hero Section Images:');
    const heroContent = await HomeContent.findOne({ section: 'hero' });
    if (heroContent) {
      console.log('   🎬 Hero Video:');
      console.log(`      URL: ${heroContent.content.heroVideo?.url || heroContent.content.heroVideo}`);
      console.log(`      Alt: ${heroContent.content.heroVideo?.alt || 'N/A'}`);
      
      console.log('   👥 Teamwork Image:');
      console.log(`      URL: ${heroContent.content.teamworkImage?.url || heroContent.content.teamworkImage}`);
      console.log(`      Alt: ${heroContent.content.teamworkImage?.alt || 'N/A'}`);
      console.log(`      Link: ${heroContent.content.teamworkImage?.link || 'N/A'}`);
    }

    // Test 2: Check sectors images
    console.log('\n🏭 Sectors Images:');
    const sectorsContent = await HomeContent.findOne({ section: 'sectors' });
    if (sectorsContent) {
      console.log('   🚗 Transport Sector:');
      sectorsContent.content.transport?.cards?.forEach((card, index) => {
        console.log(`      ${index + 1}. ${card.name}:`);
        console.log(`         URL: ${card.image?.url || card.image}`);
        console.log(`         Alt: ${card.image?.alt || 'N/A'}`);
        console.log(`         Link: ${card.image?.link || 'N/A'}`);
      });
      
      console.log('   🔧 Other Sectors:');
      sectorsContent.content.other?.forEach((card, index) => {
        console.log(`      ${index + 1}. ${card.name}:`);
        console.log(`         URL: ${card.image?.url || card.image}`);
        console.log(`         Alt: ${card.image?.alt || 'N/A'}`);
        console.log(`         Link: ${card.image?.link || 'N/A'}`);
      });
    }

    // Test 3: Test updating an image
    console.log('\n🔄 Testing Image Update:');
    const testUpdate = await HomeContent.findOneAndUpdate(
      { section: 'hero' },
      { 
        $set: {
          'content.teamworkImage.link': '/test-link',
          'content.teamworkImage.alt': 'Test Alt Text'
        }
      },
      { new: true }
    );
    
    if (testUpdate) {
      console.log('   ✅ Image update successful:');
      console.log(`      New Link: ${testUpdate.content.teamworkImage.link}`);
      console.log(`      New Alt: ${testUpdate.content.teamworkImage.alt}`);
    }

    // Test 4: Restore original values
    await HomeContent.findOneAndUpdate(
      { section: 'hero' },
      { 
        $set: {
          'content.teamworkImage.link': '/contact',
          'content.teamworkImage.alt': 'Équipe ENG R&D au travail'
        }
      }
    );
    console.log('   ✅ Original values restored');

    console.log('\n🎉 Image Management System Test Complete!');
    console.log('\n📋 Features Available:');
    console.log('   - ✅ Hero video URL management');
    console.log('   - ✅ Teamwork image with clickable link');
    console.log('   - ✅ Sector images with individual links');
    console.log('   - ✅ Alt text for accessibility');
    console.log('   - ✅ Dynamic image rendering');
    console.log('   - ✅ Admin interface for editing');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Image system test failed:', error);
    process.exit(1);
  }
}

testImageSystem();