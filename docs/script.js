document.addEventListener("DOMContentLoaded", async () =>
{
	function showLoginModal()
	{
		const loginModal = document.getElementById('loginModal');
		loginModal.showModal();
	}

	function hideLoginModal()
	{
		const loginModal = document.getElementById('loginModal');
		loginModal.close();
	}

	document.getElementById('loginButton').addEventListener('click', showLoginModal);
	document.getElementById('closeModal').addEventListener('click', hideLoginModal);
	document.getElementById('loginModalContent').addEventListener('submit', handleLogin);

	let authToken = localStorage.getItem('authToken');
	let currentUsername = localStorage.getItem('currentUsername');
	let currentFolderID = "0";
	let currentFolderName = "";

	if (authToken && currentUsername)
	{
		replaceLoginWithLogout();
		await loadRootFolders();
		document.getElementById('addFolderButton').style.display = 'inline-block';
		document.getElementById('addFileButton').style.display = 'inline-block';
	} else
	{
		document.getElementById('addFolderButton').style.display = 'none';
		document.getElementById('addFileButton').style.display = 'none';
	}

	async function handleLogin(e)
	{
		e.preventDefault();
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		try
		{
			const response = await fetch('http://localhost:8000/admin/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					username: username,
					password: password
				})
			});

			if (!response.ok)
			{
				throw new Error('Login failed');
			}

			const data = await response.json();
			authToken = data.access_token;

			// Decode JWT to get the username
			const payload = JSON.parse(atob(authToken.split('.')[1]));
			currentUsername = payload.sub;

			// Save to localStorage
			localStorage.setItem('authToken', authToken);
			localStorage.setItem('currentUsername', currentUsername);

			hideLoginModal();
			await loadRootFolders();
			replaceLoginWithLogout();

			document.getElementById('addFolderButton').style.display = 'inline-block';
			document.getElementById('addFileButton').style.display = 'inline-block';
		} catch (error)
		{
			alert('Login failed: ' + error.message);
		}
	}

	function replaceLoginWithLogout()
	{
		const loginButton = document.getElementById('loginButton');
		loginButton.textContent = 'Log Out';
		loginButton.removeEventListener('click', showLoginModal);
		loginButton.addEventListener('click', handleLogout);
	}

	function handleLogout()
	{
		authToken = null;
		currentUsername = null;
		localStorage.removeItem('authToken');
		localStorage.removeItem('currentUsername');
		const loginButton = document.getElementById('loginButton');
		loginButton.textContent = 'Log In';
		loginButton.removeEventListener('click', handleLogout);
		loginButton.addEventListener('click', showLoginModal);
		document.getElementById('addFolderButton').style.display = 'none';
		document.getElementById('addFileButton').style.display = 'none';
		loadFolderContents(currentFolderID, currentFolderName); // Refresh folder contents
	}

	const sidenav = document.getElementById("sidenav");
	const folderTableBody = document.querySelector("#folder-table tbody");

	async function loadRootFolders()
	{
		try
		{
			const response = await fetch("http://127.0.0.1:8000/folders/0");
			const rootFolders = await response.json();
			sidenav.innerHTML = '';
			rootFolders.data[0].forEach((folder) =>
			{
				const folderLink = document.createElement("button");
				folderLink.textContent = folder.Name;
				folderLink.className = "collection-item";
				folderLink.onclick = () =>
				{
					loadFolderContents(folder.FolderID, folder.Name);
					currentFolderID = folder.FolderID;
					currentFolderName = folder.Name;
					return false;
				};
				sidenav.appendChild(folderLink);
				loadFolderContents(currentFolderID, currentFolderName);
			});
		} catch (error)
		{
			console.log("🚀 ~ error:", error)
			// alert('Error loading root folders: ' + error.message);
		}
	}

	async function handleDeleteFolder(folderId)
	{
		try
		{
			const response = await fetch(`http://127.0.0.1:8000/folders/${ folderId }`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${ authToken }`,
				},
			});

			if (!response.ok)
			{
				throw new Error('Folder deletion failed');
			}

			alert('Folder deleted successfully');
			await loadFolderContents(currentFolderID, currentFolderName);
		} catch (error)
		{
			alert('Folder deletion failed: ' + error.message + '\nTry logging out then logging in.');
		}
	}

	async function loadFolderContents(folderId, folderName)
	{
		try
		{
			const response = await fetch(`http://127.0.0.1:8000/folders/${ folderId }`);
			const folderContents = await response.json();
			folderTableBody.innerHTML = '';

			updateBreadcrumb(folderName);

			folderContents.data[0].forEach((item) =>
			{
				const row = document.createElement("tr");
				const nameCell = document.createElement("td");
				nameCell.textContent = item.Name;
				row.appendChild(nameCell);

				const actionsCell = document.createElement("td");
				const openLink = document.createElement("button");
				openLink.textContent = "Open";
				openLink.className = "btn-small";
				openLink.onclick = () =>
				{
					if (item.ParentfolderID !== undefined)
					{
						loadFolderContents(item.FolderID, item.Name);
						currentFolderID = item.FolderID;
						currentFolderName = item.Name;
					} else
					{
						window.open(`http://127.0.0.1:8000${ item.URL }`, '_blank');
					}
					return false;
				};
				actionsCell.appendChild(openLink);

				if (authToken)
				{  // Only show delete button if the user is authenticated
					const deleteButton = document.createElement("button");
					deleteButton.textContent = "Delete";
					deleteButton.className = "btn-small delete-btn";
					deleteButton.onclick = async () =>
					{
						await handleDeleteFolder(item.FolderID);
					};
					actionsCell.appendChild(deleteButton);
				}

				row.appendChild(actionsCell);
				folderTableBody.appendChild(row);
			});
		} catch (error)
		{
			alert('Error loading folder contents: ' + error.message);
		}
	}

	function updateBreadcrumb(folderName)
	{
		const breadcrumbNav = document.querySelector("#breadcrumb .nav-wrapper");
		const breadcrumbLinks = breadcrumbNav.querySelectorAll(".breadcrumb");

		for (let i = breadcrumbLinks.length - 1; i > 0; i--)
		{
			breadcrumbLinks[i].remove();
		}

		const breadcrumbLink = document.createElement("a");
		breadcrumbLink.href = "#!";
		breadcrumbLink.textContent = folderName;
		breadcrumbLink.className = "breadcrumb";
		breadcrumbNav.appendChild(breadcrumbLink);
	}

	const addFolderModal = document.getElementById('addFolderModal');

	function showAddFolderModal()
	{
		addFolderModal.showModal();
	}

	function hideAddFolderModal()
	{
		addFolderModal.close();
		document.getElementById('newFolderName').value = "";
	}

	async function handleAddFolder(e)
	{
		e.preventDefault();
		const folderName = document.getElementById('newFolderName').value;
		const parentFolderID = currentFolderID;
		const ownerID = currentUsername;

		try
		{
			const response = await fetch('http://localhost:8000/folders/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${ authToken }`,
				},
				body: JSON.stringify({
					Name: folderName,
					ParentfolderID: parentFolderID,
					OwnerID: ownerID
				})
			});

			if (!response.ok)
			{
				throw new Error('Folder creation failed');
			}

			hideAddFolderModal();
			await loadFolderContents(currentFolderID, currentFolderName);
		} catch (error)
		{
			alert('Folder creation failed: ' + error.message + '\nTry logging out then logging in.');
		}
	}


	const addFileModal = document.getElementById('addFileModal');

	function showAddFileModal()
	{
		addFileModal.showModal();
	}

	function hideAddFileModal()
	{
		addFileModal.close();
		document.getElementById('newFileName').value = "";
	}

	async function handleAddFile(e)
	{
		e.preventDefault();
		const fileName = document.getElementById('newFileName');
		const file = fileName.files[0];

		const formData = new FormData();
		formData.append('file', file);
		formData.append('FolderID', currentFolderID);

		try
		{
			const response = await fetch(`http://127.0.0.1:8000/files/?folder_id=${ currentFolderID }`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${ authToken }`,
				},
				body: formData
			});

			if (!response.ok)
			{
				throw new Error('File upload failed');
			}

			alert('File uploaded successfully');
			hideAddFileModal();
			await loadFolderContents(currentFolderID, currentFolderName);
		}
		catch (error)
		{
			alert('File creation failed: ' + error.message + '\nTry logging out then logging in.');
		}
	}

	document.getElementById('addFolderButton').addEventListener('click', showAddFolderModal);
	document.getElementById('addFileButton').addEventListener('click', showAddFileModal);
	document.getElementById('closeAddFolderModal').addEventListener('click', hideAddFolderModal);
	document.getElementById('closeAddFileModal').addEventListener('click', hideAddFileModal);
	document.getElementById('addFolderModalContent').addEventListener('submit', handleAddFolder);
	document.getElementById('addFileModalContent').addEventListener('submit', handleAddFile);

	await loadRootFolders();
});
