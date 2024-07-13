// notices.js
import { convertToDateFormat } from "./utils.js";
import { url } from "./url.js";

export async function fetchNotices() {
	try {
		const response = await fetch(`${url}/files/notices`);
		if (!response.ok) {
			throw new Error("Failed to fetch notices");
		}
		const notices = await response.json();
		renderNotices(notices);
	} catch (error) {
		console.error("Error fetching notices:", error);
	}
}

export function renderNotices(noticeData) {
	const noticeContainer = document.querySelector(".notice-container");
	// noticeContainer.innerHTML = ""; // Clear existing notices
	const notices = noticeData?.data?.[0];
	notices.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

	notices.forEach((notice) => {
		const noticeCard = createNoticeCard(notice);
		noticeContainer.appendChild(noticeCard);
	});
}

function createNoticeCard(notice) {
	const card = document.createElement("div");
	card.classList.add("notice-card");

	const title = document.createElement("h3");
	title.textContent = notice.Name;
	card.appendChild(title);

	const description = document.createElement("p");
	description.classList.add("description");
	description.textContent = notice.Description;
	card.appendChild(description);

	const createdAt = document.createElement("p");
	createdAt.classList.add("created-at");
	createdAt.textContent = convertToDateFormat(notice.CreatedAt);
	card.appendChild(createdAt);

	const owner = document.createElement("p");
	owner.classList.add("owner");
	owner.textContent = notice.OwnerID;
	card.appendChild(owner);

	const viewLink = document.createElement("a");
	viewLink.textContent = "View File";
	viewLink.href = notice.URL;
	viewLink.target = "_blank";
	card.appendChild(viewLink);

	return card;
}
