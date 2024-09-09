'use strict';

const DOM_ELEMENTS = {
    aboutContent: document.querySelector('.about__content'),
    avatars: document.querySelector('.avatars'),
    burger: document.getElementById('burger'),
    cards: document.querySelectorAll('.card'),
    contactsItem: document.querySelectorAll('.contacts__item'),
    footerText: document.querySelector('.footer__text'),
    footerTitle: document.querySelector('.footer__title'),
    main: document.getElementById('main'),
    menu: document.getElementById('menu'),
    menuElements: document.querySelectorAll('.nav__item'),
    sculpture: document.querySelector('.sculpture'),
    sliderElement: document.querySelector('.slider'),
    sliderInner: document.querySelector('.slider__inner'),
    statue: document.querySelector('.statue'),
};

const SLIDER_SETTINGS = {
    cardWidth: DOM_ELEMENTS.cards[0].offsetWidth,
    countCards: DOM_ELEMENTS.cards.length,
    gap: Number(getComputedStyle(DOM_ELEMENTS.sliderInner).columnGap.replace('px', '')),
    mediaQuery: window.matchMedia('(max-width: 1050px)').matches,
    slideTime: 4000,
    step: 10,
    transformValue() {
        return this.cardWidth + this.gap;
    },
    transformValueMax() {
        return this.transformValue() * (this.mediaQuery ? this.countCards - 1 : this.countCards - 3);
    },
};

const SLIDER_VALUE = {
    acc: 0,
    elapsedMs: 0,
    intervalId: null,
};

const OBSERVER_SETTINGS = {
    root: null,
    rootMargin: '0px',
    threshold: 0.001,
};

const OBSERVER_ELEMENTS = [
    DOM_ELEMENTS.statue,
    DOM_ELEMENTS.aboutContent,
    DOM_ELEMENTS.sliderElement,
    DOM_ELEMENTS.sculpture,
    DOM_ELEMENTS.avatars,
    DOM_ELEMENTS.footerTitle,
    DOM_ELEMENTS.footerText,
    DOM_ELEMENTS.contactsItem,
];

const SCROLL = {
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

const observer = new IntersectionObserver(observerCallback, OBSERVER_SETTINGS);

DOM_ELEMENTS.menuElements.forEach((element) => element.addEventListener('click', burger));
DOM_ELEMENTS.sliderInner.addEventListener('mouseover', pause);
DOM_ELEMENTS.sliderInner.addEventListener('mouseout', start);
DOM_ELEMENTS.burger.addEventListener('click', burger);
window.addEventListener('resize', () => {
    alert('resize');
    restart();
    updateSettingsSlider();
});

start();
addObserverElement(OBSERVER_ELEMENTS);

function burger() {
    const isOpen = DOM_ELEMENTS.menu.classList.contains('menu-active');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        if (isOpen) {
            DOM_ELEMENTS.menu.classList.remove('menu-active');
            DOM_ELEMENTS.main.classList.remove('main-menu-active');
            SCROLL.scrollOn();
        } else {
            DOM_ELEMENTS.menu.classList.add('menu-active');
            DOM_ELEMENTS.main.classList.add('main-menu-active');
            SCROLL.scrollOff();
        }
    }
}

function slide() {
    SLIDER_VALUE.elapsedMs += 10;

    if (SLIDER_VALUE.elapsedMs >= SLIDER_SETTINGS.slideTime) {
        SLIDER_VALUE.acc += SLIDER_SETTINGS.transformValue();
        if (SLIDER_VALUE.acc > SLIDER_SETTINGS.transformValueMax()) {
            SLIDER_VALUE.acc = 0;
            alert(`acc(${SLIDER_VALUE.acc}) > max value(${SLIDER_SETTINGS.transformValueMax()})`);
        }

        DOM_ELEMENTS.sliderInner.style.transform = `translateX(-${SLIDER_VALUE.acc}px)`;
        SLIDER_VALUE.elapsedMs = 0;
    }
}

function start() {
    pause();
    SLIDER_VALUE.intervalId = setInterval(slide, SLIDER_SETTINGS.step);
}
function pause() {
    clearInterval(SLIDER_VALUE.intervalId);
}

function restart() {
    SLIDER_VALUE.acc = 0;
    SLIDER_VALUE.elapsedMs = 0;
    DOM_ELEMENTS.sliderInner.style.transform = `translateX(-0px)`;

    start();
}

function observerCallback(entries, observer) {
    const animationClasses = {
        statue: 'animation-observer-opacity',
        about__content: 'animation-observer-shift',
        slider: 'animation-observer-opacity',
        avatars: 'animation-observer-shift',
        sculpture: 'animation-observer-shift',
        footer__title: 'animation-observer-opacity',
        footer__text: 'animation-observer-opacity',
        contacts__item: 'animation-observer-shift',
    };

    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const target = entry.target;

            for (const className in animationClasses) {
                if (target.classList.contains(className)) {
                    target.classList.add(animationClasses[className]);
                    break;
                }
            }

            observer.unobserve(entry.target);
        }
    });
}

function addObserverElement(elements) {
    elements.forEach((element) => {
        if (element instanceof NodeList) {
            element.forEach((e) => observer.observe(e));
        } else if (element instanceof Element) {
            observer.observe(element);
        }
    });
}

function updateSettingsSlider() {
    SLIDER_SETTINGS.cardWidth = document.querySelector('.card').offsetWidth;
    SLIDER_SETTINGS.gap = Number(
        getComputedStyle(document.querySelector('.slider__inner')).columnGap.replace('px', ''),
    );
    SLIDER_SETTINGS.mediaQuery = window.matchMedia('(max-width: 1050px)').matches;
}
