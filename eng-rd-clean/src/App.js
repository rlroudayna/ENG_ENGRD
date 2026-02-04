// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Composants de mise en page
import Layout from "./components/Layout"; // Nouveau layout public
import AdminLayout from "./admin/components/AdminLayout"; // Layout admin

// Pages publiques
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Apply from "./pages/Apply";
import ApplyToOffer from "./pages/ApplyToOffer";
import Contact from "./pages/Contact";
import JobDetails from "./pages/JobDetails";
import Actualites from "./pages/Actualites";
import NewsDetail from "./pages/NewsDetail";

// Pages de l'espace administrateur
import AdminLogin from "./admin/Login";
import JobListAdmin from "./admin/components/JobListAdmin";
import ApplicationList from "./admin/components/ApplicationList";
import ContactList from "./admin/components/ContactList";
import NewsList from "./admin/components/NewsList";
import AddJobForm from "./admin/components/AddJobForm";
import EditJobForm from "./admin/components/EditJobForm";
import HomeContentEditor from "./admin/components/HomeContentEditor";

function App() {
  // Vérifier le type de build pour les déploiements séparés
  const isAdminBuild = process.env.REACT_APP_BUILD_TYPE === 'admin';
  const isPublicBuild = process.env.REACT_APP_BUILD_TYPE === 'public';

  // Build admin seulement (pour admin.eng-rnd.com)
  if (isAdminBuild) {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<JobListAdmin />} />
              <Route path="jobs" element={<JobListAdmin />} />
              <Route path="applications" element={<ApplicationList />} />
              <Route path="messages" element={<ContactList />} />
              <Route path="news" element={<NewsList />} />
              <Route path="home-content" element={<HomeContentEditor />} />
              <Route path="jobs/add" element={<AddJobForm />} />
              <Route path="jobs/edit/:id" element={<EditJobForm />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    );
  }

  // Build public seulement (pour eng-rnd.com)
  if (isPublicBuild) {
    return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="apply" element={<Apply />} />
              <Route path="apply/:id" element={<ApplyToOffer />} />
              <Route path="contact" element={<Contact />} />
              <Route path="jobs/:id" element={<JobDetails />} />
              <Route path="news" element={<Actualites />} />
              <Route path="news/:id" element={<NewsDetail />} />
            </Route>
            {/* Pas de routes admin dans le build public */}
          </Routes>
        </Router>
      </AuthProvider>
    );
  }

  // Build complet (développement)
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Les routes publiques */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="apply" element={<Apply />} />
            <Route path="apply/:id" element={<ApplyToOffer />} />
            <Route path="contact" element={<Contact />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="news" element={<Actualites />} />
            <Route path="news/:id" element={<NewsDetail />} />
          </Route>

          {/* La route de connexion à l'administration */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Les routes d'administration protégées */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Jobs par défaut */}
            <Route index element={<JobListAdmin />} /> 
            <Route path="jobs" element={<JobListAdmin />} />
            <Route path="applications" element={<ApplicationList />} />
            <Route path="messages" element={<ContactList />} />
            <Route path="news" element={<NewsList />} />
            <Route path="home-content" element={<HomeContentEditor />} />
            <Route path="jobs/add" element={<AddJobForm />} />
            <Route path="jobs/edit/:id" element={<EditJobForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;