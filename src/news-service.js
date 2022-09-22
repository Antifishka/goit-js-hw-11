const API_KEY = '30037400-a9b9f26d9bfcaaa08a678cbf5';
const BASE_URL = 'https://pixabay.com/api/';
const options = {
            headers: {
                Authorization: '30037400-a9b9f26d9bfcaaa08a678cbf5',
            },
};
        
export default class NewApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
        
    fetchImages() {
        const url = `${BASE_URL}?key=30037400-a9b9f26d9bfcaaa08a678cbf5&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(data => {
                this.incrementPage();
                return data.hits;
            }); 
    } 

    incrementPage() {
        this.page += 1;
    }

    resetPage(){
        this.page = 1;
    }

    get guery() {
        return this.searchQuery;
    }

    set guery(newQuery) {
        this.searchQuery = newQuery;
    }  
}