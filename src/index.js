import imagesTpl from './templates/images.hbs'
import NewApiService from "./news-service";
import axios from "axios";
import Notiflix from 'notiflix';

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
};

const newsApiService = new NewApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();

    newsApiService.guery = e.currentTarget.elements.searchQuery.value;

    if (newsApiService.query === '') {
        return console.warn('Field cannot be emply');
    };

    newsApiService.resetPage();
    newsApiService.fetchImages()
        .then(images => {
            console.log(images);
            clearGalleryContainer();
            appendImagesMarkup(images);
        })
        .catch(onFetchError);
}

function onLoadMore() {
    newsApiService.fetchImages()
        .then(appendImagesMarkup);
}

function appendImagesMarkup(images) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function onFetchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}