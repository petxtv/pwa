const template = `<article>
  <img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg' alt='NAME' lazy='loading'>
  <h3>#POS. NAME</h3>
  <ul>
  <li><span>Author:</span> <strong>AUTHOR</strong></li>
  <li><span>Twitter:</span> <a href='https://twitter.com/TWITTER'>@TWITTER</a></li>
  <li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>
  <li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>
  <li><span>More:</span> <a href='http://js13kgames.com/entries/SLUG'>js13kgames.com/entries/SLUG</a></li>
  </ul>
</article>`;
let content = "";
for (let i = 0; i < games.length; i++) {
	let entry = template
		.replace(/POS/g, i + 1)
		.replace(/SLUG/g, games[i].slug)
		.replace(/NAME/g, games[i].name)
		.replace(/AUTHOR/g, games[i].author)
		.replace(/TWITTER/g, games[i].twitter)
		.replace(/WEBSITE/g, games[i].website)
		.replace(/GITHUB/g, games[i].github);
	entry = entry.replace("<a href='http:///'></a>", "-");
	content += entry;
}
document.getElementById("content").innerHTML = content;

(async function () {
	if ("serviceWorker" in navigator) {
		// await navigator.serviceWorker
		// 	.getRegistrations()
		// 	.then(function (registrations) {
		// 		for (let registration of registrations) {
		// 			registration.unregister();
		// 		}
		// 	});

		navigator.serviceWorker.register("./sw.js").then(
			registration => {
				console.log(
					"Service worker registration succeeded:",
					registration,
				);
			},
			/*catch*/ error => {
				console.error(`Service worker registration failed: ${error}`);
			},
		);
	} else {
		console.error("Service workers are not supported.");
	}
})();

// Get Device Location
const locationButton = document.getElementById("location-btn");
let watchPositionId;
const getPosition = pos => {
	console.log(pos.coords.latitude, pos.coords.longitude);
};
const getPositionError = err => {
	console.log(err);
};

const positionOptions = {
	enableHighAccuracy: true,
	maximumAge: 30000,
	timeout: 27000,
};

locationButton.addEventListener("click", () => {
	if ("geolocation" in navigator) {
		watchPositionId = navigator.geolocation.watchPosition(
			getPosition,
			getPositionError,
			positionOptions,
		);
	} else {
		locationText.innerText = "No Geolocation founded";
	}
});

//Get Device Notification
const notifiButton = document.getElementById("notifications");

notifiButton.addEventListener("click", () => {
	Notification.requestPermission().then(result => {
		console.log(result);
		if (result === "granted") {
			randomNotification();
		}
	});
});

function randomNotification() {
	const randomItem = Math.floor(Math.random() * games.length);
	const notifTitle = games[randomItem].name;
	const notifBody = `Created by ${games[randomItem].author}.`;
	const notifImg = `data/img/${games[randomItem].slug}.jpg`;
	const options = {
		body: notifBody,
		icon: notifImg,
	};
	new Notification(notifTitle, options);
	setTimeout(randomNotification, 30000);
}

//Get Device Orientation
const oText = document.querySelector("#o-text");
function handleOrientation(event) {
	const absolute = event.absolute;
	const alpha = event.alpha;
	const beta = event.beta;
	const gamma = event.gamma;

	// Do stuff with the new orientation data
	oText.innerHTML = `<div>${absolute}</div>
		<div>${alpha}</div>
		<div>${beta}</div>
		<div>${gamma}</div>
	`;
}

if (window.DeviceOrientationEvent) {
	window.addEventListener("deviceorientation", handleOrientation, false);
}

let imagesToLoad = document.querySelectorAll("img[data-src]");
const loadImages = image => {
	image.setAttribute("src", image.getAttribute("data-src"));
	image.onload = () => {
		image.removeAttribute("data-src");
	};
};

if ("IntersectionObserver" in window) {
	const observer = new IntersectionObserver((items, observer) => {
		items.forEach(item => {
			if (item.isIntersecting) {
				loadImages(item.target);
				observer.unobserve(item.target);
			}
		});
	});
	imagesToLoad.forEach(img => {
		observer.observe(img);
	});
} else {
	imagesToLoad.forEach(img => {
		loadImages(img);
	});
}
