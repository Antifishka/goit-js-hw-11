import axios from "axios";
    
export default class NewApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }
        
    async fetchImages() {
        const apiInstance = axios.create({
            baseURL: 'https://pixabay.com/api/',
            params: {
                key: '30037400-a9b9f26d9bfcaaa08a678cbf5',
                q: `${this.searchQuery}`,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',
                page: `${this.page}`,
                per_page: `${this.per_page}`,
            },
        });
        
        const { data } = await apiInstance.get();
        
        this.incrementPage();
        
        const images = data.hits;
        const totalHits = data.totalHits;
        const totalPages = totalHits / this.per_page;

        if (!images.length) {
            throw new Error(`Images not found...`)
        }
    
        return { images, totalHits, totalPages };

        // return fetch(url)
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error(response.status);
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     this.incrementPage();
        //     return data.hits;
        // }); 
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