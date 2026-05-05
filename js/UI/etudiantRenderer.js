import { elements } from "../DOM/element.js";
import {formatDate} from "../Utile/dateFormater.js"

// fonction qui recupere toutes les valeurs saisies
export function getFormEtudiant() {
    const etudiant = {
        id: Date.now(),
        nom: elements.nom.value,
        prenom: elements.prenom.value,
        email: elements.email.value,
        formation: elements.formation.value,
        adresse: elements.adresse.value,
        tel: elements.tel.value,
    };
    
    return etudiant;
};

// fonction ajout etudiant 
export function createEtudiant(etudiant) {
    // On crée la structure HTML de la ligne
    const row = `
        <tr data-id="${etudiant.id}" class="border-b border-orange-50 odd:bg-gray-50 hover:bg-orange-50 transition">
            <td class="p-3">${etudiant.nom}</td>
            <td class="p-3">${etudiant.prenom}</td>
            <td class="p-3 text-xs">${etudiant.email}</td>
            <td class="p-3 text-xs">${etudiant.formation}</td>
            <td class="p-3 text-xs">${etudiant.adresse}</td>
            <td class="p-3 text-xs">${etudiant.tel}</td>
            <td class="p-3 text-xs">${formatDate()}</td>
            <td class="p-3 flex justify-center space-x-3">
                <button class="btn-edit text-green-600 hover:scale-110"><i class="fas fa-edit"></i></button>
                <button class="btn-delete text-red-600 hover:scale-110"><i class="fas fa-trash-alt"></i></button>
                <button class="btn-view text-blue-600 hover:scale-110"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `;
    // On l'ajoute à la fin du tableau
    elements.etudiantTable.insertAdjacentHTML('beforeend', row);
}
// Fonction pour vider les champs après l'ajout
export function resetForm () {
    elements.formulaireEtu.reset();
    // On remet le bouton à son état initial
    elements.btnSubmitForm.textContent = "Ajout Etudiant";
    elements.btnSubmitForm.classList.remove("bg-green-600");
    elements.btnSubmitForm.classList.add("bg-[#ef6c33]");
};
// Modifier un etudiant
export function updateEtudiant(etudiant) {
    
    // Remplit le formulaire avec les anciens valeurs
    elements.nom.value = etudiant.nom
    elements.prenom.value = etudiant.prenom
    elements.email.value = etudiant.email
    elements.formation.value = etudiant.formation
    elements.adresse.value = etudiant.adresse
    elements.tel.value = etudiant.tel    

    // On change le texte du bouton de validation
    elements.btnSubmitForm.textContent = "Enregistrer modifications";
    elements.btnSubmitForm.classList.replace("bg-[#ef6c33]", "bg-green-600");
}

