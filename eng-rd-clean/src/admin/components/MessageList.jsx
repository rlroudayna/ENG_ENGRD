// src/admin/components/MessageList.jsx
import React, { useEffect, useState } from 'react';
import { fetchMessages, deleteMessage } from '../../services/apiService';
import './AdminStyles.css'; // Assurez-vous que ce fichier existe et contient les styles de la modale

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null); // ⭐ État pour la modale de détails

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await fetchMessages();
        setMessages(messages);
      } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
        setError("Impossible de charger les messages. Veuillez vérifier que le backend est lancé et que la base de données est accessible.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteMessage(id);
        setMessages(messages.filter(msg => msg._id !== id));
        alert("Message supprimé avec succès !");
      } catch (err) {
        console.error("Erreur lors de la suppression du message :", err);
        alert("Erreur lors de la suppression du message.");
      }
    }
  };

  // ⭐ Fonction pour ouvrir la modale de détails
  const handleViewDetails = (message) => {
    setSelectedMessage(message);
  };

  // ⭐ Fonction pour fermer la modale de détails
  const handleCloseDetails = () => {
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="admin-main">
        <div className="loading-spinner"></div>
        <p>Chargement des messages...</p>
      </div>
    );
  }

  if (error) {
    return <div className="admin-main error-message">{error}</div>;
  }

  return (
    <div className="admin-main">
      <h2>Gestion des Messages de Contact</h2>
      {messages.length === 0 ? (
        <p className="no-content-message">Aucun message disponible pour le moment.</p>
      ) : (
        <ul className="admin-list">
          {messages.map(msg => (
            <li key={msg._id}>
              {/* Conteneur pour le texte des messages */}
              <div className="list-text-content"> 
                <strong>De : {msg.name} ({msg.email})</strong>
                <p>Objet : {msg.subject || 'Aucun objet'}</p>
                {/* Affiche un extrait du message, le message complet sera dans la modale */}
                <p>Message : {msg.message.substring(0, 100)}...</p> 
                <p className="application-date">Reçu le : {new Date(msg.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              {/* Conteneur pour les boutons d'action */}
              <div className="list-action-buttons"> 
                {/* ⭐ Bouton "Voir détails" qui ouvre la modale */}
                <button onClick={() => handleViewDetails(msg)} className="view-details-btn">Voir détails</button>
                <button onClick={() => handleDelete(msg._id)} className="delete">Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ⭐ Modale de détails du message (s'affiche si selectedMessage n'est pas null) */}
      {selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Bouton de fermeture de la modale */}
            <button className="modal-close-btn" onClick={handleCloseDetails}>&times;</button>
            <h3>Détails du Message</h3>
            <p><strong>De :</strong> {selectedMessage.name}</p>
            <p><strong>Email :</strong> {selectedMessage.email}</p>
            <p><strong>Objet :</strong> {selectedMessage.subject || 'Aucun objet'}</p>
            <p><strong>Message :</strong> {selectedMessage.message}</p> {/* Message complet ici */}
            <p><strong>Reçu le :</strong> {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      )}
    </div>
  );
}