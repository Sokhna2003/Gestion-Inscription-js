import { getFormEtudiant } from "../UI/etudiantRenderer.js";

const PHONE_REGEX = /^(((\+221|00221)?(70|71|75|76|77|78)\d{7})|((\+220|00220)?[235679]\d{6}))$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmailTaken = (email, currentId, usersList) => {
    return usersList.some(user =>
        user.email.toLowerCase() === email.trim().toLowerCase() && user.id !== currentId
    );
};
const isContactTaken = (tel, currentId, usersList) => {
    return usersList.some(user =>
        user.tel.replace(/\s/g, "") === tel.trim().replace(/\s/g, "") && user.id !== currentId
    );
};

export function validateForm(data, usersList, currentId = null) {
    const errors = {};

    if (!data.prenom.trim())
        errors.prenom = "Le prénom est requis.";

    if (!data.nom.trim())
        errors.nom = "Le nom est requis.";

    if (!data.email.trim())
        errors.email = "L'email est requis.";
    else if (!EMAIL_REGEX.test(data.email.trim()))
        errors.email = "Format invalide. Ex: nom@domaine.com";
    else if (isEmailTaken(data.email, currentId, usersList)) { // Appel de la fonction
        errors.email = "Cet email appartient déjà à quelqu'un.";
    }
    if (!data.tel.trim())
        errors.tel = "Le numéro est requis.";
    else if (!PHONE_REGEX.test(data.tel.trim().replace(/\s/g, "")))
        errors.tel = "Format invalide (Sénégal +221 ou Gambie +220 requis).";
    else if (isContactTaken(data.tel, currentId, usersList)) { // Appel de la fonction
        errors.tel = "Ce numéro appartient déjà à quelqu'un.";
    }

    if (!data.adresse.trim())
        errors.adresse = "L'adresse est requise.";

    if (!data.formation)
        errors.formation = "Veuillez choisir une formation.";

    // if (!data.select_niveau)
    //     errors.select_niveau = "Veuillez choisir un niveau.";
    // if (!data.select_filiere)
    //     errors.select_filiere = "Veuillez choisir une filiere.";

    return errors;
}

export function showErrors(errors) {
    clearErrors();
    const fields = ["nom", "prenom", "email", "formation", "adresse", "tel"];
    fields.forEach((f) => {
        const errEtu = document.getElementById(`${f}Error`);
        const inputEtu = document.getElementById(f);
        if (errors[f]) {
            errEtu.textContent = errors[f];
            errEtu.classList.remove("hidden");
            if (inputEtu) {
                inputEtu.classList.add("border-red-500", "bg-red-50");
                inputEtu.classList.remove("border-gray-300", "focus:ring-orange-400");
            }

        }
    });
    // Focus le premier champ en erreur
    const first = fields.find((f) => errors[f]);
    if (first) document.getElementById(first).focus();
}

export function clearErrors() {
    const fields = ["nom", "prenom", "email", "formation", "adresse", "tel"];
    fields.forEach((f) => {
        const errEtu = document.getElementById(`${f}Error`);
        const inputEtu = document.getElementById(f);
        if (errEtu) {
            errEtu.textContent = "";
            errEtu.classList.add("hidden"); // On cache le span
        }
        if (inputEtu) {
            // On remet le style normal de ton HTML
            inputEtu.classList.remove("border-red-500", "bg-red-50");
            inputEtu.classList.add("border-gray-300", "focus:ring-orange-400");
        }
    
    });
}

// Effacer l'erreur au focus
["nom", "prenom", "email", "formation", "adresse", "tel"].forEach((f) => {
    const input = document.getElementById(f);
    if (input) {
        input.addEventListener("input", () => {
            const errEtu = document.getElementById(`${f}Error`);
            if (errEtu) {
                errEtu.textContent = "";
                errEtu.classList.add("hidden");
            }
            input.classList.remove("border-red-500", "bg-red-50");
            input.classList.add("border-gray-300");
        });
    }
});
