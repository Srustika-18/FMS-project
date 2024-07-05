import { handleDeleteFile } from './file.js'

const sidenav = document.getElementById("sidenav");
const folderTableBody = document.querySelector("#folder-table tbody");
// let authToken = localStorage.getItem('authToken');
// let currentUsername = localStorage.getItem('currentUsername');

let currentFolderID = "0";
let currentFolderName = "";

export function getCurrentFolderID()
{
	return currentFolderID;
}

export function getCurrentFolderName()
{
	return currentFolderName;
}


export async function loadRootFolders()
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
		console.log("🚀 ~ error:", error);
		// alert('Error loading root folders: ' + error.message);
	}
}


export async function loadFolderContents(folderId, folderName)
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
			actionsCell.className = "action-container";
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

			if (localStorage.getItem('authToken'))
			{  // Only show delete button if the user is authenticated
				const deleteButton = document.createElement("button");
				deleteButton.textContent = "Delete";
				deleteButton.className = "btn-small delete-btn";
				deleteButton.setAttribute('data-id', item.FolderID || item.FileID);
				deleteButton.setAttribute('data-type', item.ParentfolderID !== undefined ? 'folder' : 'file');
				deleteButton.onclick = async () =>
				{
					await handleDelete(item.FileID || item.FolderID, item.ParentfolderID !== undefined ? 'folder' : 'file');
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

export function updateBreadcrumb(folderName)
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

export const addFolderModal = document.getElementById('addFolderModal');

export function showAddFolderModal()
{
	addFolderModal.showModal();
}

export function hideAddFolderModal()
{
	addFolderModal.close();
	document.getElementById('newFolderName').value = "";
}

export async function handleAddFolder(e)
{
	e.preventDefault();
	const folderName = document.getElementById('newFolderName').value;
	const parentFolderID = currentFolderID;
	const ownerID = localStorage.getItem('currentUsername');

	try
	{
		const response = await fetch('http://localhost:8000/folders/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${ localStorage.getItem('authToken') }`,
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

export async function handleDeleteFolder(folderId)
{
	try
	{
		const response = await fetch(`http://127.0.0.1:8000/folders/${ folderId }`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${ localStorage.getItem('authToken') }`,
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

async function handleDelete(id, type)
{
	if (type === 'folder')
	{
		await handleDeleteFolder(id);
	} else if (type === 'file')
	{
		await handleDeleteFile(id);
	}
}
