import { loadFolderContents, handleDelete, setCurrentFolderID, setCurrentFolderName } from './folder.js';
import { convertToDateFormat } from "./utils.js";
import { url } from "./url.js";

const sortSelect = document.getElementById("sortSelect");

const updateDebounceText = debounce(async (text) => {
    await searchFoldersAndFiles(text);
});

export function searchText(e) {
    updateDebounceText(e.target.value);
}

function debounce(cb, delay = 1000) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb(...args);
        }, delay);
    };
}

export async function searchFoldersAndFiles(query) {
    try {
        const response = await fetch(`${url}/folders/search/?query=${query}`);
        const searchResults = await response.json();
        const folderTableBody = document.querySelector("#folder-table tbody");
        folderTableBody.innerHTML = '';

        if (query === "") {
            await loadFolderContents(0, "Root");
            return;
        }

        let items = [];

        searchResults.data[0].folders.forEach((item) => {
            items.push({
                ...item,
                type: "folder"
            });
        });

        searchResults.data[0].files.forEach((item) => {
            items.push({
                ...item,
                type: "file"
            });
        });

        const sortBy = sortSelect.value;
        if (sortBy === "name") {
            items.sort((a, b) => a.Name.localeCompare(b.Name));
        } else if (sortBy === "date") {
            items.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        }

        items.forEach((item) => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.textContent = `${item.Name} (${item.Path})`;
            row.appendChild(nameCell);

            const actionsCell = document.createElement("td");
            actionsCell.className = "action-container";
            const openLink = document.createElement("button");
            openLink.textContent = "Open";
            openLink.className = "btn-small";
            openLink.onclick = () => {
                if (item.type === "folder") {
                    loadFolderContents(item.FolderID, item.Name);
                    setCurrentFolderID(item.FolderID);
                    setCurrentFolderName(item.Name);
                } else {
                    window.open(`${url}${item.URL}`, '_blank');
                }
                return false;
            };
            actionsCell.appendChild(openLink);

            if (localStorage.getItem('authToken')) {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "btn-small delete-btn";
                deleteButton.setAttribute('data-id', item.FolderID || item.FileID);
                deleteButton.setAttribute('data-type', item.type);
                deleteButton.onclick = async () => {
                    await handleDelete(item.FolderID || item.FileID, item.type);
                };
                actionsCell.appendChild(deleteButton);
            }
            row.appendChild(actionsCell);

            const dateCell = document.createElement("td");
            dateCell.textContent = convertToDateFormat(item.CreatedAt);
            row.appendChild(dateCell);

            folderTableBody.appendChild(row);
        });
    } catch (error) {
        alert('Error searching folders and files: ' + error.message);
    }
}

// sortSelect.addEventListener("change", () => {
//     const query = document.getElementById("searchInput").value;
//     searchFoldersAndFiles(query);
// });
