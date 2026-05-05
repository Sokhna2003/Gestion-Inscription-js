
import { elements } from './DOM/element.js';
import { saveEtudiants, loadEtudiants } from './Stores/etudiantStores.js';
import { openModal, closeModal } from './UI/modalRenderer.js';
import { getFormEtudiant, createEtudiant, resetForm, updateEtudiant } from './UI/etudiantRenderer.js';
import { showToast } from './UI/notification.js';
import { validateForm, showErrors, clearErrors } from './Utile/validateForm.js';
import { saveArchives, loadArchives } from './Stores/archiveStores.js';
import { renderArchives } from './UI/archiveRenderer.js';


// ID de l'etudiant en cours de modification
let editingId = null;
let archiveId = null; // Pour stocker l'ID de celui qu'on veut archiver

// au chargement on récupère ce qui est stocké ( ou un tableau vide si rien n'existe)
let listeEtudiants = loadEtudiants();

// OUVERTURE / FERMETURE MODAL AJOUT
elements.btnAddEtudiant.addEventListener('click', openModal);
elements.btnCloseModal.addEventListener('click', closeModal);

// Fermer si on clique en dehors du formulaire
window.addEventListener('click', (e) => {
    if (e.target === elements.modalEtudiant) {
        closeModal();
    }
});

// On parcourt la liste pour créer chaque ligne dans le tableau
// listeEtudiants.forEach(etu => {
//     createEtudiant(etu);
// });
refreshUI();

elements.formulaireEtu.addEventListener("submit", (event) => {
    event.preventDefault()

    // on recupere les donnees
    const nouvelEtudiant = getFormEtudiant()

    // on valide (On passe la liste pour vérifier les emails/tels déjà pris et l'ID actuel pour éviter les faux doublons)
    const erreurs = validateForm(nouvelEtudiant, listeEtudiants, editingId);

    // SI erreurs : on les affiche et on arrête tout
    if (Object.keys(erreurs).length > 0) {
        showErrors(erreurs);
        return;
    }
    // ON DÉCIDE : On ajoute ou on modifie ?
    if (editingId) {
        // Modification
        // On cherche ou se trouve l'étudiant dans notre liste JS grâce à son ID
        const index = listeEtudiants.findIndex(etu => etu.id == editingId)
        // On remplace ses anciennes infos par les nouvelles (on garde le même ID)
        listeEtudiants[index] = { ...nouvelEtudiant, id: Number(editingId), etat: true };
        showToast("Étudiant mis à jour !");
        editingId = null; // On oublie l'ID pour que le prochain clic soit un "Ajout"

    } else {
        // Ajout
        const nouvelEtu = { ...nouvelEtudiant, id: Date.now(), etat: true } // On crée un nouvel ID et son etat par defaut est true
        listeEtudiants.push(nouvelEtu); // On ajoute le nouvel étudiant à notre tableau local
        showToast("Étudiant ajouté avec succès !");
    }

    // On enregistre le tableau mis à jour dans le localStorage
    saveEtudiants(listeEtudiants);

    //  On vide le tableau HTML et on le recrée entièrement avec la liste à jour
    // elements.etudiantTable.innerHTML = "";
    // listeEtudiants.forEach(etu => createEtudiant(etu));
    saveEtudiants(listeEtudiants)
    refreshUI()

    // on ferme et on vide
    closeModal()
    resetForm()

})

elements.etudiantTable.addEventListener('click', (e) => {
    // Si on clique sur le bouton edit
    const btnEdit = e.target.closest('.btn-edit')
    // Si on clique sur le bouton delete
    const btnDelete = e.target.closest('.btn-delete')

    if (btnEdit) {
        // On récupère l'ID depuis la ligne (tr)
        const row = btnEdit.closest('tr')
        const id = Number(row.dataset.id)

        // On trouve l'étudiant dans notre liste
        const etudiant = listeEtudiants.find(etu => etu.id === id);

        if (etudiant) {
            editingId = id; // On mémorise qu'on modifie celui-là
            updateEtudiant(etudiant);      // la fonction qui remplit le formulaire
            openModal();                   // On ouvre la modale
        }
    }
    if (btnDelete) {
        const row = btnDelete.closest('tr');
        archiveId = Number(row.dataset.id);     //On mémorise l'ID
        // On ouvre le modal de confirmation
        elements.modalConfirmDelete.classList.remove('hidden');
    }
});

// Fermer le modal de confirmation au clic sur "Annuler"
elements.btnCancelDelete.addEventListener('click', () => {
    elements.modalConfirmDelete.classList.add('hidden');
    archiveId = null; // On réinitialise l'ID par sécurité
});

// Fermer si on clique en dehors du modal
window.addEventListener('click', (e) => {
    if (e.target === elements.modalConfirmDelete) {
        elements.modalConfirmDelete.classList.add('hidden');
        archiveId = null;
    }
});

// OUVRIR / FERMER LE DRAWER
elements.btnOpenArchives.addEventListener('click', () => {
    const archives = listeEtudiants.filter(etu => etu.etat === false); // On filtre en direct
    renderArchives(archives); 
    elements.drawerArchives.classList.remove('translate-x-full');
    elements.overlayArchives.classList.remove('hidden');
});

elements.btnCloseDrawer.addEventListener('click', () => {
    elements.drawerArchives.classList.add('translate-x-full');
    elements.overlayArchives.classList.add('hidden');
});

// LOGIQUE D'ARCHIVAGE
elements.btnConfirmDelete.addEventListener('click', () => {
        const etudiant = listeEtudiants.find(etu => etu.id === archiveId);
        if (etudiant) {
            etudiant.etat = false; // On change l'état
            saveEtudiants(listeEtudiants); // On enregistre la liste unique

            // On rafraîchit les deux affichages
            refreshUI();

            elements.modalConfirmDelete.classList.add('hidden');
            showToast("Étudiant archivé !");
        }

});

// RESTAURER DEPUIS LES ARCHIVES
document.getElementById('archiveList').addEventListener('click', (e) => {
    const btnRestore = e.target.closest('.btn-restore'); // On cherche le bouton
    if (btnRestore) {
        const id = Number(btnRestore.dataset.id); // ON RÉCUPÈRE L'ID ICI
        const etudiant = listeEtudiants.find(etu => etu.id === id);
        
        if (etudiant) {
            etudiant.etat = true; 
            saveEtudiants(listeEtudiants);
            refreshUI(); // Ça va vider et redessiner les deux côtés
            showToast("Étudiant restauré !");
        }
    }
});


// Fermer le drawer si on clique sur le fond sombre (l'overlay)
elements.overlayArchives.addEventListener('click', () => {
    // On fait repartir le drawer vers la droite
    elements.drawerArchives.classList.add('translate-x-full');
    // on cache le fond sombre
    elements.overlayArchives.classList.add('hidden');
});

function refreshUI() {
    // On vide les deux conteneurs
    elements.etudiantTable.innerHTML = "";
    
    // on affiche les actifs (etat === true) dans le tableau
    const actifs = listeEtudiants.filter(etu => etu.etat === true);
    actifs.forEach(etu => createEtudiant(etu));

    // on affiche les archivés (etat === false) dans le drawer
    const archives = listeEtudiants.filter(etu => etu.etat === false);
    renderArchives(archives); 
}

