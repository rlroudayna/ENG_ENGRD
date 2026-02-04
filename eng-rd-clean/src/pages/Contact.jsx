// src/pages/Contact.jsx
import React, { useState } from 'react';
import { sendMessage } from '../services/apiService';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ⭐ Vérification de la fonction handleChange :
  // Elle est correcte et met à jour l'état pour le champ correspondant.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est obligatoire';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'L\'objet est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire avant l'envoi
    if (!validateForm()) {
      setSubmitStatus('Veuillez corriger les erreurs ci-dessous');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('Envoi de votre message en cours...');
    setErrors({});

    try {
      const response = await sendMessage(formData);
      setSubmitStatus('Message envoyé avec succès ! Nous vous répondrons bientôt.');
      // Réinitialiser le formulaire
      setFormData({ name: '', email: '', subject: '', message: '' });
      console.log('Réponse du serveur:', response.data);
    } catch (error) {
      console.error('Erreur lors de l’envoi du message :', error.response ? error.response.data : error.message);
      setSubmitStatus(`Erreur lors de l’envoi. ${error.response && error.response.data.message ? error.response.data.message : 'Veuillez réessayer.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header de la page */}
      <header className="contact-header">
        <div className="contact-header-content">
          <h1 className="contact-title">
            Contactez-<span className="title-highlight">nous</span>
          </h1>
          <p className="contact-subtitle">
            Une question ? Une demande ? Nous sommes là pour vous aider et vous accompagner dans vos projets.
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="contact-container">
        <div className="contact-content">
          {/* Informations de contact */}
          <div className="contact-info">
            <h2>Nos coordonnées</h2>
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Adresse</h3>
                <p>49, Rue Jean Jaurès, Quartier Gauthier<br />Casablanca, Maroc</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>contact@eng-rnd.com</p>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="contact-form-section">
            <h2>Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Votre nom <span className="required">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    required 
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Votre email <span className="required">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required 
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">
                  Objet <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  placeholder="Sujet de votre message"
                  required
                />
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">
                  Votre message <span className="required">*</span>
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className={`form-textarea ${errors.message ? 'error' : ''}`}
                  rows="6" 
                  placeholder="Décrivez votre demande ou votre question..."
                  required
                ></textarea>
                {errors.message && <span className="error-text">{errors.message}</span>}
              </div>
              
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    📤 Envoyer le message
                  </>
                )}
              </button>
            </form>

            {submitStatus && (
              <div className={`status-message ${submitStatus.includes('succès') ? 'success' : 'error'}`}>
                {submitStatus.includes('succès') ? '✅' : '❌'} {submitStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;