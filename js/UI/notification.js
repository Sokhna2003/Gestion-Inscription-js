export function showToast(message, type = "success") {
    // Créer la div du toast
    const toast = document.createElement("div");
    
    // Lui donner le style Tailwind (on utilise du JS pour les classes)
    toast.className = `fixed top-5 right-5 flex items-center space-x-3 px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-500 translate-y-[-20px] opacity-0 z-50 text-white font-bold ${
        type === "success" ? "bg-green-500" : "bg-red-500"
    }`;

    // Ajouter le contenu (icône + message)
    toast.innerHTML = `
        <i class="${type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'} text-xl"></i>
        <span>${message}</span>
    `;

    // L'ajouter au document (dans le body)
    document.body.appendChild(toast);

    // Petit délai pour laisser le temps au navigateur de voir le changement et lancer l'animation
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-[-20px]');
        toast.classList.add('opacity-100', 'translate-y-0');
    }, 100);

    // Le faire disparaître et le supprimer du HTML après 3 secondes
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-[-20px]');
        
        // On attend la fin de l'animation (500ms) pour supprimer l'élément du DOM
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}
