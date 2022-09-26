import imagesTpl from './templates/images.hbs';
import NewApiService from "./news-service";
import LoadMoreBtn from './load-more-btn';
import axios from "axios";
import Notiflix from 'notiflix';

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
    // loadMoreBtn: document.querySelector('.load-more')
};

const newsApiService = new NewApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoagMoreBtn);

async function onSearch(e) {
    e.preventDefault();

    if (e.currentTarget.elements.searchQuery.value.trim() === '') {
        return console.warn('Field cannot be emply');
    };

    newsApiService.guery = e.currentTarget.elements.searchQuery.value;

    loadMoreBtn.show();
    loadMoreBtn.disable();
    newsApiService.resetPage();
    try {
        const images = await newsApiService.fetchImages();
        console.log(images);
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
        clearGalleryContainer();
        appendImagesMarkup(images);
        loadMoreBtn.enable();
    } catch (error) {
        onFetchError();
    };
}

async function onLoagMoreBtn() {
    loadMoreBtn.disable();
    try {
        const images = await newsApiService.fetchImages();
        const totalPages = images.totalPages;

        console.log(newsApiService.page);
        if (newsApiService.page > totalPages) {
            loadMoreBtn.hide();
            return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        }

        appendImagesMarkup(images);
        loadMoreBtn.enable();
    } catch (error) {
        onFetchError();
    };

    // newsApiService.fetchImages()
    //     .then(images => {
    //         console.log(images);
    //         appendImagesMarkup(images);
    //         loadMoreBtn.enable();
    //     })
    //     .catch(onFetchError);
}

function appendImagesMarkup({ images }) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function onFetchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}