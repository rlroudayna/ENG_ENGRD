# Image Management System for Homepage

## 🎯 Overview
The Image Management System allows admins to dynamically change all images and their associated links on the homepage through the admin panel. All images are stored in MongoDB with their URLs, alt text, and clickable links.

## 🖼️ Managed Images

### Hero Section
1. **Hero Video**
   - URL: Configurable video source
   - Alt text: For accessibility
   - Default: `/assets/hero-video.mp4`

2. **Teamwork Image**
   - URL: Image source
   - Alt text: For accessibility
   - Link: Clickable destination (e.g., `/contact`)
   - Default: `/assets/teamwork.jpg`

### Sectors Section
1. **Transport Sector Cards** (5 images)
   - Automobile → `/jobs?sector=automobile`
   - Aéronautique → `/jobs?sector=aeronautique`
   - Ferroviaire → `/jobs?sector=ferroviaire`
   - Spatial → `/jobs?sector=spatial`
   - Militaire → `/jobs?sector=militaire`

2. **Other Sectors** (3 images)
   - Énergie → `/jobs?sector=energie`
   - Santé → `/jobs?sector=sante`
   - IT → `/jobs?sector=it`

## 🗄️ Database Structure

### Image Object Format
```javascript
{
  url: "/assets/image.jpg",    // Image source URL
  alt: "Description",          // Alt text for accessibility
  link: "/destination"         // Optional clickable link
}
```

### Hero Section in Database
```javascript
{
  section: "hero",
  content: {
    // ... text content ...
    heroVideo: {
      url: "/assets/hero-video.mp4",
      alt: "Vidéo de présentation ENG R&D"
    },
    teamworkImage: {
      url: "/assets/teamwork.jpg",
      alt: "Équipe ENG R&D au travail",
      link: "/contact"
    }
  }
}
```

### Sectors Section in Database
```javascript
{
  section: "sectors",
  content: {
    preTitle: "NOS DOMAINES D'APPLICATION",
    title: "Secteurs d'activités",
    transport: {
      title: "Transport",
      cards: [
        {
          name: "Automobile",
          image: {
            url: "/assets/Automobile.jpg",
            alt: "Secteur Automobile",
            link: "/jobs?sector=automobile"
          }
        }
        // ... more cards
      ]
    },
    other: [
      {
        name: "Énergie",
        image: {
          url: "/assets/Energy.png",
          alt: "Secteur Énergie",
          link: "/jobs?sector=energie"
        }
      }
      // ... more sectors
    ]
  }
}
```

## 🎛️ Admin Interface

### Hero Section Editor
- ✅ Hero video URL input
- ✅ Hero video alt text
- ✅ Teamwork image URL input
- ✅ Teamwork image alt text
- ✅ Teamwork image link input

### Sectors Editor
- ✅ Transport sector title
- ✅ Each transport card (name, image URL, alt text, link)
- ✅ Other sectors (name, image URL, alt text, link)
- ✅ Section title and pre-title

## 🌐 Frontend Rendering

### Hero Section
```jsx
// Hero Video
<video autoPlay muted loop className="hero-video">
  <source src={heroContent.heroVideo?.url || defaultVideo} type="video/mp4" />
</video>

// Teamwork Image with Link
{heroContent.teamworkImage?.link ? (
  <a href={heroContent.teamworkImage.link}>
    <img 
      src={heroContent.teamworkImage?.url || defaultImage} 
      alt={heroContent.teamworkImage?.alt || "Default Alt"} 
    />
  </a>
) : (
  <img 
    src={heroContent.teamworkImage?.url || defaultImage} 
    alt={heroContent.teamworkImage?.alt || "Default Alt"} 
  />
)}
```

### Sectors Section
```jsx
// Transport Cards
{sectorsContent.transport?.cards?.map((card, index) => (
  <div key={index} className="sector-card">
    {card.image?.link ? (
      <a href={card.image.link}>
        <img src={card.image?.url} alt={card.image?.alt} />
        <div className="sector-overlay">
          <p>{card.name}</p>
        </div>
      </a>
    ) : (
      <>
        <img src={card.image?.url} alt={card.image?.alt} />
        <div className="sector-overlay">
          <p>{card.name}</p>
        </div>
      </>
    )}
  </div>
))}
```

## 🔧 API Endpoints

### Public (No Auth Required)
- `GET /api/home-content` - Get all content including images
- `GET /api/home-content/hero` - Get hero section with images
- `GET /api/home-content/sectors` - Get sectors with images

### Admin (Auth Required)
- `PUT /api/admin/home-content/hero` - Update hero images
- `PUT /api/admin/home-content/sectors` - Update sector images

## ✨ Features

### ✅ Implemented
- **Dynamic Image URLs**: Change any image URL from admin panel
- **Clickable Images**: Add/edit links for images
- **Alt Text Management**: Edit alt text for accessibility
- **Fallback Support**: Default images if database is empty
- **Real-time Updates**: Changes reflect immediately on homepage
- **Responsive Design**: Works on all device sizes
- **SEO Friendly**: Proper alt text and semantic HTML

### 🎯 Benefits
- **No Code Changes**: Update images without touching code
- **SEO Optimized**: Proper alt text for search engines
- **User Experience**: Clickable images for better navigation
- **Accessibility**: Screen reader friendly
- **Performance**: Optimized image loading
- **Maintainability**: Centralized image management

## 🚀 Usage Instructions

### For Admins
1. Login to admin panel: `http://localhost:3000/admin/login`
2. Navigate to: `http://localhost:3000/admin/home-content`
3. Select "Section Héro" or "Secteurs d'activités"
4. Edit image URLs, alt text, and links
5. Click "Sauvegarder" to save changes
6. Visit homepage to see changes immediately

### For Developers
- Images automatically fallback to imported assets if database is empty
- All image objects support both old format (string) and new format (object)
- Backward compatibility maintained for existing implementations

## 🔍 Testing
```bash
# Test the image system
node testImageSystem.js

# Verify database content
node verifyHomeContentSystem.js

# Check API responses
curl http://localhost:5000/api/home-content
```

## 📱 Mobile Responsiveness
- All images scale properly on mobile devices
- Touch-friendly clickable areas
- Optimized loading for slower connections
- Maintains aspect ratios across devices