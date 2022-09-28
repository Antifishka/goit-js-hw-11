export default class LoadMoreBtn {
    constructor({ selector, hidden = false }) {
        this.refs = this.getRefs(selector);

        hidden && this.hide();
    }

    getRefs(selector) {
        const refs = {};
        refs.button = document.querySelector(selector);
        refs.label = refs.button.querySelector('.label');

        return refs;
    }

    //кнопка активная
    enable() {
        this.refs.button.disabled = false;
        this.refs.label.textContent = 'Show more';
    }
    
    //кнопка неактивная
    disable() {
        this.refs.button.disabled = true;
        this.refs.label.textContent = 'Loading...';
    }

    //кнопку показать
    show() {
        this.refs.button.classList.remove('is-hidden');
    }

    //кнопку скрыть
    hide() {
        this.refs.button.classList.add('is-hidden'); 
    }
}