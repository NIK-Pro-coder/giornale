function updateFilter() {
	const input = document.getElementById("category");
	const news = document.getElementById("news");

	document.getElementById("content").value = "";

	let art = false;

	for (let i = 0; i < news.children.length; i++) {
		let me = news.children[i];
		console.log(me.children);
		let category = me.children[3].children[0].innerHTML;

		if (category.toLowerCase().startsWith(input.value.toLowerCase())) {
			me.hidden = false;
			art = true;
		} else {
			me.hidden = true;
		}
	}

	document.getElementById("noart").hidden = art;
}

function filterContent() {
	const input = document.getElementById("content");
	const news = document.getElementById("news");

	document.getElementById("category").value = "";

	let art = false;

	for (let i = 0; i < news.children.length; i++) {
		let me = news.children[i];
		console.log(me.children);
		let category = me.children[2].innerHTML;

		if (category.toLowerCase().includes(input.value.toLowerCase())) {
			me.hidden = false;
			art = true;
		} else {
			me.hidden = true;
		}
	}

	document.getElementById("noart").hidden = art;
}

async function main() {
	document.getElementById("noart").hidden = true;

	let given = await fetch("/news");
	let data = await given.json();

	document.getElementById("load").hidden = true;

	const news_div = document.getElementById("news");

	if (data.success == false) {
		news_div.innerHTML = `Cannot get news articles, reason: "${data.reason}"`;
		return;
	}

	const NEWS = data.news;

	for (let i = 0; i < NEWS.length; i++) {
		const n = NEWS[i];

		const details = document.createElement("details");
		details.innerHTML = `<blockquote><p>Summary:</p>${n.summary}</blockquote>`;

		details.innerHTML += `<a href="${n.url}">Article link</a>`;

		details.innerHTML += `<p>${n.text}</p>`;

		const summary = document.createElement("summary");

		if (n.category !== undefined) {
			summary.innerHTML += `<code>${n.category}</code>`;
		} else {
			summary.innerHTML += '<code class="hide">no category</code>';
		}

		summary.innerHTML += `<h3>${n.title}</h3>`;

		details.appendChild(summary);

		news_div.appendChild(details);
	}

	const input = document.getElementById("category");
	input.addEventListener("input", updateFilter);
	updateFilter();

	const content = document.getElementById("content");
	content.addEventListener("input", filterContent);
	filterContent();
}
