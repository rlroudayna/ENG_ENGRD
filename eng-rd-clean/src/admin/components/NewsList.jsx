// src/admin/components/NewsList.jsx
import { useState, useEffect } from 'react';
import { fetchNews, createNews, updateNews, deleteNews } from '../../services/apiService';
import { formatDate, isDateWithinDays } from '../../utils/dateUtils';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [newNews, setNewNews] = useState({ title: '', content: '', imageUrl: '' });
  const [editingNews, setEditingNews] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(Array.isArray(newsData) ? newsData : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des actualités :", err);
        setError("Impossible de charger les actualités. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNews(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) {
      showNotification("Veuillez saisir un titre et un contenu pour l'actualité.", 'error');
      return;
    }
    try {
      const res = await createNews(newNews);
      setNews([...news, res]);
      setNewNews({ title: '', content: '', imageUrl: '' });
      showNotification("Actualité ajoutée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'actualité :", err);
      showNotification("Erreur lors de l'ajout de l'actualité.", 'error');
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setEditForm({
      title: newsItem.title,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.content) {
      showNotification("Veuillez saisir un titre et un contenu pour l'actualité.", 'error');
      return;
    }
    try {
      const res = await updateNews(editingNews._id, editForm);
      setNews(news.map(n => n._id === editingNews._id ? res : n));
      setEditingNews(null);
      setEditForm({ title: '', content: '', imageUrl: '' });
      showNotification("Actualité modifiée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la modification de l'actualité :", err);
      showNotification(`Erreur lors de la modification: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingNews(null);
    setEditForm({ title: '', content: '', imageUrl: '' });
  };

  // Fonction pour demander confirmation de suppression
  const handleDeleteClick = (id) => {
    setNewsToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;
    
    try {
      await deleteNews(newsToDelete);
      setNews(news.filter(n => n._id !== newsToDelete));
      showNotification("Actualité supprimée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'actualité :", err);
      showNotification("Erreur lors de la suppression de l'actualité.", 'error');
    } finally {
      setShowDeleteConfirm(false);
      setNewsToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setNewsToDelete(null);
  };

  if (loading) {
    return (
      <div className="admin-main">
        <div className="loading-spinner"></div>
        <p>Chargement des actualités...</p>
      </div>
    );
  }

  if (error) {
    return <div className="admin-main error-message">{error}</div>;
  }

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {notification && (
        <div className={`toast-notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="toast-close">&times;</button>
        </div>
      )}

      {/* Header de la section */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            <span className="admin-icon">📰</span>
            Gestion des Actualités
          </h1>
          <p className="admin-subtitle">
            Créez, modifiez et publiez les actualités de votre entreprise
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        {loading && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Chargement des actualités...</p>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Formulaire d'ajout */}
            <div className="admin-form-section">
              <h2>Nouvelle actualité</h2>
              <form onSubmit={handleAdd} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newsTitle">Titre de l'actualité *</label>
                    <input 
                      type="text" 
                      id="newsTitle" 
                      name="title" 
                      value={newNews.title} 
                      onChange={handleChange} 
                      className="form-input"
                      placeholder="Entrez le titre de l'actualité"
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="newsContent">Contenu de l'actualité *</label>
                  <textarea 
                    id="newsContent" 
                    name="content" 
                    value={newNews.content} 
                    onChange={handleChange} 
                    className="form-textarea"
                    rows="6" 
                    placeholder="Rédigez le contenu de votre actualité..."
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <span className="btn-icon">➕</span>
                    Publier l'actualité
                  </button>
                </div>
              </form>
            </div>

            {/* Statistiques */}
            {news.length > 0 && (
              <div className="admin-stats">
                <div className="stat-card">
                  <div className="stat-number">{news.length}</div>
                  <div className="stat-label">Actualités totales</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {news.filter(n => 
                      isDateWithinDays(n, 30)
                    ).length}
                  </div>
                  <div className="stat-label">Ce mois</div>
                </div>
                {news.filter(n => n.imageUrl && n.imageUrl.trim() !== '').length > 0 && (
                  <div className="stat-card">
                    <div className="stat-number">
                      {news.filter(n => n.imageUrl && n.imageUrl.trim() !== '').length}
                    </div>
                    <div className="stat-label">Avec image</div>
                  </div>
                )}
                <div className="stat-card">
                  <div className="stat-number">
                    {Math.round(news.reduce((acc, n) => acc + n.content.length, 0) / news.length)}
                  </div>
                  <div className="stat-label">Mots moyens</div>
                </div>
              </div>
            )}

            {/* Liste des actualités */}
            {news.length === 0 ? (
              <div className="admin-empty">
                <div className="empty-icon">📰</div>
                <h3>Aucune actualité</h3>
                <p>Commencez par créer votre première actualité</p>
              </div>
            ) : (
              <div className="admin-grid">
                {news.map(n => (
                  <div key={n._id} className="admin-card news-card">
                    <div className="card-header">
                      <div className="news-status-badge" data-status="published">
                        Publié
                      </div>
                      <div className="card-actions">
                        <button onClick={() => handleEdit(n)} className="action-btn edit-btn">
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteClick(n._id)} className="action-btn delete-btn">
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {n.imageUrl && (
                      <div className="news-image-container">
                        <img 
                          src={n.imageUrl} 
                          alt="Actualité" 
                          className="news-image"
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src="https://placehold.co/300x200/7fcc72/ffffff?text=ENG+RND"; 
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="card-content">
                      <h3 className="news-title">{n.title}</h3>
                      
                      <div className="news-meta">
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span className="meta-text">
                            {formatDate(n.publishedAt)}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">📝</span>
                          <span className="meta-text">{n.content.length} caractères</span>
                        </div>
                      </div>

                      <div className="news-excerpt">
                        {n.content.length > 120 
                          ? `${n.content.substring(0, 120)}...` 
                          : n.content
                        }
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="footer-info">
                        <div className="footer-date">
                          <span>📅</span>
                          <span>Publié le {formatDate(n.publishedAt)}</span>
                        </div>
                        <div className="footer-status">
                          <span>📰</span>
                          <span className="status-active">Article publié</span>
                        </div>
                      </div>
                      <button onClick={() => handleEdit(n)} className="edit-link">
                        Modifier l'actualité
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de modification d'actualité */}
      {editingNews && (
        <div className="modal-overlay">
          <div className="modal-content news-modal">
            <button className="modal-close-btn" onClick={handleCancelEdit}>×</button>
            
            <div className="modal-header">
              <h3>Modifier l'actualité</h3>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} className="admin-form">
                <div className="form-group">
                  <label htmlFor="editTitle">Titre de l'actualité *</label>
                  <input 
                    type="text" 
                    id="editTitle" 
                    name="title" 
                    value={editForm.title} 
                    onChange={handleEditChange} 
                    className="form-input"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="editContent">Contenu de l'actualité *</label>
                  <textarea 
                    id="editContent" 
                    name="content" 
                    value={editForm.content} 
                    onChange={handleEditChange} 
                    className="form-textarea"
                    rows="8" 
                    required
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="save-button">
                    💾 Sauvegarder
                  </button>
                  <button type="button" onClick={handleCancelEdit} className="cancel-button">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
            </div>
            
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible.</p>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-buttons">
                <button 
                  className="delete-modal-button"
                  onClick={handleDelete}
                >
                  🗑️ Supprimer
                </button>
                <button className="cancel-modal-button" onClick={handleCancelDelete}>
                  ❌ Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}