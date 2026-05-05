
export function saveArchives(archives) {
    localStorage.setItem("ArchivesEtudiants", JSON.stringify(archives));
}

export function loadArchives() {
    return JSON.parse(localStorage.getItem("ArchivesEtudiants")) || [];
}
