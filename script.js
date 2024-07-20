const imagesWrapper = document.querySelector(".images");
const loadMoreImagesBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const ligthBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = document.querySelector(".uil-import");

const apiKey = "UflDnIGlobFLmPAvE6J8eTEDrmBdP2eJEaM7F74H4yvdu1fhw9iwCv3v";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

const showlightbox = (name, img) => {
  ligthBox.querySelector("img").src = img;
  ligthBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  ligthBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightBox = () => {
  ligthBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showlightbox('${img.photographer}','${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"><i class="uil uil-import"></i></button>
        </div>
      </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  loadMoreImagesBtn.innerText = "Loading...";
  loadMoreImagesBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreImagesBtn.innerText = "Load More";
      loadMoreImagesBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    searchTerm = e.target.value;
    currentPage = 1;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);
loadMoreImagesBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
