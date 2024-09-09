'use strict';

const scroll = {
    position: 0,
    scrollOff() {
        scroll.position = window.scrollY;
        document.body.style.cssText = `
            overflow: hidden;
            padding-right: ${window.innerWidth - document.body.offsetWidth}px;
            position: fixed;
            top: -${scroll.position}px;
            left: 0;
            height: 100vh;
            width: 100vw;
            `;
        document.documentElement.style.scrollBehavior = 'unset';
    },
    scrollOn() {
        document.body.style.cssText = ``;
        window.scrollTo({
            top: scroll.position,
        });
        document.documentElement.style.scrollBehavior = '';
    },
};

const burger = () => {
    const main = document.getElementById('main');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    const menuElements = document.querySelectorAll('.nav__item');

    const toggleMenu = () => {
        const isOpen = menu.classList.contains('menu-active');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            if (isOpen) {
                menu.classList.remove('menu-active');
                main.classList.remove('main-menu-active');
                scroll.scrollOn();
            } else {
                menu.classList.add('menu-active');
                main.classList.add('main-menu-active');
                scroll.scrollOff();
            }
        }
    };

    burger.addEventListener('click', toggleMenu);
    menuElements.forEach((element) => element.addEventListener('click', toggleMenu));
};

const slider = () => {
    const sliderInner = document.querySelector('.slider__inner');
    const cards = document.querySelectorAll('.card');

    const countCards = cards.length;
    const step = 10;
    const slideTime = 4000;

    let acc = 0;
    let elapsedMs = 0;
    let intervalId;

    const cardWidth = cards[0].offsetWidth;
    const gap = Number(getComputedStyle(sliderInner).columnGap.replace('px', ''));
    const mediaQuery = window.matchMedia('(max-width: 1050px)').matches;

    const transformValue = cardWidth + gap;
    const transformValueMax = transformValue * (mediaQuery ? countCards - 1 : countCards - 3);

    const slide = () => {
        elapsedMs += 10;

        if (elapsedMs >= slideTime) {
            acc += transformValue;
            if (acc > transformValueMax) {
                acc = 0;
            }
            sliderInner.style.transform = `translateX(-${acc}px)`;
            elapsedMs = 0;
        }
    };

    const start = () => (intervalId = setInterval(slide, step));
    const pause = () => clearInterval(intervalId);
    const restart = () => {
        sliderInner.style.transform = `translateX(-0px)`;
        pause();
        start();
    };

    sliderInner.addEventListener('mouseover', pause);
    sliderInner.addEventListener('mouseout', start);
    window.addEventListener('resize', restart);

    start();
};

burger();
slider();
