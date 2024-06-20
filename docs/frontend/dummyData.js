const dummyFolders = [
	{
		_id: "1",
		name: "Root Folder 1",
		parent_folder_id: null,
	},
	{
		_id: "2",
		name: "Root Folder 2",
		parent_folder_id: null,
	},
	{
		_id: "3",
		name: "Sub Folder 1.1",
		parent_folder_id: "1",
	},
	{
		_id: "4",
		name: "Sub Folder 1.2",
		parent_folder_id: "1",
	},
	{
		_id: "5",
		name: "Sub Folder 2.1",
		parent_folder_id: "2",
	},
	{
		_id: "6",
		name: "Sub Folder 2.1.1",
		parent_folder_id: "5",
	}
];

const dummyFiles = [
	{
		_id: "1",
		name: "File 1",
		folder_id: "1",
	},
	{
		_id: "2",
		name: "File 2",
		folder_id: "1",
	},
	{
		_id: "3",
		name: "File 3",
		folder_id: "2",
	}
];

async function mockFetch(url)
{
	if (url === '/folders')
	{
		return {
			json: async () => dummyFolders.filter(folder => !folder.parent_folder_id)
		};
	}

	const folderMatch = url.match(/\/folders\/(.+)/);
	if (folderMatch)
	{
		const folderId = folderMatch[1];
		return {
			json: async () => [
				...dummyFolders.filter(folder => folder.parent_folder_id === folderId),
				...dummyFiles.filter(file => file.folder_id === folderId)
			]
		};
	}

	throw new Error('Unknown endpoint');
}
