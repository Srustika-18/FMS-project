document.addEventListener('DOMContentLoaded', async () =>
{
	const sidenav = document.getElementById('sidenav');
	const folderTableBody = document.querySelector('#folder-table tbody');

	// Fetch and display root-level folders
	async function loadRootFolders()
	{
		const response = await fetch('/folders');  // Adjust the endpoint as needed
		const rootFolders = await response.json();
		rootFolders.forEach(folder =>
		{
			const folderLink = document.createElement('a');
			folderLink.textContent = folder.name;
			folderLink.href = '#';
			folderLink.className = 'collection-item';
			folderLink.onclick = () => loadFolderContents(folder._id);
			sidenav.appendChild(folderLink);
		});
	}

	// Fetch and display folder contents
	async function loadFolderContents(folderId)
	{
		const response = await fetch(`/folders/${ folderId }`);
		const folderContents = await response.json();
		folderTableBody.innerHTML = '';  // Clear existing contents
		folderContents.forEach(item =>
		{
			const row = document.createElement('tr');
			const nameCell = document.createElement('td');
			nameCell.textContent = item.name;
			row.appendChild(nameCell);

			const actionsCell = document.createElement('td');
			const openLink = document.createElement('a');
			openLink.href = '#';
			openLink.textContent = 'Open';
			openLink.className = 'btn-small';
			openLink.onclick = () => loadFolderContents(item._id);
			actionsCell.appendChild(openLink);
			row.appendChild(actionsCell);

			folderTableBody.appendChild(row);
		});
	}

	await loadRootFolders();
});
