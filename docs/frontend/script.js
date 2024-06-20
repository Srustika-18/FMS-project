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
	document.getElementById('submitLogin').addEventListener('click', hideLoginModal);


	const sidenav = document.getElementById("sidenav");
	const folderTableBody = document.querySelector("#folder-table tbody");

	async function loadRootFolders()
	{
		const response = await mockFetch("/folders");
		const rootFolders = await response.json();
		rootFolders.forEach((folder) =>
		{
			const folderLink = document.createElement("button");
			folderLink.textContent = folder.name;
			folderLink.className = "collection-item";
			folderLink.onclick = () =>
			{
				loadFolderContents(folder._id, folder.name);
				return false;
			};
			sidenav.appendChild(folderLink);
		});
	}

	async function loadFolderContents(folderId, folderName)
	{
		const response = await mockFetch(`/folders/${ folderId }`);
		const folderContents = await response.json();
		folderTableBody.innerHTML = "";

		updateBreadcrumb(folderName);

		folderContents.forEach((item) =>
		{
			const row = document.createElement("tr");
			const nameCell = document.createElement("td");
			nameCell.textContent = item.name;
			row.appendChild(nameCell);

			const actionsCell = document.createElement("td");
			const openLink = document.createElement("button");
			openLink.textContent = "Open";
			openLink.className = "btn-small";
			openLink.onclick = () =>
			{
				if (item.parent_folder_id !== undefined)
				{
					loadFolderContents(item._id, item.name);
				} else
				{
					alert(`File: ${ item.name }`);
				}
				return false;
			};
			actionsCell.appendChild(openLink);
			row.appendChild(actionsCell);

			folderTableBody.appendChild(row);
		});
	}

	function updateBreadcrumb(folderName)
	{
		const breadcrumbNav = document.querySelector(
			"#breadcrumb .nav-wrapper"
		);
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

	await loadRootFolders();
});
