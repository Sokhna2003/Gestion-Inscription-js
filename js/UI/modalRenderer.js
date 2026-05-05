// Ce fichier ne s'occupe que de l'affichage/masquage du modal

import { elements } from "../DOM/element.js";

// Ouvrir la modale
export function openModal() {
    elements.modalEtudiant.classList.remove('hidden');
};

// Fermer la modale
export function closeModal() {
    elements.modalEtudiant.classList.add('hidden');
};
