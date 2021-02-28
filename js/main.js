"use strict";
const menuMobile = document.querySelector('.menu-mobile');
const menuMobileElement = document.querySelector('.menu-mobile span');
const menu = document.querySelector('.menu');
const servicesItemTitle = document.querySelectorAll('.services__item-title');
const servicesItemLink = document.querySelectorAll('.services__item-link');
const servicesPhotoItem = document.querySelectorAll('.services__photo-item');
const servicesPriceList = document.querySelectorAll('.services__price-list');
const form = document.querySelector('.form');
const formBtn = document.querySelector('.form__btn');
const formInput = document.querySelector('.form__input');
const formTextarea = document.querySelector('.form__textarea');
const reviewsAnswer = document.querySelector('.reviews-answer');
const textArea = document.querySelector('[data-autoresize]');

// Звіт про відісланий відгук
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.insertAdjacentElement('beforeend', overlay);

function toggleAnswer() {
    reviewsAnswer.style.display = 'block';
    overlay.classList.toggle('active');
    form.reset();
}

formBtn.addEventListener('click', (event) => {
    if ((formInput.value || (formInput.value = 'Неизвестный')) && formTextarea.value) {
        event.preventDefault()
        toggleAnswer();
        
        setTimeout(() => {
            reviewsAnswer.style.display = 'none';
            overlay.classList.toggle('active');
            formTextarea.style.borderBottomColor = 'black';
            formTextarea.style.height = 'auto';
            formInput.value = '';

        }, 1000)
    } else {
        if (!formInput.value){
            formInput.value =  'Неизвестный'; 
        }
        if (!formTextarea.value){
            formTextarea.style.borderBottomColor = 'red';
        }
    }
});

// Autoresize для текстового відгуку
textArea.addEventListener('input', (event) => {
    let target = event.target;

    target.style.height = '20px';
    target.style.height = target.scrollHeight + 'px';
});

// Створення псевдо-підписів до заголовків
let title = document.querySelectorAll('.title');
for (let i = 0; i < title.length; i++) {
    title[i].dataset.pseudotitle = title[i].textContent;
}

// Бургер меню
menuMobile.addEventListener('click', () => {
    menuMobileElement.classList.toggle('active');
    menu.classList.toggle('active');
});

// Акардеон для списку послуг
servicesItemTitle.forEach(function (item) {
    item.addEventListener('click', function (event) {
        item.classList.toggle('active');

        if (item.classList.contains('active')) {
            item.nextElementSibling.classList.add('active')
        } else {
            item.nextElementSibling.classList.remove('active')
        }
    })
});

// Перемикання фото та прайс-списку
servicesItemLink.forEach(function (item) {
    item.addEventListener('click', function (event) {
        for (let i = 0; i < servicesItemLink.length; i++) {
            servicesItemLink[i].classList.remove('active');
        }

        item.classList.toggle('active');

        for (let i = 0; i < servicesPriceList.length; i++) {
            servicesPriceList[i].classList.remove('active');
        }

        for (let i = 0; i < servicesPhotoItem.length; i++) {
            servicesPhotoItem[i].classList.remove('active');
        }

        if (item.classList.contains('men-hall')) {
            document.querySelector('.photo-man').classList.add('active');
            document.querySelector('.price-men').classList.add('active');
        } else if (item.classList.contains('women-hall')) {
            document.querySelector('.photo-woman').classList.add('active');
            document.querySelector('.price-women').classList.add('active');
        } else if (item.classList.contains('manicure-servise')) {
            document.querySelector('.photo-nails').classList.add('active');
            document.querySelector('.price-nails-manicure').classList.add('active');
        } else if (item.classList.contains('pedicure-servise')) {
            document.querySelector('.photo-nails').classList.add('active');
            document.querySelector('.price-nails-pedicure').classList.add('active');
        } else if (item.classList.contains('eyebrows-servise')) {
            document.querySelector('.photo-eyebrows').classList.add('active');
            document.querySelector('.price-eyebrows').classList.add('active');
        } else if (item.classList.contains('eyelashes-service')) {
            document.querySelector('.photo-eyebrows').classList.add('active');
            document.querySelector('.price-eyelashes').classList.add('active');
        }
    })
});

// Слайдер
const swiper = new Swiper('.swiper-container', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
    },

    grabCursor: true,
});

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

function DynamicAdapt(type) {
    this.type = type;
}

DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");

    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(",");
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
        оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
    }

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
        return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
    });

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];

        // массив объектов с подходящим брейкпоинтом
        const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
            return item.breakpoint === mediaBreakpoint;
        });
        matchMedia.addListener(function () {
            _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
    }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
    } else {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) {
                this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        }
    }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
    }
    if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
        parent.insertAdjacentElement('beforeend', element);
    }
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === "first" || b.place === "last") {
                    return -1;
                }

                if (a.place === "last" || b.place === "first") {
                    return 1;
                }

                return a.place - b.place;
            }

            return a.breakpoint - b.breakpoint;
        });
    } else {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }

                if (a.place === "first" || b.place === "last") {
                    return 1;
                }

                if (a.place === "last" || b.place === "first") {
                    return -1;
                }

                return b.place - a.place;
            }

            return b.breakpoint - a.breakpoint;
        });
        return;
    }
};

const da = new DynamicAdapt("min");
da.init();