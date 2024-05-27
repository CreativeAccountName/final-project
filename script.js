(() => {
	const colorThief = new ColorThief();

	// Allows user to upload an image file into memory and display it.
	const imgInput = document.querySelector("#imgInput");
	let imgFile = "";
	const imgDisplay = document.querySelector("#imgDisplay");
	const image = document.querySelector("#image");
	let avgColor;
	let movieID;
	// Search bar and submit button to use with The Movie Database.
	const txtInput = document.querySelector("#txtInput");
	txtInput.value = null;
	const submitBtn = document.querySelector("#submitBtn");
	const txtError = document.querySelector("#txtError");
	const avgDiv = document.querySelector("#avgDiv");
	const searchError = document.querySelector("#searchError");

	// Parameters that let page use TMDB API.
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiM2QwMGI5MjBlMGMwN2Y3MDQ0ODY5Mjk5Y2RhYTMyZCIsInN1YiI6IjY2NGU2YzQzNTg1ZDU0NDNhMjYzOWNhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UwUGyGmzlLremEMBGwdiVH_6OY4Ms7ZS2iWQcRK9SIs",
		},
	};

	// gets poster url path, displays the poster, and sets the color of imgDisplay's border.
	const getPoster = async (id) => {
		try {
			const url = `https://api.themoviedb.org/3/movie/${id}/images`;
			const response = await axios(`${url}`, options);
			const results = response.data.posters[0].file_path;
			const imgPath = `https://image.tmdb.org/t/p/w500${results.toString()}`;

			return getColors(imgPath);
		} catch (err) {
			imgDisplay.textContent = `Poster Retrieval Error: ${err}`;
		}
	};

	// Function that sets a constant equal to the brightness level of the average color.
	const getBrightness = (array) => {
		const value =
			array.reduce((accum, iValue) => {
				return accum + iValue;
			}, 0) / 3;
		return value;
	};

	// Gets the average color of its target image using the Color Thief API.
	const getColors = async (imgSrc) => {
		image.crossOrigin = "anonymous";
		image.src = `${imgSrc}`;

		// If the image is loaded, the rest of the script executes. If not, the image is first loaded, and then the script executes.
		if (image.complete) {
			avgColor = colorThief.getColor(image, 6);
			const avg = avgColor.toString();
			imgDisplay.style.borderColor = `rgb(${avg})`;
			avgDiv.style.backgroundColor = `rgb(${avg})`;
			avgDiv.textContent = `Average Color Values: \n Red: ${avgColor[0]} | Green: ${avgColor[1]} | Blue: ${avgColor[2]}`;

			// Sets the Average Color Value's background and text colors.
			let brightness = getBrightness(avgColor);
			if (brightness <= 125) {
				avgDiv.style.color = "#FFFFFF";
			} else if (brightness >= 125) {
				avgDiv.style.color = "#000000";
			}
		} else {
			image.addEventListener("load", () => {
				avgColor = colorThief.getColor(image, 6);
				const avg = avgColor.toString();
				imgDisplay.style.borderColor = `rgb(${avg})`;
				avgDiv.style.backgroundColor = `rgb(${avg})`;
				avgDiv.textContent = `Average Color Values: \n Red: ${avgColor[0]} | Green: ${avgColor[1]} | Blue: ${avgColor[2]}`;

				// Sets the Average Color Value's background and text colors.
				let brightness = getBrightness(avgColor);
				if (brightness <= 125) {
					avgDiv.style.color = "#FFFFFF";
				} else if (brightness >= 125) {
					avgDiv.style.color = "#000000";
				}
				avgDiv.style.display = "flex";
			});
		}
	};

	// Prevents user from searching with an empty text field.
	const onError = () => {
		txtInput.classList.add("error");
		imgDisplay.classList.add("error");
		submitBtn.style.color = "#FF0000";
		txtError.hidden = false;
		submitBtn.disabled = true;
		return;
	};

	// If the user previously triggered onError, this will undo changes made by onError.
	const onFix = () => {
		txtInput.classList.remove("error");
		imgDisplay.classList.remove("error");
		submitBtn.style.color = "#FFFFFF";
		txtError.hidden = true;
		submitBtn.disabled = false;
		return;
	};

	// This disables the empty search field error.
	txtInput.addEventListener("input", () => {
		if (txtInput.value && txtInput.classList.contains("error")) {
			onFix();
		}
	});

	/* 	// When the user clicks submitBtn, it'll first check if the search input field is empty. If it is, then the user receives an error and cannot click the button until the field is populated. Afterward, the string is run through the .replace() method so that any spaces are altered to play nice as part of a URL. Then an async request is run using that new title string. If the request is successful, then the result will be hardcoded to response.data.results[0], or the first result in the response.
	
Note: This causes an issue where a poor search response may return a movie poster that's unrelated to the title search. */
	submitBtn.addEventListener("click", async () => {
		if (!txtInput.value) {
			onError();
			return;
		}
		if (!searchError.hidden) {
			searchError.hidden = true;
		}

		let title = txtInput.value;
		title = txtInput.value.replace(" ", "%20");
		const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false`;

		try {
			const response = await axios(`${url}`, options);
			const result = response.data.results[0];
			movieID = result.id.toString();

			return getPoster(movieID);
		} catch (err) {
			searchError.hidden = false;
			image.src = null;
			imgDisplay.style.borderColor = "#7a7b7a";
			searchError.textContent = `No search results for "${txtInput.value}" found`;
			avgDiv.style.display = "none";
			avg.style.backgroundColor = "#7a7b7a";
		}
	});

	// Event handler that creates a FileReader object from imgInput when the value of imgInput is changed. Then another event listener is triggered by the reader objects' 'load' event. Afterward, Then image.src is updated, and the reader.result property is sent through getColors. In this case, a synchronous call is made to the image through colorThief.
	imgInput.addEventListener("change", (e) => {
		if (!searchError.hidden) {
			searchError.hidden = true;
		}
		txtInput.value = null;
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			imgFile = reader.result;
			image.crossOrigin = "anonymous";
			image.src = `${imgFile}`;
			getColors(imgFile);
		});

		reader.readAsDataURL(e.target.files[0]);
	});
})();
