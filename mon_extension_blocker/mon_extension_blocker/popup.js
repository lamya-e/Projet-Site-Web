document.addEventListener("DOMContentLoaded", () => {
    const platforms = {
      "www.youtube.com": 3600,
      "www.facebook.com": 1800
    };
  
    const list = document.getElementById("platformList");
    Object.keys(platforms).forEach(site => {
      const li = document.createElement("li");
      li.textContent = `${site} - ${platforms[site] / 60} min/jour`;
      list.appendChild(li);
    });
  });
  