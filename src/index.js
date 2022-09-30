import imagesTpl from './templates/images.hbs';
import NewApiService from "./news-service";
// import LoadMoreBtn from './load-more-btn'; //если есть кнопка LOAD MORE
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel'),
};

const newsApiService = new NewApiService();
// const loadMoreBtn = new LoadMoreBtn({  //если есть кнопка LOAD MORE
//     selector: '.load-more',
//     hidden: true,
// });
let totalPages = null;

refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', onLoagMoreBtn); //если есть кнопка LOAD MORE

async function onSearch(e) {
    e.preventDefault();

    if (e.currentTarget.elements.searchQuery.value.trim() === '') {
        return console.warn('Field cannot be emply');
    };

    newsApiService.guery = e.currentTarget.elements.searchQuery.value;

    // loadMoreBtn.show();
    // loadMoreBtn.disable();
    newsApiService.resetPage();
    try {
        const images = await newsApiService.fetchImages();
        totalPages = images.totalPages;
        console.log(images);
        console.log(newsApiService.page);
        Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
        clearGalleryContainer();
        appendImagesMarkup(images);
        smoothPageScrolling();
        lightbox.refresh();
        // loadMoreBtn.enable();
    } catch (error) {
        onFetchError();
    };
    return totalPages;
}

// Логика работы кнопки LOAD MORE
// async function onLoagMoreBtn() {
//     loadMoreBtn.disable();
//     try {
//         const images = await newsApiService.fetchImages();
//         const totalPages = images.totalPages;

//         console.log(newsApiService.page);
//         if (newsApiService.page > (totalPages+1)) {
//             loadMoreBtn.hide();
//             return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
//         }

//         appendImagesMarkup(images);
//         smoothPageScrolling();
//         lightbox.refresh();
//         loadMoreBtn.enable();
//     } catch (error) {
//         onFetchError();
//     };
// }

function appendImagesMarkup({ images }) {
    refs.galleryContainer.insertAdjacentHTML('beforeend', imagesTpl(images));
}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function onFetchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

// Отображение бодьшой версии изображения с библиотекой SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
});

// Плавное прокручивание страницы
function smoothPageScrolling() {
   const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    }); 
}

// Бесконечный скрол
function onEntry(entries) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting && newsApiService.guery !== '') {
            console.log('Пора грузить еще картинки');
            newsApiService.incrementPage();
            
            if (newsApiService.page > (totalPages + 1)) {
                console.log('Закончились картинки');

                return Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
            };
            
            try {
                const images = await newsApiService.fetchImages();
                
                console.log(newsApiService.page);
                appendImagesMarkup(images);
                smoothPageScrolling();
                lightbox.refresh();
            } catch (error) {
                onFetchError();
            };
        };
    });
}

const options = {
    rootMargin: '200px',
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinel);