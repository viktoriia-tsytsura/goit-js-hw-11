import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const showMoreBtn = document.querySelector('.show-more');
const form = document.querySelector('.search-form');


searchForm.addEventListener('submit', onSearch);
showMoreBtn.addEventListener('click', onShowMore);

let gallery = new SimpleLightbox('.gallery a');


let currentPage = 1;

async function onSearch(e) {
    e.preventDefault();

    const searchQuery = form.elements.searchQuery.value;
    currentPage = 1;

    const data = await fetchData(searchQuery);
    galleryBox.innerHTML = '';
    showMoreBtn.hidden = true;

    if (data.totalHits === 0) {
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    
    }

    createMarkup(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    gallery.refresh();
    if (data.totalHits > 40) {
       
        showMoreBtn.hidden = false;
        
    }
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: -(cardHeight * 10),
        behavior: "smooth",
    });
}


function createMarkup(data) {
    const markup = data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card"> <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> 
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    })
    galleryBox.insertAdjacentHTML('beforeend', markup.join(''))   
}

async function fetchData(value, page = 1) {
    const url = `https://pixabay.com/api/`;
    const response = await axios({
        url,
        params: {
            key: '32720013-bdc30f746cb856c2fdee18335',
            q: value,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: page,
        },
    });
    return response.data;
}

async function onShowMore() {
    const searchQuery = form.elements.searchQuery.value;
    currentPage += 1;
    const dataAfterLoad = await fetchData(searchQuery, currentPage);

    createMarkup(dataAfterLoad.hits);

    gallery.refresh();

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });

    if (currentPage * 40 >= dataAfterLoad.totalHits) {
        showMoreBtn.hidden = true;
        return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
}
