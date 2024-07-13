import { handleDeleteFile } from "./file.js";
import { updateBreadcrumb, setCurrentview } from "./ui.js";
import { convertToDateFormat } from "./utils.js";
import { url } from "./url.js";

const sidenav = document.getElementById("sidenav");
const folderTableBody = document.querySelector("#folder-table tbody");
// let authToken = localStorage.getItem('authToken');
// let currentUsername = localStorage.getItem('currentUsername');

let currentFolderID = "0";
let currentFolderName = "Root";
let currentPage = 1;
const itemsPerPage = 10;
let folderHistory = [];

export function getCurrentFolderID() {
	return currentFolderID;
}
export function setCurrentFolderID(folderID) {
	currentFolderID = folderID;
}

export function getCurrentFolderName() {
	return currentFolderName;
}
export function setCurrentFolderName(folderName) {
	currentFolderName = folderName;
}

export function getCurrentFolderHistory() {
	return folderHistory;
}
export function setCurrentFolderHistory(history) {
	folderHistory = history;
}

function logDetails() {
	console.log("🚀 ~ currentFolderID:", currentFolderID);
	console.log("🚀 ~ currentFolderName:", currentFolderName);
	console.log("🚀 ~ folderHistory:", folderHistory);
}

export async function loadRootFolders() {
	try {
		const response = await fetch(`${url}/folders/0`);
		const rootFolders = await response.json();
		sidenav.innerHTML = "";
		rootFolders.data[0].forEach((folder) => {
			const folderLink = document.createElement("button");
			folderLink.textContent = folder.Name;
			folderLink.className = "sidenav-buttons";
			folderLink.setAttribute("data-folder-id", folder.FolderID);
			folderLink.onclick = () => {
				setCurrentview("folder");
				loadFolderContents(folder.FolderID, folder.Name);
				currentFolderID = folder.FolderID;
				currentFolderName = folder.Name;
				folderHistory = [{ id: "0", name: "Root" }]; // Clear history when at root
				updateBreadcrumb();
				return false;
			};
			sidenav.appendChild(folderLink);
		});
		// Add the "Create Root Folder" button at the end
		const createRootFolderButton = document.createElement("button");
		createRootFolderButton.id = "addRootFolderButton";
		createRootFolderButton.textContent = "+";
		createRootFolderButton.className = "btn-small";
		createRootFolderButton.onclick = showAddRootFolderModal;
		sidenav.appendChild(createRootFolderButton);

		loadFolderContents(currentFolderID, currentFolderName);
	} catch (error) {
		console.log("🚀 ~ error:", error);
		// alert('Error loading root folders: ' + error.message);
	}
}

function renderPaginationControls(totalItems) {
	const paginationContainer = document.querySelector(".pagination-container");
	paginationContainer.innerHTML = "";

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return; // No need for pagination if there is only one page

	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement("button");
		pageButton.textContent = i;
		pageButton.className = "pagination-button";
		pageButton.onclick = () => {
			currentPage = i;
			loadFolderContents(currentFolderID, currentFolderName);
		};
		if (i === currentPage) {
			pageButton.classList.add("active");
		}
		paginationContainer.appendChild(pageButton);
	}
}

export async function loadFolderContents(folderId, folderName) {
	try {
		const response = await fetch(`${url}/folders/${folderId}`);
		const folderContents = await response.json();
		folderTableBody.innerHTML = "";

		const items = folderContents.data[0];
		const totalItems = items.length;
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

		const paginatedItems = items.slice(startIndex, endIndex);

		updateBreadcrumb();

		if (folderId !== "0" && folderHistory.length > 0) {
			const parentRow = document.createElement("tr");
			const parentCell = document.createElement("td");
			parentCell.colSpan = 3;
			parentRow.appendChild(parentCell);

			const parentButton = document.createElement("button");
			parentButton.textContent = "Back";
			parentButton.className = "btn-small";
			parentButton.onclick = () => {
				const previousFolder = folderHistory.pop();
				loadFolderContents(previousFolder.id, previousFolder.name);
				currentFolderID = previousFolder.id;
				currentFolderName = previousFolder.name;
				currentPage = 1;
				updateBreadcrumb();
				return false;
			};
			parentCell.appendChild(parentButton);
			folderTableBody.appendChild(parentRow);
		}

		paginatedItems.forEach((item) => {
			const row = document.createElement("tr");
			const nameCell = document.createElement("td");
			nameCell.innerHTML = `${item.Name} ${
				item?.Description
					? ` <br> <p class="description"> (${item?.Description}) </p>`
					: ""
			}`;
			row.appendChild(nameCell);

			const actionsCell = document.createElement("td");
			actionsCell.className = "action-container";
			const openLink = document.createElement("button");
			openLink.textContent = "Open";
			openLink.className = "btn-small";
			openLink.onclick = () => {
				if (item.ParentfolderID !== undefined) {
					folderHistory.push({ id: folderId, name: folderName });
					loadFolderContents(item.FolderID, item.Name);
					currentFolderID = item.FolderID;
					currentFolderName = item.Name;
					updateBreadcrumb();
				} else {
					window.open(`${url}${item.URL}`, "_blank");
				}
				return false;
			};
			actionsCell.appendChild(openLink);

			if (localStorage.getItem("authToken")) {
				const deleteButton = document.createElement("button");
				deleteButton.textContent = "Delete";
				deleteButton.className = "btn-small delete-btn";
				deleteButton.setAttribute(
					"data-id",
					item.FolderID || item.FileID
				);
				deleteButton.setAttribute(
					"data-type",
					item.ParentfolderID !== undefined ? "folder" : "file"
				);
				deleteButton.onclick = async () => {
					await handleDelete(
						item.FileID || item.FolderID,
						item.ParentfolderID !== undefined ? "folder" : "file"
					);
				};
				actionsCell.appendChild(deleteButton);
			}
			row.appendChild(actionsCell);

			const dateCell = document.createElement("td");
			dateCell.textContent = convertToDateFormat(item.CreatedAt);
			row.appendChild(dateCell);

			folderTableBody.appendChild(row);
		});

		highlightCurrentFolder();
		renderPaginationControls(totalItems);
	} catch (error) {
		console.log("🚀 ~ error:", error);
		alert("Error loading folder contents: " + error.message);
	}
}

export const addFolderModal = document.getElementById("addFolderModal");

export function showAddFolderModal() {
	addFolderModal.showModal();
}

export function hideAddFolderModal() {
	addFolderModal.close();
	document.getElementById("newFolderName").value = "";
}

export async function handleAddFolder(e) {
	e.preventDefault();
	const folderName = document.getElementById("newFolderName").value;
	const parentFolderID = currentFolderID;
	const ownerID = localStorage.getItem("currentUsername");

	try {
		const response = await fetch("http://localhost:8000/folders/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
			body: JSON.stringify({
				Name: folderName,
				ParentfolderID: parentFolderID,
				OwnerID: ownerID,
			}),
		});

		if (!response.ok) {
			throw new Error("Folder creation failed");
		}

		hideAddFolderModal();
		await loadRootFolders();
		// await loadFolderContents(currentFolderID, currentFolderName);
	} catch (error) {
		alert(
			"Folder creation failed: " +
				error.message +
				"\nTry logging out then logging in."
		);
	}
}

export const addRootFolderModal = document.getElementById("addRootFolderModal");

export function showAddRootFolderModal() {
	addRootFolderModal.showModal();
}

export function hideAddRootFolderModal() {
	addRootFolderModal.close();
	document.getElementById("newRootFolderName").value = "";
}

export async function handleAddRootFolder(e) {
	e.preventDefault();
	const folderName = document.getElementById("newRootFolderName").value;
	const parentFolderID = "0";
	const ownerID = localStorage.getItem("currentUsername");

	try {
		const response = await fetch("http://localhost:8000/folders/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
			body: JSON.stringify({
				Name: folderName,
				ParentfolderID: parentFolderID,
				OwnerID: ownerID,
			}),
		});

		if (!response.ok) {
			throw new Error("Folder creation failed");
		}

		hideAddRootFolderModal();
		await loadRootFolders();
		// await loadFolderContents(currentFolderID, currentFolderName);
	} catch (error) {
		alert(
			"Folder creation failed: " +
				error.message +
				"\nTry logging out then logging in."
		);
	}
}

export async function handleDeleteFolder(folderId) {
	try {
		const response = await fetch(`${url}/folders/${folderId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		if (!response.ok) {
			throw new Error("Folder deletion failed");
		}

		alert("Folder deleted successfully");
		await loadRootFolders();
		// await loadFolderContents(currentFolderID, currentFolderName);
	} catch (error) {
		alert(
			"Folder deletion failed: " +
				error.message +
				"\nTry logging out then logging in."
		);
	}
}

export async function handleDelete(id, type) {
	if (type === "folder") {
		await handleDeleteFolder(id);
	} else if (type === "file") {
		await handleDeleteFile(id);
	}
}

function highlightCurrentFolder() {
	const folderLinks = sidenav.querySelectorAll(".sidenav-buttons");
	folderLinks.forEach((link) => {
		link.classList.remove("folder-active");
		if (
			link.getAttribute("data-folder-id") == currentFolderID ||
			link.getAttribute("data-folder-id") == folderHistory?.[1]?.id
		) {
			link.classList.add("folder-active");
		}
	});
}
