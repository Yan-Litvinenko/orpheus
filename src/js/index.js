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
    const countCard = document.querySelectorAll('.card').length;

    const transformValue = 35.11;
    const transformValueMax = transformValue * (countCard - 3);
    const ms = 5000;

    let acc = 0;
    let intervalId;

    const slide = () => {
        acc += transformValue;

        if (acc > transformValueMax) {
            acc = 0;
        }

        sliderInner.style.transform = `translateX(-${acc}%)`;
    };

    const start = () => (intervalId = setInterval(slide, ms));
    const pause = () => clearInterval(intervalId);

    sliderInner.addEventListener('mouseover', pause);
    sliderInner.addEventListener('mouseout', start);

    start();
};

burger();
slider();
