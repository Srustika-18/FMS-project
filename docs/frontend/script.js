document.addEventListener('DOMContentLoaded', async () => {
    const sidenav = document.getElementById('sidenav');
    const folderTableBody = document.querySelector('#folder-table tbody');

    // Fetch and display root-level folders
    async function loadRootFolders() {
        const response = await mockFetch('/folders');
        const rootFolders = await response.json();
        rootFolders.forEach(folder => {
            const folderLink = document.createElement('a');
            folderLink.textContent = folder.name;
            folderLink.href = '#';
            folderLink.className = 'collection-item';
            folderLink.onclick = () => {
                loadFolderContents(folder._id);
                return false; // Prevent default link behavior
            };
            sidenav.appendChild(folderLink);
        });
    }

    // Fetch and display folder contents
    async function loadFolderContents(folderId) {
        const response = await mockFetch(`/folders/${folderId}`);
        const folderContents = await response.json();
        folderTableBody.innerHTML = '';  // Clear existing contents
        folderContents.forEach(item => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const actionsCell = document.createElement('td');
            const openLink = document.createElement('a');
            openLink.href = '#';
            openLink.textContent = 'Open';
            openLink.className = 'btn-small';
            openLink.onclick = () => {
                if (item.parent_folder_id !== undefined) {
                    loadFolderContents(item._id);
                } else {
                    alert(`File: ${item.name}`);
                }
                return false; // Prevent default link behavior
            };
            actionsCell.appendChild(openLink);
            row.appendChild(actionsCell);

            folderTableBody.appendChild(row);
        });
    }

    await loadRootFolders();
});
