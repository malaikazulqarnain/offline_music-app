DATABASE SCHEMA DOCUMENTATION
=============================

Database: offline_music

1. CONTACTS Collection:
   - name: String (required)
   - email: String (required, lowercase)
   - message: String (required)
   - phone: String (optional)
   - subject: String (optional)
   - status: String ['pending', 'read', 'replied']
   - date: Date (auto)

2. SUBSCRIBERS Collection:
   - email: String (required, unique)
   - name: String (optional)
   - subscribedAt: Date (auto)
   - isActive: Boolean (default: true)

3. ANALYTICS Collection:
   - source: String
   - device: String
   - country: String
   - downloadDate: Date (auto)

APIs Available:
- POST /contact - Save contact
- GET /contacts - Get all contacts
- GET /contacts/search?email=... - Search contacts
- POST /subscribe - Subscribe newsletter
- GET /subscribers - Get all subscribers
- POST /track-download - Track download
- GET /analytics - Get analytics