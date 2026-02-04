// src/pages/ApplyToOffer.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobById } from '../services/apiService';
import ApplicationForm from '../components/ApplicationForm';
import '../components/ApplicationForm.css';

const ApplyToOffer = () => {
  const { id: jobId } = useParams(); // Récupère l'ID de l'offre depuis l'URL (renommé en jobId)
  const [jobTitle, setJobTitle] = useState('...'); // État pour le titre de l'offre
  const [loadingJob, setLoadingJob] = useState(true); // État de chargement du titre de l'offre
  const [jobError, setJobError] = useState(null); // État d'erreur pour le titre de l'offre

  useEffect(() => {
    // ⭐ NOUVEAU : Message de débogage pour voir l'ID de l'offre
    console.log("ApplyToOffer: Tentative de chargement de l'offre avec l'ID:", jobId);

    const fetchJobDetails = async () => {
      try {
        // Vérifie si jobId est défini avant de faire l'appel API
        if (!jobId) {
          setJobError("ID de l'offre non fourni dans l'URL.");
          setLoadingJob(false);
          return; // Arrête la fonction si l'ID est manquant
        }
        
        const jobData = await fetchJobById(jobId);
        setJobTitle(jobData.title);
      } catch (err) {
        console.error("ApplyToOffer: Erreur lors de la récupération de l'offre :", err);
        // Message d'erreur plus spécifique en fonction de la réponse du serveur
        if (err.response) {
          // Le serveur a répondu avec un code d'état
          setJobError(`Erreur du serveur (${err.response.status}): ${err.response.data.message || 'Détails non disponibles.'}`);
        } else if (err.request) {
          // La requête a été faite mais aucune réponse n'a été reçue (serveur non démarré, problème réseau)
          setJobError("Impossible de se connecter au serveur backend. Vérifiez que le serveur est lancé (port 5000).");
        } else {
          // Autre chose s'est mal passée
          setJobError("Erreur inattendue lors de la récupération des détails de l'offre.");
        }
      } finally {
        setLoadingJob(false);
      }
    };
    
    fetchJobDetails();
  }, [jobId]); // S'exécute quand l'ID de l'offre change

  if (loadingJob) {
    return (
      <div className="apply-page">
        <div className="loading-container">
          <h2 className="loading-title">Chargement de l'offre...</h2>
          <p className="loading-message">Veuillez patienter pendant que nous récupérons les détails de l'offre.</p>
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="apply-page">
        <div className="error-container">
          <h2 className="error-title">Erreur</h2>
          <p className="error-message">{jobError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <ApplicationForm jobId={jobId} jobTitle={jobTitle} />
    </div>
  );
};

export default ApplyToOffer;