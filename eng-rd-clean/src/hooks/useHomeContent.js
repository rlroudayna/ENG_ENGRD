import { useState, useEffect } from 'react';
import { publicClient } from '../utils/axiosConfig';

export const useHomeContent = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log('Fetching home content from API...');
        const response = await publicClient.get('/api/home-content');
        
        // Handle both old and new response formats
        const data = response.data.data || response.data;
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Format de données invalide');
        }
        
        const contentMap = {};
        data.forEach(item => {
          contentMap[item.section] = item.content;
        });
        
        console.log(`Successfully loaded ${Object.keys(contentMap).length} content sections`);
        setContent(contentMap);
      } catch (err) {
        console.error('Erreur lors du chargement du contenu:', err);
        setError(err.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Default content fallbacks
  const getContent = (section, defaultContent) => {
    return content[section] || defaultContent;
  };

  return { content, loading, error, getContent };
};