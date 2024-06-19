categoriesContainer = document.querySelector("#categoriesContainer")

async function fetchData()
{
	const response = await fetch("dir.json");
	const data = await response.json();
	displayCategories(data);

}

function displayCategories(dataJson)
{
	console.log("🚀 ~ displayCategories ~ dataJson:", dataJson)
	console.log(Object.keys(dataJson));

	for (const dirname of Object.keys(dataJson))
	{
		categoriesContainer.innerHTML += navbarTemplate(dirname);
	}

}

function navbarTemplate(name)
{
	return `
	<a
	href="railway_board.html"
	class="category"
	style="background-color: #6a0dad"
	>
	${ name }
	</a>
`
}

fetchData();