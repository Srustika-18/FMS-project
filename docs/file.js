// file.js

import {
	getCurrentFolderID,
	getCurrentFolderName,
	loadFolderContents,
} from "./folder.js";
import { url } from "./url.js";

export const addFileModal = document.getElementById("addFileModal");

export function showAddFileModal() {
	addFileModal.showModal();
}

export function hideAddFileModal() {
	addFileModal.close();
	document.getElementById("newFileName").value = "";
}

export async function handleAddFile(e) {
	e.preventDefault();
	const fileName = document.getElementById("newFileName");
	const fileDescription = document.getElementById("newFileDescription");
	const file = fileName.files[0];
	const description = fileDescription?.value || "";

	const formData = new FormData();
	formData.append("file", file);
	formData.append("FolderID", getCurrentFolderID());
	formData.append("description", description);

	try {
		const response = await fetch(
			`${url}/files/?folder_id=${getCurrentFolderID()}&description=${description}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem(
						"authToken"
					)}`,
				},
				body: formData,
			}
		);

		if (!response.ok) {
			throw new Error("File upload failed");
		}

		alert("File uploaded successfully");
		hideAddFileModal();
		await loadFolderContents(getCurrentFolderID(), getCurrentFolderName());
	} catch (error) {
		alert(
			"File creation failed: " +
				error.message +
				"\nTry logging out then logging in."
		);
	}
}

export async function handleDeleteFile(fileId) {
	try {
		const response = await fetch(`${url}/files/${fileId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
		});

		if (!response.ok) {
			throw new Error("File deletion failed");
		}

		alert("File deleted successfully");
		await loadFolderContents(getCurrentFolderID(), getCurrentFolderName());
	} catch (error) {
		console.log("🚀 ~ error:", error);
		alert(
			"File deletion failed: " +
				error.message +
				"\nTry logging out then logging in."
		);
	}
}
