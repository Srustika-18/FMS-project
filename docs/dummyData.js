// dummyData.js

const dummyFolders = [
	{ _id: "1", name: "Railway Board", parent_folder_id: null },
	{ _id: "2", name: "Policy", parent_folder_id: "1" },
	{ _id: "3", name: "2024", parent_folder_id: "2" },
	{ _id: "4", name: "SUBJECT 1", parent_folder_id: "3" },
	{ _id: "5", name: "SUBJECT 2", parent_folder_id: "3" },
	{ _id: "6", name: "2023", parent_folder_id: "2" },
	{ _id: "7", name: "SUBJECT 1", parent_folder_id: "6" },
	{ _id: "8", name: "Recruitment", parent_folder_id: "1" },
	{ _id: "9", name: "2024", parent_folder_id: "8" },
	{ _id: "10", name: "POST 1", parent_folder_id: "9" },

	{ _id: "11", name: "Accounts", parent_folder_id: null },
	{ _id: "12", name: "Policy", parent_folder_id: "11" },
	{ _id: "13", name: "2024", parent_folder_id: "12" },
	{ _id: "14", name: "SUBJECT 1", parent_folder_id: "13" },
	{ _id: "15", name: "SUBJECT 2", parent_folder_id: "13" },
	{ _id: "16", name: "2023", parent_folder_id: "12" },
	{ _id: "17", name: "SUBJECT 1", parent_folder_id: "16" },
	{ _id: "18", name: "Private", parent_folder_id: "11" },
	{ _id: "19", name: "2024", parent_folder_id: "18" },
	{ _id: "20", name: "POST 1", parent_folder_id: "19" },
	{ _id: "21", name: "POST 2", parent_folder_id: "19" },

	{ _id: "22", name: "Personnel", parent_folder_id: null },
	{ _id: "23", name: "Policy", parent_folder_id: "22" },
	{ _id: "24", name: "2024", parent_folder_id: "23" },
	{ _id: "25", name: "SUBJECT 1", parent_folder_id: "24" },
	{ _id: "26", name: "2023", parent_folder_id: "23" },
	{ _id: "27", name: "SUBJECT 1", parent_folder_id: "26" },
	{ _id: "28", name: "SUBJECT 2", parent_folder_id: "26" },
	{ _id: "29", name: "Recruitment", parent_folder_id: "22" },
	{ _id: "30", name: "2024", parent_folder_id: "29" },
	{ _id: "31", name: "POST 1", parent_folder_id: "30" },

	{ _id: "32", name: "S&T", parent_folder_id: null },
	{ _id: "33", name: "Policy", parent_folder_id: "32" },
	{ _id: "34", name: "2024", parent_folder_id: "33" },
	{ _id: "35", name: "SUBJECT 1", parent_folder_id: "34" },
	{ _id: "36", name: "Reports", parent_folder_id: "32" },
	{ _id: "37", name: "2024", parent_folder_id: "36" },
	{ _id: "38", name: "Report 1", parent_folder_id: "37" },

	{ _id: "39", name: "RPF", parent_folder_id: null },
	{ _id: "41", name: "2024", parent_folder_id: "40" },
	{ _id: "42", name: "SUBJECT 1", parent_folder_id: "41" },
	{ _id: "43", name: "2023", parent_folder_id: "40" },
	{ _id: "44", name: "SUBJECT 1", parent_folder_id: "43" },
	{ _id: "45", name: "Training", parent_folder_id: "39" },
	{ _id: "46", name: "2024", parent_folder_id: "45" },
	{ _id: "47", name: "Course 1", parent_folder_id: "46" },

	{ _id: "48", name: "COMMERCIAL", parent_folder_id: null },
	{ _id: "50", name: "2024", parent_folder_id: "49" },
	{ _id: "51", name: "SUBJECT 1", parent_folder_id: "50" },
	{ _id: "52", name: "Sales", parent_folder_id: "48" },
	{ _id: "53", name: "2024", parent_folder_id: "52" },
	{ _id: "54", name: "Sale 1", parent_folder_id: "53" },

	{ _id: "55", name: "OPERATING", parent_folder_id: null },
	{ _id: "57", name: "2024", parent_folder_id: "56" },
	{ _id: "58", name: "SUBJECT 1", parent_folder_id: "57" },
	{ _id: "59", name: "2023", parent_folder_id: "56" },
	{ _id: "60", name: "SUBJECT 1", parent_folder_id: "59" },
	{ _id: "61", name: "Procedures", parent_folder_id: "55" },
	{ _id: "62", name: "2024", parent_folder_id: "61" },
	{ _id: "63", name: "Procedure 1", parent_folder_id: "62" },

	{ _id: "64", name: "MECHANICAL", parent_folder_id: null },
	{ _id: "66", name: "2024", parent_folder_id: "65" },
	{ _id: "67", name: "SUBJECT 1", parent_folder_id: "66" },
	{ _id: "68", name: "Maintenance", parent_folder_id: "64" },
	{ _id: "69", name: "2024", parent_folder_id: "68" },
	{ _id: "70", name: "Task 1", parent_folder_id: "69" },
	{ _id: "71", name: "Task 2", parent_folder_id: "69" },
];

const dummyFiles = [
	{ _id: "1", name: "Doc 1", folder_id: "4", url: "http://example.com/railwayboard/policy/2024/subject1/doc1" },
	{ _id: "2", name: "Doc 2", folder_id: "4", url: "http://example.com/railwayboard/policy/2024/subject1/doc2" },
	{ _id: "3", name: "Doc 1", folder_id: "5", url: "http://example.com/railwayboard/policy/2024/subject2/doc1" },
	{ _id: "4", name: "Doc 1", folder_id: "7", url: "http://example.com/railwayboard/policy/2023/subject1/doc1" },
	{ _id: "5", name: "Doc 1", folder_id: "10", url: "http://example.com/railwayboard/recruitment/2024/post1/doc1" },
	{ _id: "6", name: "Doc 1", folder_id: "14", url: "http://example.com/accounts/policy/2024/subject1/doc1" },
	{ _id: "7", name: "Doc 2", folder_id: "14", url: "http://example.com/accounts/policy/2024/subject1/doc2" },
	{ _id: "8", name: "Doc 1", folder_id: "15", url: "http://example.com/accounts/policy/2024/subject2/doc1" },
	{ _id: "9", name: "Doc 1", folder_id: "17", url: "http://example.com/accounts/policy/2023/subject1/doc1" },
	{ _id: "10", name: "Doc 1", folder_id: "20", url: "http://example.com/accounts/recruitment/2024/post1/doc1" },
	{ _id: "11", name: "Doc 2", folder_id: "21", url: "http://example.com/accounts/recruitment/2024/post2/doc1" },
	{ _id: "12", name: "Doc 1", folder_id: "25", url: "http://example.com/personnel/policy/2024/subject1/doc1" },
	{ _id: "13", name: "Doc 1", folder_id: "27", url: "http://example.com/personnel/policy/2023/subject1/doc1" },
	{ _id: "14", name: "Doc 2", folder_id: "28", url: "http://example.com/personnel/policy/2023/subject2/doc1" },
	{ _id: "15", name: "Doc 1", folder_id: "31", url: "http://example.com/personnel/recruitment/2024/post1/doc1" },
	{ _id: "16", name: "Doc 1", folder_id: "35", url: "http://example.com/sandt/policy/2024/subject1/doc1" },
	{ _id: "17", name: "Doc 1", folder_id: "38", url: "http://example.com/sandt/reports/2024/report1/doc1" },
	{ _id: "18", name: "Doc 1", folder_id: "42", url: "http://example.com/rpf/policy/2024/subject1/doc1" },
	{ _id: "19", name: "Doc 2", folder_id: "42", url: "http://example.com/rpf/policy/2024/subject2/doc1" },
	{ _id: "20", name: "Doc 1", folder_id: "44", url: "http://example.com/rpf/policy/2023/subject1/doc1" },
	{ _id: "21", name: "Doc 1", folder_id: "47", url: "http://example.com/rpf/training/2024/course1/doc1" },
	{ _id: "22", name: "Doc 1", folder_id: "51", url: "http://example.com/commercial/policy/2024/subject1/doc1" },
	{ _id: "23", name: "Doc 1", folder_id: "54", url: "http://example.com/commercial/sales/2024/sale1/doc1" },
	{ _id: "24", name: "Doc 1", folder_id: "58", url: "http://example.com/operating/policy/2024/subject1/doc1" },
	{ _id: "25", name: "Doc 1", folder_id: "60", url: "http://example.com/operating/policy/2023/subject1/doc1" },
	{ _id: "26", name: "Doc 1", folder_id: "63", url: "http://example.com/operating/procedures/2024/procedure1/doc1" },
	{ _id: "27", name: "Doc 1", folder_id: "67", url: "http://example.com/mechanical/policy/2024/subject1/doc1" },
	{ _id: "28", name: "Doc 1", folder_id: "70", url: "http://example.com/mechanical/maintenance/2024/task1/doc1" },
	{ _id: "29", name: "Doc 2", folder_id: "71", url: "http://example.com/mechanical/maintenance/2024/task2/doc1" }
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
