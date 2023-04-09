import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchImages } from "./fetchImages";

const searchForm = document.getElementById('search-form');
const picturesContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', searchFormHandler);
buttonLoadMore.addEventListener('click', loadMoreHandler);

buttonLoadMore.classList.add('hidden');

function searchFormHandler(event) { 
  event.preventDefault();
  page = 1;
  query = event.currentTarget.elements.searchQuery.value.trim();
  picturesContainer.innerHTML = '';
  buttonLoadMore.classList.remove('hidden')
    
  if (query === '') {
      buttonLoadMore.classList.add('hidden');
        Notiflix.Notify.failure(
            'The search string cannot be empty. Please specify your search query.',
        );
        return;
  }
    fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
          renderGallery(data.hits);
          SimpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error));  
};

function loadMoreHandler(event) {
  event.preventDefault();
  page += 1;  

  fetchImages(query, page, perPage)
    .then(data => {
      if (page > (data.totalHits / perPage) + 1) {
        buttonLoadMore.classList.add('hidden');
        Notiflix.Notify.failure(
          `We're sorry, but you've reached the end of search results.`,
        );
      } else {
          renderGallery(data.hits);
          SimpleLightBox = new SimpleLightbox('.gallery a').refresh();
      }
    })
    .catch(error => console.log(error));  
};

function renderGallery(imageItems) { 
const createGalleryMarkup  = imageItems
        .map(image => {
            const {
                id,
                largeImageURL,
                webformatURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            } = image;
            return `
        <a class="gallery_link" href="${largeImageURL}">
          <div class="photo-card" id="${id}">
            <img class="gallery-item_img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b><br/>${likes}</p>
              <p class="info-item"><b>Views</b><br/>${views}</p>
              <p class="info-item"><b>Comments</b><br/>${comments}</p>
              <p class="info-item"><b>Downloads</b><br/>${downloads}</p>
            </div>
          </div>
        </a>
      `;
        })
        .join('');
    
   picturesContainer.insertAdjacentHTML('beforeend', createGalleryMarkup);
};