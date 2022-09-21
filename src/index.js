import NewApiService from "./news-service";
import axios from "axios";

const refs = {
    searchForm: document.querySelector('#search-form'),
    articesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
};

const newsApiService = new NewApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();

    newsApiService.guery = e.currentTarget.elements.searchQuery.value;
    newsApiService.resetPage();
    newsApiService.fetchImages().then(images => console.log(images));
}

function onLoadMore() {
    newsApiService.fetchImages().then(images => console.log(images));
}