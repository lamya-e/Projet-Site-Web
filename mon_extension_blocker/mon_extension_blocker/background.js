// background.js

// ✅ 1. Quand l'extension est installée
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installée 🚀');
});

// ✅ 2. Fonction pour récupérer le token du localStorage du site
async function getTokenFromSite(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        return localStorage.getItem('token'); // 🔵 MOT à changer si ton site utilise une autre clé
      }
    }, (results) => {
      if (chrome.runtime.lastError || !results || !results[0]) {
        reject('Impossible de récupérer le token');
      } else {
        resolve(results[0].result);
      }
    });
  });
}

// ✅ 3. Fonction pour récupérer les plateformes de l'utilisateur depuis ton serveur
async function fetchUserPlatforms(token) {
  const response = await fetch('https://TON_SITE/api/platforms', { // 🔵 LIGNE 24 : Modifier TON_SITE par ton vrai domaine
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des plateformes');
  }

  const data = await response.json();
  return data; // tableau de plateformes
}

// ✅ 4. Fonction pour vérifier si aujourd'hui est un jour autorisé
function isTodayAllowed(allowedDays) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = daysOfWeek[new Date().getDay()];
  return allowedDays.includes(today);
}

// ✅ 5. Suivi du temps passé par plateforme
let usage = {}; // Stocke le temps d'utilisation par plateforme

// Fonction pour vérifier le temps passé et bloquer si nécessaire
function checkUsageAndBlock(tabId, platform) {
  const now = Date.now();
  
  // Si la plateforme est déjà suivie
  if (!usage[platform.url]) {
    usage[platform.url] = { minutesSpent: 0, lastChecked: now };
  }

  // Calcul du temps écoulé depuis la dernière vérification
  const elapsedMinutes = (now - usage[platform.url].lastChecked) / 60000; // Convertir en minutes
  usage[platform.url].minutesSpent += elapsedMinutes;
  usage[platform.url].lastChecked = now;

  console.log(`⏳ Temps passé sur ${platform.name}: ${usage[platform.url].minutesSpent.toFixed(2)} minutes`);

  // Vérifier si la durée maximale est dépassée
  if (usage[platform.url].minutesSpent >= platform.duration) {
    console.log(`🚫 Temps dépassé pour ${platform.name}`);
    chrome.tabs.update(tabId, { url: "https://TON_SITE/non-authorise.html" }); // 🔵 LIGNE 62 : Modifier TON_SITE par ton vrai domaine
  }
}

// ✅ 6. Fonction principale - surveille les onglets
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') { // seulement quand la page est complètement chargée
    try {
      // Récupérer le token de localStorage
      const token = await getTokenFromSite(tabId);
      const platforms = await fetchUserPlatforms(token);

      const currentUrl = tab.url;

      for (const platform of platforms) {
        if (currentUrl.includes(platform.url)) {
          // On est sur une plateforme suivie

          // Vérifier si aujourd'hui est autorisé
          if (!isTodayAllowed(platform.allowedDays)) {
            // Aujourd'hui n'est pas autorisé -> Bloquer
            chrome.tabs.update(tabId, { url: "https://TON_SITE/block.html" }); // 🔵 LIGNE 62 : Modifier TON_SITE par ton vrai domaine
            return;
          }

          // Vérifier le temps passé et bloquer si nécessaire
          checkUsageAndBlock(tabId, platform);

        }
      }
    } catch (error) {
      console.error('Erreur dans l\'extension :', error);
    }
  }
});
