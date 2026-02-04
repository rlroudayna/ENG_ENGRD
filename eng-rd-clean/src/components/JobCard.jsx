// src/components/JobCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job._id}`, { state: { job } });
  };

  const handleApply = () => {
    navigate(`/apply/${job._id}`, { state: { job } });
  };

  // Définir une couleur selon le type, avec l'ajout du CDD
  const getTypeColor = (type) => {
    switch (type) {
      case 'CDI':
        return '#7fcc72'; // Vert
      case 'CDD':
        return '#5b8de8'; // Bleu
      case 'Freelance':
        return '#ffb347'; // Orange
      case 'Stage':
        return '#5bc0de'; // Cyan
      default:
        return '#ccc'; // Gris par défaut
    }
  };



  return (
    <div className="job-card">
      <div className="job-type-badge" style={{ backgroundColor: getTypeColor(job.type) }}>
        {job.type}
      </div>

      <h3>{job.title}</h3>
      <p className="job-sector">{job.sector || 'Secteur non spécifié'}</p>
      <p className="job-location">{job.location}</p>

      <div className="job-card-buttons">
        <button onClick={handleViewDetails}>Voir plus</button>
        <button onClick={handleApply}>Postuler</button>
      </div>
    </div>
  );
};

export default JobCard;
