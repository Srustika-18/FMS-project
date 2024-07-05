// file.js

import { getCurrentFolderID, getCurrentFolderName, loadFolderContents } from './folder.js';

export const addFileModal = document.getElementById('addFileModal');

export function showAddFileModal()
{
	addFileModal.showModal();
}

export function hideAddFileModal()
{
	addFileModal.close();
	document.getElementById('newFileName').value = "";
}

export async function handleAddFile(e)
{
	e.preventDefault();
	const fileName = document.getElementById('newFileName');
	const file = fileName.files[0];

	const formData = new FormData();
	formData.append('file', file);
	formData.append('FolderID', getCurrentFolderID());

	try
	{
		const response = await fetch(`http://127.0.0.1:8000/files/?folder_id=${ getCurrentFolderID() }`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${ localStorage.getItem('authToken') }`,
			},
			body: formData
		});

		if (!response.ok)
		{
			throw new Error('File upload failed');
		}

		alert('File uploaded successfully');
		hideAddFileModal();
		await loadFolderContents(getCurrentFolderID(), getCurrentFolderName());
	} catch (error)
	{
		alert('File creation failed: ' + error.message + '\nTry logging out then logging in.');
	}
}
