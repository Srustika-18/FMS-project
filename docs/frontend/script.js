document.addEventListener('DOMContentLoaded', async () => {
    const sidenav = document.getElementById('sidenav');
    const folderTableBody = document.querySelector('#folder-table tbody');
    const breadcrumb = document.getElementById('breadcrumb');

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
                loadFolderContents(folder._id, folder.name);
                return false; // Prevent default link behavior
            };
            sidenav.appendChild(folderLink);
        });
    }

    // Fetch and display folder contents
    async function loadFolderContents(folderId, folderName) {
        const response = await mockFetch(`/folders/${folderId}`);
        const folderContents = await response.json();
        folderTableBody.innerHTML = '';  // Clear existing contents

        // Update breadcrumb
        updateBreadcrumb(folderName);

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
                    loadFolderContents(item._id, item.name);
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

    // Function to update breadcrumb
    function updateBreadcrumb(folderName) {
        const breadcrumbNav = document.querySelector('#breadcrumb .nav-wrapper');
        const breadcrumbLinks = breadcrumbNav.querySelectorAll('.breadcrumb');

        // Remove existing breadcrumb items after "Root"
        for (let i = breadcrumbLinks.length - 1; i > 0; i--) {
            breadcrumbLinks[i].remove();
        }

        // Add new breadcrumb item for current folder
        const breadcrumbLink = document.createElement('a');
        breadcrumbLink.href = '#!';
        breadcrumbLink.textContent = folderName;
        breadcrumbLink.className = 'breadcrumb';
        breadcrumbNav.appendChild(breadcrumbLink);
    }

    await loadRootFolders();
});
