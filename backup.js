// File: backup.js
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function backupData() {
  console.log('🔍 Starting backup...');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/offline_music');
    console.log('✅ Connected to MongoDB');
    
    // Define models
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      message: String,
      phone: String,
      subject: String,
      status: String,
      date: Date
    });
    
    const subscriberSchema = new mongoose.Schema({
      email: String,
      name: String,
      subscribedAt: Date,
      isActive: Boolean
    });
    
    const analyticsSchema = new mongoose.Schema({
      source: String,
      device: String,
      country: String,
      downloadDate: Date
    });
    
    const Contact = mongoose.model('Contact', contactSchema);
    const Subscriber = mongoose.model('Subscriber', subscriberSchema);
    const Analytics = mongoose.model('Analytics', analyticsSchema);
    
    // Get all data
    console.log('📥 Fetching contacts...');
    const contacts = await Contact.find();
    
    console.log('📥 Fetching subscribers...');
    const subscribers = await Subscriber.find();
    
    console.log('📥 Fetching analytics...');
    const analytics = await Analytics.find();
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      database: 'offline_music',
      totalRecords: contacts.length + subscribers.length + analytics.length,
      contacts: contacts,
      subscribers: subscribers,
      analytics: analytics
    };
    
    // Save to file
    fs.writeFileSync('backup.json', JSON.stringify(backup, null, 2));
    console.log('💾 Backup saved to backup.json');
    
    // Show summary
    console.log('\n📊 Backup Summary:');
    console.log(`   Contacts: ${contacts.length} records`);
    console.log(`   Subscribers: ${subscribers.length} records`);
    console.log(`   Analytics: ${analytics.length} records`);
    console.log(`   Total: ${backup.totalRecords} records`);
    
    await mongoose.disconnect();
    console.log('✅ Backup completed successfully!');
    
  } catch (error) {
    console.log('❌ Backup failed:', error.message);
  }
}

backupData();