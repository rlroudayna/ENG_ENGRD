# Home Content Management System

## Overview
The Home Content Management System stores all homepage texts and content in MongoDB instead of cache, providing persistent, editable content management.

## Database Structure

### Collection: `homecontents`
```javascript
{
  _id: ObjectId,
  section: String, // 'hero', 'about', 'expertise', 'sectors', 'values'
  content: Mixed,  // JSON object with section-specific content
  updatedAt: Date,
  updatedBy: String,
  version: Number,
  createdAt: Date
}
```

## Content Sections

### 1. Hero Section
```javascript
{
  section: "hero",
  content: {
    title: "Bienvenue chez ENG R&D",
    subtitle: "Votre partenaire en ingénierie automobile...",
    presentationTitle: "Votre partenaire en ingénierie automobile",
    presentationText1: "Depuis 2018 à Casablanca...",
    presentationText2: "Nous engageons performance...",
    heroVideo: "/assets/hero-video.mp4",
    teamworkImage: "/assets/teamwork.jpg"
  }
}
```

### 2. About Section
```javascript
{
  section: "about",
  content: {
    title: "Qui sommes nous",
    description: "Nous sommes une équipe passionnée...",
    cards: [
      {
        icon: "💡",
        title: "Innovation",
        description: "Nous utilisons les dernières technologies..."
      }
      // ... more cards
    ]
  }
}
```

### 3. Expertise Section
```javascript
{
  section: "expertise",
  content: {
    preTitle: "NOTRE EXPERTISE",
    title: "Vous accompagner dans vos projets",
    cards: [
      { text: "Conception" },
      { text: "Développement" },
      // ... more cards
    ]
  }
}
```

### 4. Values Section
```javascript
{
  section: "values",
  content: {
    title: "Nos engagements, nos valeurs",
    subtitle: "Notre engagement : Placer l'humain au cœur de nos projets",
    description: "Nous croyons que l'éthique...",
    cards: [
      {
        title: "Satisfaction Client",
        description: "Garantir un accompagnement fiable..."
      }
      // ... more cards
    ]
  }
}
```

## API Endpoints

### Public Endpoints (No Authentication)
- `GET /api/home-content` - Get all content sections
- `GET /api/home-content/:section` - Get specific section content

### Admin Endpoints (Authentication Required)
- `GET /api/admin/home-content` - Get all content for admin
- `PUT /api/admin/home-content/:section` - Update specific section
- `GET /api/admin/home-content/:section` - Get specific section for admin

## Frontend Integration

### Public Pages
```javascript
import { useHomeContent } from '../hooks/useHomeContent';

const { getContent, loading } = useHomeContent();
const heroContent = getContent('hero', defaultHeroContent);
```

### Admin Interface
```javascript
import { adminClient } from '../../utils/axiosConfig';

// Fetch content
const response = await adminClient.get('/admin/home-content');

// Update content
await adminClient.put(`/admin/home-content/${section}`, {
  content: sectionContent
});
```

## Features

### ✅ Implemented
- **Persistent Storage**: All content stored in MongoDB
- **Version Control**: Automatic version incrementing on updates
- **Audit Trail**: Track who updated what and when
- **Validation**: Content validation to prevent empty updates
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Fast database queries (<5ms)
- **Admin Interface**: Full CRUD interface for content management
- **Public API**: Fast public access to content without authentication

### 🔧 Technical Features
- **Automatic Timestamps**: CreatedAt and UpdatedAt fields
- **Pre-save Hooks**: Version incrementing and validation
- **Flexible Schema**: Mixed type for content allows any JSON structure
- **Unique Constraints**: Prevents duplicate sections
- **Enum Validation**: Only allows valid section names

## Usage

### Initialize Database
```bash
node seedHomeContent.js
```

### Verify System
```bash
node verifyHomeContentSystem.js
```

### Test Database Operations
```bash
node testHomeContent.js
```

## Admin Access
1. Login at: `http://localhost:3000/admin/login`
2. Navigate to: `http://localhost:3000/admin/home-content`
3. Edit any section and save changes
4. Changes are immediately stored in MongoDB and reflected on the public site

## Data Flow
1. **Admin Updates**: Admin edits content → Saved to MongoDB → Version incremented
2. **Public Display**: Public page loads → Fetches from MongoDB → Displays content
3. **Caching**: No caching used - always fresh data from database
4. **Fallbacks**: Default content used if database is unavailable

## Security
- **Admin Only**: Only authenticated admins can modify content
- **Public Read**: Anyone can read content (for public pages)
- **Validation**: All updates validated before saving
- **Audit Trail**: All changes tracked with user and timestamp