const burger = () => {
    const main = document.getElementById('main');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');

    burger.addEventListener('click', () => {
        menu.classList.toggle('menu-active');
        main.classList.toggle('main-menu-active');
    });
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
