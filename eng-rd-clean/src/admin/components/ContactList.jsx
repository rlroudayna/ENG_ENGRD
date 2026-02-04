// src/admin/components/ContactList.jsx
import { useEffect, useState } from 'react';
import { fetchMessages, deleteMessage } from '../../services/apiService';
import { formatDate, getMessageDate, isDateWithinDays } from '../../utils/dateUtils';
import './AdminStyles.css';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Limite de caractères pour l'aperçu du message
  const MESSAGE_PREVIEW_LIMIT = 100;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const messages = await fetchMessages();
        setContacts(Array.isArray(messages) ? messages : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
        setError("Impossible de charger les messages. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Fonction pour tronquer le message
  const truncateMessage = (message) => {
    if (message.length <= MESSAGE_PREVIEW_LIMIT) {
      return message;
    }
    return message.substring(0, MESSAGE_PREVIEW_LIMIT) + '...';
  };

  // Fonction pour afficher les détails du message
  const handleViewDetails = (contact) => {
    setSelectedMessage(contact);
    setShowModal(true);
  };

  // Fonction pour fermer la modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  // Fonction pour demander confirmation de suppression
  const handleDeleteClick = (id) => {
    setMessageToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Fonction pour supprimer un message
  const handleDelete = async () => {
    if (!messageToDelete) return;
    
    try {
      await deleteMessage(messageToDelete);
      setContacts(contacts.filter(contact => contact._id !== messageToDelete));
      
      // Créer une notification de succès
      const notification = document.createElement('div');
      notification.className = 'toast-notification';
      notification.innerHTML = `
        <span>✅ Message supprimé avec succès !</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 4000);
    } catch (err) {
      console.error("Erreur lors de la suppression du message :", err);
      
      // Créer une notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'toast-notification error';
      notification.innerHTML = `
        <span>❌ Erreur lors de la suppression du message</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 4000);
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  // Fonction pour annuler la suppression
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  if (loading) {
    return <div className="admin-main">Chargement des messages...</div>;
  }

  if (error) {
    return <div className="admin-main" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="admin-page">
      {/* Header de la section */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            <span className="admin-icon">💬</span>
            Gestion des Messages
          </h1>
          <p className="admin-subtitle">
            Consultez et gérez tous les messages de contact reçus via votre site web
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        {loading && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Chargement des messages...</p>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (!contacts || contacts.length === 0) && (
          <div className="admin-empty">
            <div className="empty-icon">📬</div>
            <h3>Aucun message</h3>
            <p>Les messages de contact apparaîtront ici lorsque des visiteurs vous contacteront</p>
          </div>
        )}

        {!loading && !error && contacts && contacts.length > 0 && (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-number">{contacts ? contacts.length : 0}</div>
                <div className="stat-label">Messages totaux</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {contacts ? contacts.filter(contact => contact.subject).length : 0}
                </div>
                <div className="stat-label">Avec sujet</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {contacts ? contacts.filter(contact => 
                    isDateWithinDays(contact, 7)
                  ).length : 0}
                </div>
                <div className="stat-label">Cette semaine</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {contacts ? contacts.filter(contact => 
                    isDateWithinDays(contact, 1)
                  ).length : 0}
                </div>
                <div className="stat-label">Aujourd'hui</div>
              </div>
            </div>

            <div className="admin-grid messages-grid">
              {contacts.map(contact => (
                <div key={contact._id} className="admin-card message-card">
                  <div className="card-header">
                    <div className="message-status-badge" data-status="new">
                      Nouveau
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleViewDetails(contact)} className="action-btn view-btn">
                        👁️
                      </button>
                      <a href={`mailto:${contact.email}`} className="action-btn reply-btn">
                        📧
                      </a>
                      <button onClick={() => handleDeleteClick(contact._id)} className="action-btn delete-btn">
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="sender-name">{contact.name}</h3>
                    
                    <div className="contact-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📧</span>
                        <span className="meta-text">{contact.email}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">
                          {getMessageDate(contact)}
                        </span>
                      </div>
                    </div>

                    {contact.subject && (
                      <div className="message-subject">
                        <span className="subject-icon">📋</span>
                        <span className="subject-text">{contact.subject}</span>
                      </div>
                    )}

                    <div className="message-preview">
                      <span className="message-icon">💬</span>
                      <span className="message-text">
                        {truncateMessage(contact.message)}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="footer-info">
                      <div className="footer-date">
                        <span>📅</span>
                        <span>Reçu le {getMessageDate(contact)}</span>
                      </div>
                      <div className="footer-status">
                        <span>✉️</span>
                        <span className="status-active">Message de contact</span>
                      </div>
                    </div>
                    <div className="footer-buttons">
                      <button onClick={() => handleViewDetails(contact)} className="edit-link">
                        Lire le message
                      </button>
                      <a href={`mailto:${contact.email}`} className="reply-link">
                        Répondre
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal pour afficher les détails complets du message */}
      {showModal && selectedMessage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content message-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h3>Message de contact</h3>
              <div className="sender-info">
                <h4>{selectedMessage.name}</h4>
                <span className="message-date">
                  Reçu le {getMessageDate(selectedMessage)}
                </span>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="info-section">
                <h5>Informations de contact</h5>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Nom :</strong> {selectedMessage.name}
                  </div>
                  <div className="info-item">
                    <strong>Email :</strong> 
                    <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                  </div>
                  <div className="info-item">
                    <strong>Sujet :</strong> {selectedMessage.subject || 'Aucun sujet'}
                  </div>
                  <div className="info-item">
                    <strong>Date :</strong> {getMessageDate(selectedMessage)}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h5>Message</h5>
                <div className="message-full">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-buttons">
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Votre message')}&body=${encodeURIComponent(`Bonjour ${selectedMessage.name},\n\nMerci pour votre message du ${getMessageDate(selectedMessage)}.\n\nCordialement,\nÉquipe ENG RND`)}`} 
                  className="save-button"
                  onClick={() => {
                    console.log('📧 Ouverture du client email pour:', selectedMessage.email);
                    console.log('📝 Sujet:', `Re: ${selectedMessage.subject || 'Votre message'}`);
                    // Fallback pour les navigateurs qui ne supportent pas mailto
                    setTimeout(() => {
                      // Créer une notification d'aide
                      const notification = document.createElement('div');
                      notification.className = 'toast-notification';
                      notification.innerHTML = `
                        <span>💡 Si votre client email ne s'est pas ouvert, utilisez le bouton "Copier l'email"</span>
                        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                      `;
                      document.body.appendChild(notification);
                      setTimeout(() => {
                        if (notification.parentElement) {
                          notification.remove();
                        }
                      }, 5000);
                    }, 1000);
                  }}
                >
                  📧 Répondre par email
                </a>
                
                <button 
                  className="save-button"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(selectedMessage.email);
                      // Créer une notification temporaire
                      const notification = document.createElement('div');
                      notification.className = 'toast-notification';
                      notification.innerHTML = `
                        <span>✅ Email copié: ${selectedMessage.email}</span>
                        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                      `;
                      document.body.appendChild(notification);
                      setTimeout(() => {
                        if (notification.parentElement) {
                          notification.remove();
                        }
                      }, 3000);
                    } catch (err) {
                      // Fallback pour les navigateurs plus anciens
                      const textArea = document.createElement('textarea');
                      textArea.value = selectedMessage.email;
                      textArea.style.position = 'fixed';
                      textArea.style.left = '-999999px';
                      textArea.style.top = '-999999px';
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      
                      try {
                        const successful = document.execCommand('copy');
                        if (successful) {
                          const notification = document.createElement('div');
                          notification.className = 'toast-notification';
                          notification.innerHTML = `
                            <span>✅ Email copié: ${selectedMessage.email}</span>
                            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                          `;
                          document.body.appendChild(notification);
                          setTimeout(() => {
                            if (notification.parentElement) {
                              notification.remove();
                            }
                          }, 3000);
                        }
                      } catch (fallbackErr) {
                        console.error('Impossible de copier:', fallbackErr);
                        // Créer un champ de texte visible pour copie manuelle
                        const notification = document.createElement('div');
                        notification.className = 'toast-notification';
                        notification.innerHTML = `
                          <span>📋 Copiez manuellement: ${selectedMessage.email}</span>
                          <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
                        `;
                        document.body.appendChild(notification);
                        setTimeout(() => {
                          if (notification.parentElement) {
                            notification.remove();
                          }
                        }, 8000);
                      }
                      
                      document.body.removeChild(textArea);
                    }
                  }}
                >
                  📋 Copier l'email
                </button>
              </div>
              
              <button className="cancel-button" onClick={closeModal}>
                Fermer
              </button>
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
              <p>Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.</p>
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