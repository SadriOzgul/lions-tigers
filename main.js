let timer;
let deleteFirstPhotoDelay;

let images = [];
let currentPosition = 0;

async function start() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    createBreedList(data.message);
  } catch (e) {
    console.log("There was a problem here.", e);
  }
}

start();

function createBreedList(breedList) {
  document.getElementById("breed").innerHTML = `
    <select onchange="loadByBreed(this.value)">
      <option>Choose a dog breed</option>
      ${Object.keys(breedList)
        .map((breed) => `<option value="${breed}">${breed}</option>`)
        .join("")}
    </select>
  `;
}

async function loadByBreed(breed) {
  if (breed === "Choose a dog breed") return;

  const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
  const data = await response.json();
  createSlideShow(data.message);
}

function createSlideShow(imgArray) {
  images = imgArray;
  currentPosition = 0;

  clearInterval(timer);
  clearTimeout(deleteFirstPhotoDelay);

  const slideshow = document.getElementById("slideshow");
  slideshow.innerHTML = "";

  if (!images.length) return;

  // Put first slide
  addSlide(images[0], true);

  // If only 1 image, stop here
  if (images.length === 1) return;

  currentPosition = 1;
  timer = setInterval(nextSlide, 3000);
}

function addSlide(url, instant = false) {
  const slideshow = document.getElementById("slideshow");

  const newSlide = document.createElement("div");
  newSlide.className = "slide";
  newSlide.style.backgroundImage = `url('${url}')`;

  slideshow.appendChild(newSlide);

  if (instant) {
    newSlide.style.opacity = "1";
    return;
  }

  // Fade in the new slide
  requestAnimationFrame(() => {
    newSlide.style.opacity = "1";
  });

  // Fade out the old slide (the first .slide)
  const firstSlide = slideshow.querySelector(".slide");
  if (firstSlide && firstSlide !== newSlide) {
    firstSlide.style.opacity = "0";

    deleteFirstPhotoDelay = setTimeout(() => {
      if (firstSlide.parentNode) firstSlide.remove();
    }, 1000);
  }
}

function nextSlide() {
  addSlide(images[currentPosition]);

  if (currentPosition + 1 >= images.length) {
    currentPosition = 0;
  } else {
    currentPosition++;
  }
}
