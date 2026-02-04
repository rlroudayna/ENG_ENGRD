// src/pages/Apply.jsx
import React from 'react';
import ApplicationForm from '../components/ApplicationForm';
import '../components/ApplicationForm.css';

const Apply = () => {
  return (
    <div className="apply-page">
      <ApplicationForm jobTitle="Candidature Spontanée" />
    </div>
  );
};

export default Apply;