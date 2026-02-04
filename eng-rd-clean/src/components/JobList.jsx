// src/components/JobList.jsx
import { useEffect, useState } from "react";
import { fetchJobs } from "../services/apiService";
import JobCard from "./JobCard";
import "./JobList.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", location: "", type: [], sector: "" });



  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await fetchJobs();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
      }
    };

    loadJobs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const updatedTypes = checked
        ? [...filters.type, value]
        : filters.type.filter(t => t !== value);
      setFilters(prev => ({ ...prev, type: updatedTypes }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const results = jobs.filter(job => {
      const keywordMatch = job.title.toLowerCase().includes(filters.keyword.toLowerCase());
      const locationMatch = job.location.toLowerCase().includes(filters.location.toLowerCase());
      const typeMatch = filters.type.length ? filters.type.includes(job.type) : true;
      const sectorMatch = filters.sector ? job.sector === filters.sector : true;
      return keywordMatch && locationMatch && typeMatch && sectorMatch;
    });
    setFilteredJobs(results);
  }, [filters, jobs]);

  return (
    <div className="joblist-container">
      <div className="filters">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Recherche</label>
            <input
              type="text"
              name="keyword"
              placeholder="Titre du poste, compétences..."
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Localisation</label>
            <input
              type="text"
              name="location"
              placeholder="Ville, région..."
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Secteur d'activité</label>
            <select name="sector" onChange={handleFilterChange} value={filters.sector} className="modern-select">
              <option value="">🌐 Tous les secteurs</option>
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
        </div>

        <div className="checkboxes">
          <div className="checkbox-group">
            <input type="checkbox" value="CDI" onChange={handleFilterChange} id="cdi" />
            <label htmlFor="cdi" className="checkbox-label">CDI</label>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" value="CDD" onChange={handleFilterChange} id="cdd" />
            <label htmlFor="cdd" className="checkbox-label">CDD</label>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" value="Freelance" onChange={handleFilterChange} id="freelance" />
            <label htmlFor="freelance" className="checkbox-label">Freelance</label>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" value="Stage" onChange={handleFilterChange} id="stage" />
            <label htmlFor="stage" className="checkbox-label">Stage</label>
          </div>
        </div>
      </div>

      <div className="job-cards">
        {filteredJobs.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
        {filteredJobs.length === 0 && (
          <div className="no-results">
            <h3>Aucune offre trouvée</h3>
            <p>Essayez de modifier vos critères de recherche pour voir plus d'offres.</p>
          </div>
        )}
      </div>
    </div>
  );
}
