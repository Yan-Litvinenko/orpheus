const burger = () => {
    const main = document.getElementById('main');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');

    burger.addEventListener('click', () => {
        menu.classList.toggle('menu-active');
        main.classList.toggle('main-menu-active');
    });
};

burger();
