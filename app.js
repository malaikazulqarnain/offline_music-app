// File: C:\Users\HP\OneDrive\Desktop\music-app\app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/offline_music')
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ Error:', err.message));

// ==================== CONTACT SCHEMA ====================
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  message: { type: String, required: true },
  phone: String,  // ✅ Naya field
  subject: String, // ✅ Naya field  
  status: { 
    type: String, 
    enum: ['pending', 'read', 'replied'],
    default: 'pending'
  },
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// ==================== NEWSLETTER SCHEMA ====================
const subscriberSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  name: String,
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// ==================== ANALYTICS SCHEMA ====================
const analyticsSchema = new mongoose.Schema({
  source: String, // website, play_store, etc
  device: String, // mobile, desktop
  country: String,
  downloadDate: { type: Date, default: Date.now }
});
const Analytics = mongoose.model('Analytics', analyticsSchema);

// ==================== ROUTES/APIs ====================

// 1. Home Page
app.get('/', (req, res) => {
  res.send('🎵 Music App Working from C:\\Users\\HP\\OneDrive\\Desktop\\music-app');
});

// 2. Save Contact (Improved with validation)
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message, phone, subject } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email and message are required' 
      });
    }
    
    const contact = new Contact({ 
      name, 
      email, 
      message, 
      phone, 
      subject,
      status: 'pending'
    });
    await contact.save();
    
    res.json({ 
      success: true, 
      message: 'Contact saved successfully!',
      id: contact._id
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 3. Get All Contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 4. Subscribe to Newsletter
app.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    const subscriber = new Subscriber({ email, name });
    await subscriber.save();
    
    res.json({ 
      success: true, 
      message: 'Subscribed successfully!' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 5. Get All Subscribers
app.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 6. Track Download
app.post('/track-download', async (req, res) => {
  try {
    const { source, device, country } = req.body;
    
    const analytics = new Analytics({ 
      source: source || 'website',
      device: device || 'unknown',
      country: country || 'unknown'
    });
    await analytics.save();
    
    res.json({ 
      success: true, 
      message: 'Download tracked!',
      id: analytics._id
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 7. Get Download Analytics
app.get('/analytics', async (req, res) => {
  try {
    const analytics = await Analytics.find();
    res.json({
      success: true,
      count: analytics.length,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 8. Search Contacts by Email
app.get('/contacts/search', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email query parameter is required' 
      });
    }
    
    const contacts = await Contact.find({ 
      email: { $regex: email, $options: 'i' } 
    });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📁 Your Folder: C:\\Users\\HP\\OneDrive\\Desktop\\music-app`);
  console.log(`📊 Available APIs:`);
  console.log(`   • GET  /                  - Home page`);
  console.log(`   • POST /contact           - Save contact`);
  console.log(`   • GET  /contacts          - Get all contacts`);
  console.log(`   • GET  /contacts/search?email=... - Search contacts`);
  console.log(`   • POST /subscribe         - Newsletter subscribe`);
  console.log(`   • GET  /subscribers       - Get all subscribers`);
  console.log(`   • POST /track-download    - Track app download`);
  console.log(`   • GET  /analytics         - Get download analytics`);
});