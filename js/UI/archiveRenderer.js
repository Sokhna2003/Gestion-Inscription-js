import { elements } from "../DOM/element.js";
import { formatDate } from "../Utile/dateFormater.js";

export function renderArchives(archives) {
    const container = document.getElementById("archiveList"); 
    container.innerHTML = "";

    if (archives.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-400 mt-10 italic">Aucun étudiant archivé</p>`;
        return;
    }

    archives.forEach(etu => {
        const row = `
            <div class="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" class="check-archive w-5 h-5 rounded border-orange-300 text-orange-500 focus:ring-orange-400" data-id="${etu.id}">
                    <div>
                        <p class="font-bold text-sm text-gray-800">${etu.nom} ${etu.prenom}</p>
                        <p class="text-[10px] text-gray-500">${etu.formation}</p>
                    </div>
                </div>
                <button class="btn-restore text-green-600 hover:scale-125 transition" data-id="${etu.id}">
                    <i class="fas fa-history"></i>
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', row);
    });
}
