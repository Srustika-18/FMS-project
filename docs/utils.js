export function convertToDateFormat(inputDateString)
{
	// Create a Date object
	const date = new Date(inputDateString);

	// Extract day, month, year, and formatted time
	const day = date.getUTCDate();
	const month = date.toLocaleString("en-US", {
		month: "short",
	});
	const year = date.getUTCFullYear().toString().slice(-2);
	const time = date.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	const formattedDate = `${ day } ${ month } '${ year } at ${ time }`;
	return formattedDate;
}