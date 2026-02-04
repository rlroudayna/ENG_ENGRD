// src/pages/Actualites.jsx
import React, { useEffect, useState } from 'react';
import { fetchNews } from '../services/apiService';
import { Link } from 'react-router-dom';
import './Actualites.css';

export default function Actualites() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (err) {
        console.error("Erreur lors de la récupération des actualités :", err);
        setError("Impossible de charger les actualités pour le moment. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return <div className="page-content">Chargement des actualités...</div>;
  }

  if (error) {
    return <div className="page-content error-message">{error}</div>;
  }

  return (
    <div className="actualites-page">
      {/* Header de la page */}
      <header className="actualites-header">
        <div className="actualites-header-content">
          <h1 className="actualites-title">
            Nos <span className="title-highlight">Actualités</span>
          </h1>
          <p className="actualites-subtitle">
            Découvrez les dernières nouvelles et innovations d'ENG RND
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="actualites-container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des actualités...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="no-content-container">
            <h3>Aucune actualité disponible</h3>
            <p>Revenez bientôt pour découvrir nos dernières nouvelles !</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="news-grid">
            {news.map((item) => (
              <article key={item._id} className="news-card">
                {item.imageUrl && (
                  <div className="news-image-container">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="news-image" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/400x250/7fcc72/ffffff?text=ENG+R%26D"; 
                      }}
                    />
                  </div>
                )}
                <div className="news-content">
                  <div className="news-meta">
                    <time className="news-date">
                      {new Date(item.publishedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <h2 className="news-title">{item.title}</h2>
                  <p className="news-excerpt">
                    {item.content.length > 150 
                      ? `${item.content.substring(0, 150)}...` 
                      : item.content
                    }
                  </p>
                  <Link to={`/news/${item._id}`} className="read-more-btn">
                    Lire la suite
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}