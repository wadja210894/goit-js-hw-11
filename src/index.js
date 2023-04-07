import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchImages } from "./fetchImages";

const searchForm = document.getElementById('search-form');
const picturesContainer = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

console.log('testForScript');

let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', SearchFormHandler);

function SearchFormHandler(event) { 
    event.preventDefault();
    page = 1;
    query = event.currentTarget.elements.searchQuery.value.trim();
    picturesContainer.innerHTML = '';
    
    if (query === '') {
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
          simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
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
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
        })
        .join('');
    
   picturesContainer.insertAdjacentHTML('beforeend', createGalleryMarkup);
    
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
    