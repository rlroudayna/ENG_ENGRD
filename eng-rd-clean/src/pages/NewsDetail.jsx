// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNewsById } from '../services/apiService';
import '../App.css';

export default function NewsDetail() {
  const { id } = useParams(); // Récupère l'ID de l'actualité depuis l'URL (ex: /news/123 -> id = 123)
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const newsData = await fetchNewsById(id);
        setNewsItem(newsData);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'actualité :", err);
        setError("Impossible de charger le détail de l'actualité. Elle n'existe peut-être pas ou une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]); // S'exécute quand l'ID change dans l'URL

  if (loading) {
    return <div className="page-content">Chargement de l'actualité...</div>;
  }

  if (error) {
    return <div className="page-content error-message">{error}</div>;
  }

  if (!newsItem) {
    return <div className="page-content no-content-message">Actualité introuvable.</div>;
  }

  return (
    <div className="page-content news-detail-page">
      <Link to="/news" className="back-button">← Retour aux actualités</Link>
      
      {newsItem.imageUrl && (
        <img 
          src={newsItem.imageUrl} 
          alt={newsItem.title} 
          className="news-detail-image" 
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x400/cccccc/333333?text=Image+non+disponible"; }} // Image de secours
        />
      )}

      <h1 className="news-detail-title">{newsItem.title}</h1>
      <p className="news-detail-date">Publié le : {new Date(newsItem.publishedAt).toLocaleDateString('fr-FR')}</p>
      <div className="news-detail-content">
        {/* Affiche le contenu complet de l'actualité */}
        <p>{newsItem.content}</p>
      </div>
    </div>
  );
}