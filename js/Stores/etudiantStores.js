
// fonction pour sauvegarder dans le localStorage
export function saveEtudiants(etudiants) {
    localStorage.setItem("ListesEtudiants", JSON.stringify(etudiants));
}

// Charger les etudiants au démarrage
export function loadEtudiants() {
    return JSON.parse(localStorage.getItem("ListesEtudiants")) || [];
}
