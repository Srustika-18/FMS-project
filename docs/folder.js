import { handleDeleteFile } from './file.js'

const sidenav = document.getElementById("sidenav");
const folderTableBody = document.querySelector("#folder-table tbody");
// let authToken = localStorage.getItem('authToken');
// let currentUsername = localStorage.getItem('currentUsername');

let currentFolderID = "0";
let currentFolderName = "Root";
let folderHistory = [];

export function getCurrentFolderID()
{
	return currentFolderID;
}

export function getCurrentFolderName()
{
	return currentFolderName;
}

function logDetails()
{
	console.log("🚀 ~ currentFolderID:", currentFolderID)
	console.log("🚀 ~ currentFolderName:", currentFolderName)
	console.log("🚀 ~ folderHistory:", folderHistory)

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
				folderHistory = [{ id: "0", name: "Root" }]; // Clear history when at root
				updateBreadcrumb();
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

		updateBreadcrumb();

		// Add "Parent Folder" button row if not at the root level
		if (folderId !== "0" && folderHistory.length > 0)
		{
			const parentRow = document.createElement("tr");
			const parentCell = document.createElement("td");
			parentCell.colSpan = 2;

			const parentButton = document.createElement("button");
			parentButton.textContent = "Go to Parent Folder";
			parentButton.className = "btn-small";
			parentButton.onclick = () =>
			{
				const previousFolder = folderHistory.pop();
				loadFolderContents(previousFolder.id, previousFolder.name);
				currentFolderID = previousFolder.id;
				currentFolderName = previousFolder.name;
				updateBreadcrumb();
				return false;
			};
			parentCell.appendChild(parentButton);
			parentRow.appendChild(parentCell);
			folderTableBody.appendChild(parentRow);
		}

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
					folderHistory.push({ id: folderId, name: folderName }); // Push current folder to history
					loadFolderContents(item.FolderID, item.Name);
					currentFolderID = item.FolderID;
					currentFolderName = item.Name;
					updateBreadcrumb();
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

			const dateCell = document.createElement("td");
			dateCell.textContent = convertToDateFormat(item.CreatedAt);
			row.appendChild(dateCell);

			folderTableBody.appendChild(row);
		});
	} catch (error)
	{
		alert('Error loading folder contents: ' + error.message);
	}
}

export function updateBreadcrumb()
{
	const breadcrumbNav = document.querySelector("#breadcrumb .nav-wrapper");
	breadcrumbNav.innerHTML = ''; // Clear existing breadcrumbs

	// Add root breadcrumb
	// const rootBreadcrumb = document.createElement("p");
	// // rootBreadcrumb.href = "#!";
	// rootBreadcrumb.textContent = "Root";
	// rootBreadcrumb.className = "breadcrumb";
	// rootBreadcrumb.onclick = () =>
	// {
	// 	loadFolderContents("0", "Root");
	// 	currentFolderID = "0";
	// 	currentFolderName = "Root";
	// 	folderHistory = [];
	// 	return false;
	// };
	// breadcrumbNav.appendChild(rootBreadcrumb);

	// Add breadcrumbs for each folder in history
	folderHistory.forEach((folder, index) =>
	{
		const breadcrumbLink = document.createElement("p");
		// breadcrumbLink.href = "#!";
		breadcrumbLink.textContent = folder.name;
		breadcrumbLink.className = "breadcrumb";
		breadcrumbLink.onclick = () =>
		{
			loadFolderContents(folder.id, folder.name);
			currentFolderID = folder.id;
			currentFolderName = folder.name;
			folderHistory = folderHistory.slice(0, index); // Remove folders after this one
			updateBreadcrumb();
			return false;
		};
		breadcrumbNav.appendChild(breadcrumbLink);
	});

	// Add current folder to breadcrumb
	if (currentFolderID !== "0")
	{
		const currentBreadcrumb = document.createElement("p");
		// currentBreadcrumb.href = "#!";
		currentBreadcrumb.textContent = currentFolderName;
		currentBreadcrumb.className = "breadcrumb";
		breadcrumbNav.appendChild(currentBreadcrumb);
	}
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
		await loadRootFolders();
		// await loadFolderContents(currentFolderID, currentFolderName);
	} catch (error)
	{
		alert('Folder deletion failed: ' + error.message + '\nTry logging out then logging in.');
	}
}

export async function handleDelete(id, type)
{
	if (type === 'folder')
	{
		await handleDeleteFolder(id);
	} else if (type === 'file')
	{
		await handleDeleteFile(id);
	}
}

function convertToDateFormat(inputDateString)
{
	// Create a Date object
	const date = new Date(inputDateString);

	// Extract day, month, year, and formatted time
	const day = date.getUTCDate();
	const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
	const year = date.getUTCFullYear().toString().slice(-2);
	const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC' });
	const formattedDate = `${ day } ${ month } '${ year } at ${ time }`;
	return formattedDate;
}