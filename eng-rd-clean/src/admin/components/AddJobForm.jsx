// src/admin/components/AddJobForm.jsx
import { useState } from 'react';
import { createJob } from '../../services/apiService';
import './AdminStyles.css';

export default function AddJobForm() {
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: '',
    sector: '',
    description: '',
    salary: '',
    skills: '',
    deadline: ''
  });
  const [message, setMessage] = useState(''); // État pour le message de confirmation



  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(skill => skill.trim()) : []
      };
      await createJob(jobData);
      setMessage('Offre ajoutée avec succès !');
      setForm({
        title: '',
        location: '',
        type: '',
        sector: '',
        description: '',
        salary: '',
        skills: '',
        deadline: ''
      }); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'offre:", error);
      setMessage("Erreur lors de l'ajout de l'offre.");
    }
  };

  return (
    <div className="admin-main">
      <h2>Ajouter une offre</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Titre du poste *</label>
          <input
            name="title"
            placeholder="Ex: Ingénieur Logiciel Embarqué"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Secteur *</label>
            <select name="sector" value={form.sector} onChange={handleChange} required className="modern-select">
              <option value="">🌐 Sélectionner un secteur</option>
              <option value="Automobile">🚗 Automobile</option>
              <option value="Aéronautique">✈️ Aéronautique</option>
              <option value="Ferroviaire">🚄 Ferroviaire</option>
              <option value="Spatial">🚀 Spatial</option>
              <option value="Militaire">🛡️ Militaire</option>
              <option value="Énergie">⚡ Énergie</option>
              <option value="Santé">🏥 Santé</option>
              <option value="IT">💻 IT</option>
              <option value="RH">👥 Ressources Humaines</option>
              <option value="Marketing">📈 Marketing</option>
              <option value="Finance">💰 Finance</option>
              <option value="Commercial">🤝 Commercial</option>
              <option value="Communication">📢 Communication</option>
              <option value="Juridique">⚖️ Juridique</option>
              <option value="Qualité">✅ Qualité</option>
              <option value="Logistique">📦 Logistique</option>
              <option value="Production">🏭 Production</option>
              <option value="R&D">🔬 Recherche & Développement</option>
              <option value="Consulting">💼 Conseil</option>
              <option value="Formation">🎓 Formation</option>
            </select>
          </div>

          <div className="form-group">
            <label>Type de contrat *</label>
            <select name="type" value={form.type} onChange={handleChange} required className="modern-select">
              <option value="">📋 Sélectionner un type</option>
              <option value="CDI">📝 CDI</option>
              <option value="CDD">📄 CDD</option>
              <option value="Freelance">💼 Freelance</option>
              <option value="Stage">🎓 Stage</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Localisation *</label>
            <input
              name="location"
              placeholder="Ex: Casablanca, Maroc"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Salaire</label>
            <input
              name="salary"
              placeholder="Ex: Selon profil"
              value={form.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Compétences requises</label>
          <input
            name="skills"
            placeholder="Ex: JavaScript, React, Node.js (séparées par des virgules)"
            value={form.skills}
            onChange={handleChange}
          />
          <small>Séparez les compétences par des virgules</small>
        </div>

        <div className="form-group">
          <label>Date limite de candidature</label>
          <input
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description du poste *</label>
          <textarea
            name="description"
            placeholder="Décrivez le poste, les missions, les responsabilités..."
            value={form.description}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Ajouter l'offre
          </button>
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
            Annuler
          </button>
        </div>
      </form>
      {message && (
        <div className="message-box">
          <p>{message}</p>
          <button onClick={() => setMessage('')}>Fermer</button>
        </div>
      )}
    </div>
  );
}
