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

let archiveId = null;

// OUVERTURE / FERMETURE
elements.btnAddEtudiant.addEventListener('click', openModal);
elements.btnCloseModal.addEventListener('click', closeModal);

// Fermer si on clique en dehors du formulaire
window.addEventListener('click', (e) => {
    if (e.target === elements.modalEtudiant) {
        closeModal();
    }
});

// On récupère ce qui est stocké (ou un tableau vide si rien n'existe)
let listeEtudiants = loadEtudiants();

// On parcourt la liste pour créer chaque ligne dans le tableau
listeEtudiants.forEach(etu => {
    createEtudiant(etu);
});

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
        listeEtudiants[index] = { ...nouvelEtudiant, id: Number(editingId) };
        showToast("Étudiant mis à jour !");
        editingId = null; // On oublie l'ID pour que le prochain clic soit un "Ajout"

    } else {
        // Ajout
        const nouvelEtu = { ...nouvelEtudiant, id: Date.now() } // On crée un nouvel ID
        listeEtudiants.push(nouvelEtu); // On ajoute le nouvel étudiant à notre tableau local
        showToast("Étudiant ajouté avec succès !");
    }

    // On enregistre le tableau mis à jour dans le localStorage
    saveEtudiants(listeEtudiants);

    //  On vide le tableau HTML et on le recrée entièrement avec la liste à jour
    elements.etudiantTable.innerHTML = "";
    listeEtudiants.forEach(etu => createEtudiant(etu));

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
    if (btndDelete) {
        const row = btnDelete.closest('tr');
        archiveId = Number(row.dataset.id);     //On mémorise l'ID
        // On ouvre le modal de confirmation
        elements.modalConfirmDelete.classList.remove('hidden');
    }
});

let archives = loadArchives();

// OUVRE LE DRAWER
elements.btnOpenArchives.addEventListener('click', () => {
    renderArchives(archives);
    document.getElementById("drawerArchives").classList.remove('translate-x-full');
    document.getElementById("overlayArchives").classList.remove('hidden');
});

// FERME LE DRAWER
const closeDrawer = () => {
    document.getElementById("drawerArchives").classList.add('translate-x-full');
    document.getElementById("overlayArchives").classList.add('hidden');
};
document.getElementById("btnCloseDrawer").addEventListener('click', closeDrawer);
document.getElementById("overlayArchives").addEventListener('click', closeDrawer);

// GESTION DES CHECKBOXES (Affiche le bouton si >= 3)
document.getElementById("archiveList").addEventListener('change', () => {
    const selected = document.querySelectorAll('.check-archive:checked');
    const footer = document.getElementById("footerDrawer");
    const countSpan = document.getElementById("countSelected");
    
    countSpan.textContent = selected.length;

    if (selected.length >= 3) {
        footer.classList.remove('hidden');
    } else {
        footer.classList.add('hidden');
    }
});


// Bouton Annuler du modal
elements.btnCancelDelete.addEventListener('click', () => {
    elements.modalConfirmDelete.classList.add('hidden');
    idAArchiver = null;
});
// Bouton Confirmer (Archiver) du modal
elements.btnConfirmDelete.addEventListener('click', () => {
    if (archiveId) {
        const etu = listeEtudiants.find(e => e.id === archiveId);
        
        if (etu) {
            // Ajouter aux archives
            archives.push(etu);
            saveArchives(archives);
          
            // Retirer de la liste principale
            listeEtudiants = listeEtudiants.filter(e => e.id !== archiveId);
            saveEtudiants(listeEtudiants);

            // Mettre à jour l'affichage
            elements.etudiantTable.innerHTML = "";
            listeEtudiants.forEach(et => createEtudiant(et));
            
            showToast("Étudiant archivé !", "success");
        }
    }
    // Fermer le modal
    elements.modalConfirmDelete.classList.add('hidden');
    archiveId = null;
});

