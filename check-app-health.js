// Script de vérification de la santé de l'application
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function checkAppHealth() {
  console.log('🔍 Vérification de la santé de l\'application ENG R&D...\n');
  
  const tests = [
    {
      name: 'Backend - Serveur démarré',
      test: async () => {
        try {
          await axios.get(`${BASE_URL}/jobs`);
          return { success: true, message: 'Serveur backend accessible' };
        } catch (error) {
          return { success: false, message: 'Serveur backend non accessible' };
        }
      }
    },
    {
      name: 'API - Offres d\'emploi',
      test: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/jobs`);
          const jobs = response.data;
          return { 
            success: true, 
            message: `${jobs.length} offres d'emploi trouvées` 
          };
        } catch (error) {
          return { success: false, message: 'Erreur lors de la récupération des offres' };
        }
      }
    },
    {
      name: 'API - Actualités',
      test: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/news`);
          const news = response.data;
          return { 
            success: true, 
            message: `${news.length} actualités trouvées` 
          };
        } catch (error) {
          return { success: false, message: 'Erreur lors de la récupération des actualités' };
        }
      }
    },
    {
      name: 'API - Contenu de la page d\'accueil',
      test: async () => {
        try {
          const response = await axios.get(`${BASE_URL}/home-content`);
          const content = response.data;
          return { 
            success: true, 
            message: `${content.data ? content.data.length : content.length} sections de contenu trouvées` 
          };
        } catch (error) {
          return { success: false, message: 'Erreur lors de la récupération du contenu' };
        }
      }
    },
    {
      name: 'Test - Création d\'une offre',
      test: async () => {
        try {
          const testJob = {
            title: 'Test Job - Health Check',
            description: 'Ceci est un test automatique',
            location: 'Test City',
            type: 'CDI',
            sector: 'IT'
          };
          
          const response = await axios.post(`${BASE_URL}/jobs`, testJob);
          
          // Supprimer l'offre de test
          await axios.delete(`${BASE_URL}/jobs/${response.data._id}`);
          
          return { 
            success: true, 
            message: 'Création et suppression d\'offre réussies' 
          };
        } catch (error) {
          return { success: false, message: 'Erreur lors du test de création d\'offre' };
        }
      }
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.test();
      if (result.success) {
        console.log(`✅ ${test.name}: ${result.message}`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: ${result.message}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur inattendue - ${error.message}`);
    }
  }

  console.log(`\n📊 Résultat: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Toutes les vérifications sont passées ! L\'application est prête.');
  } else {
    console.log('⚠️  Certaines vérifications ont échoué. Vérifiez les erreurs ci-dessus.');
  }

  console.log('\n📋 Pages à tester manuellement:');
  console.log('- http://localhost:3000 (Page d\'accueil)');
  console.log('- http://localhost:3000/jobs (Offres d\'emploi)');
  console.log('- http://localhost:3000/news (Actualités)');
  console.log('- http://localhost:3000/contact (Contact)');
  console.log('- http://localhost:3000/admin/login (Administration)');
}

checkAppHealth();