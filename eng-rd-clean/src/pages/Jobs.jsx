// src/pages/Jobs.jsx
import React from "react";
import JobList from "../components/JobList";
import "./Jobs.css";

export default function Jobs() {
  return (
    <main className="jobs-page">
      <header className="jobs-header">
        <div className="jobs-header-content">
          <h1 className="jobs-title">
            Nos Offres d'<span className="title-highlight">emploi</span>
          </h1>
          <p className="jobs-subtitle">
            Découvrez les opportunités qui correspondent à votre profil et rejoignez notre équipe d'experts
          </p>
        </div>
      </header>
      <JobList />
    </main>
  );
}
