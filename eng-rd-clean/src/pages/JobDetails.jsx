import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;

  if (!job) {
    return (
      <div className="job-details-container">
        <div className="job-details-content">
          <div className="error-message">
            <h2>Offre introuvable</h2>
            <p>L'offre d'emploi que vous recherchez n'existe pas ou a été supprimée.</p>
            <button onClick={() => navigate('/jobs')} className="btn-back">
              Retour aux offres
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    navigate(`/apply/${job._id}`, { state: { job } });
  };

  return (
    <div className="job-details-container">
      <div className="job-details-content">
        {/* Header de l'offre */}
        <div className="job-header">
          <div className="job-header-content">
            <h1 className="job-title">{job.title}</h1>
            <div className="job-meta">
              <span className="job-meta-item">
                <i className="icon-briefcase"></i>
                {job.type}
              </span>
              <span className="job-meta-item">
                <i className="icon-location"></i>
                {job.location}
              </span>
              <span className="job-meta-item">
                <i className="icon-tag"></i>
                {job.sector}
              </span>
              {job.salary && (
                <span className="job-meta-item">
                  <i className="icon-money"></i>
                  {job.salary}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleApply} className="btn-apply">
            Postuler maintenant
          </button>
        </div>

        {/* Contenu principal */}
        <div className="job-main-content">
          <div className="job-content-left">
            {/* Description du poste */}
            <section className="job-section">
              <h2>Description du poste</h2>
              <div className="job-description" dangerouslySetInnerHTML={{ __html: job.description }} />
            </section>

            {/* Compétences requises */}
            {job.skills && job.skills.length > 0 && (
              <section className="job-section">
                <h2>Compétences requises</h2>
                <div className="skills-list">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Informations supplémentaires */}
            {(job.requirements || job.benefits) && (
              <section className="job-section">
                <h2>Informations supplémentaires</h2>
                {job.requirements && (
                  <div className="job-subsection">
                    <h3>Exigences</h3>
                    <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
                  </div>
                )}
                {job.benefits && (
                  <div className="job-subsection">
                    <h3>Avantages</h3>
                    <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="job-content-right">
            <div className="job-sidebar">
              <div className="job-info-card">
                <h3>Informations sur le poste</h3>
                <div className="info-item">
                  <strong>Type de contrat:</strong>
                  <span>{job.type}</span>
                </div>
                <div className="info-item">
                  <strong>Secteur:</strong>
                  <span>{job.sector}</span>
                </div>
                <div className="info-item">
                  <strong>Localisation:</strong>
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="info-item">
                    <strong>Salaire:</strong>
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="info-item">
                    <strong>Date limite:</strong>
                    <span>{job.deadline ? new Date(job.deadline).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
                  </div>
                )}
                <div className="info-item">
                  <strong>Publié le:</strong>
                  <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                </div>
              </div>

              <button onClick={handleApply} className="btn-apply-sidebar">
                Postuler à cette offre
              </button>

              <div className="job-actions">
                <button onClick={() => navigate('/jobs')} className="btn-back-jobs">
                  ← Retour aux offres
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
