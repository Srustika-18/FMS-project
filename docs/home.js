// Assuming you have a function to convert date to a readable format
import { convertToDateFormat } from "./utils.js";
import { url } from "./url.js";

const noticeContainer = document.querySelector(".notice-container");

async function fetchNotices() {
	try {
		const response = await fetch(`${url}/files/notices`);
		if (!response.ok) {
			throw new Error("Failed to fetch notices");
		}
		const notices = await response.json();
		renderNotices(notices);
	} catch (error) {
		console.error("Error fetching notices:", error);
		// Optionally show an error message on the UI
	}
}

function renderNotices(noticeData) {
	// noticeContainer.innerHTML = ""; // Clear existing notices
	const notices = noticeData?.data?.[0];
	// Sort notices by createdAt date in descending order
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

// Fetch notices when the page loads
document.addEventListener("DOMContentLoaded", () => {
	fetchNotices();
});

const reviewContainer = document.querySelector(".reviews-container");

async function getReviews() {
	const res = await fetch("https://randomuser.me/api/?results=8");
	const data = await res.json();
	// console.log(data);
	for (const review of data.results) {
		let randomNumber = Math.floor(Math.random() * 5);
		reviewContainer.innerHTML += `<div class="review-card">
						<img src="${review.picture.thumbnail}" alt="User" />
						<h3>${review.name.first} ${review.name.last}</h3>
						<div class="stars">${"★".repeat(randomNumber)}${"☆".repeat(
			5 - randomNumber
		)}</div>
						<p>“Add review”</p>
					</div>`;
	}
}

getReviews();
