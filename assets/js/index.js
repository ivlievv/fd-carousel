'use strict';

import Carousel from './carousel/index.js';

const CAROUSEL_ID = 'CAROUSEL_ID';

class CarouselController {
  /**
   *
   * @param {string} slidesPath
   */
  constructor (slidesPath) {
    this._slidesPath = slidesPath;
    this._isFetching = false;
    this._carousel = null;
    this._error = null;
    this.onload = null;
    this.loadSlides();
    /*
     this.loadSlides2 = this.loadSlides2.bind(this);
     */
  }

  get error () {
    return this._error;
  }

  set error (value) {
    if (value instanceof Error) {
      this._error = value;
      if (typeof this.onerror === 'function') {
        this.onerror(new Event('error'));
      }
      this.isFetching = false;
    } else {
      throw new TypeError();
    }
  }

  get isFetching () {
    return this._isFetching;
  }

  /**
   *
   * @param {boolean} value
   */
  set isFetching (value) {
    if (typeof value !== 'boolean') {
      throw new TypeError();
    }
    this._isFetching = value;
    if (value && typeof this.onstart === 'function') {
      this.onstart();
    }
    if (!value && !this.error && typeof this.onload === 'function') {
      this.onload();
    }
  }

  /*  loadSlides2(){
   fetchJson(this._slidesPath)
   .then(data => {
   this._carousel = new Carousel(data);
   this.isFetching = false;
   });
   };*/
  loadSlides = () => {

    this.isFetching = true;
    fetchJson(this._slidesPath)
      .then(data => {
        this._carousel = new Carousel(data);
        this.isFetching = false;
      })
      .catch(err => {
        this.error = err;
      });
  };

  get carousel () {
    return this._carousel;
  }

  renderSlide (src, index) {
    const slideElem = document.createElement('div');
    slideElem.setAttribute('id', index);
    const image = new Image();
    image.src = src;
    slideElem.appendChild(image);
    slideElem.classList.add('slide');
    switch (index) {
      case this._carousel.currentIndex:
        slideElem.classList.add('currentSlide');
        break;
      case Carousel.getPrevIndex(this.carousel.currentIndex, this.carousel.length):
        slideElem.classList.add('prevSlide');
        break;
      case Carousel.getNextIndex(this.carousel.currentIndex, this.carousel.length):
        slideElem.classList.add('nextSlide');
        break;
    }
    return slideElem;
  }

  renderSlideContainer () {

    const container = document.createElement('div');
    container.classList.add('slidesContainer');

    if (this.isFetching) {

      const spinner = document.createElement('h1');
      spinner.innerText = 'Loading...';
      container.appendChild(spinner);

    } else if (this.error) {

    } else {
      this.carousel.slides.forEach((value, index) => {
        container.appendChild(this.renderSlide(value, index));
      });
    }

    return container;
  }

  renderButton () {
    const button = document.createElement('div');
    button.classList.add('button');
    const arrowLeftImage = new Image();
    arrowLeftImage.src = `${location.origin}/assets/icons/arrow.png`;
    button.appendChild(arrowLeftImage);
    return button;
  }

  goNext = () => {

    const currentIndex = this._carousel.currentIndex;
    const prevIndex = Carousel.getPrevIndex(currentIndex, this._carousel.length);
    const nextIndex = Carousel.getNextIndex(currentIndex, this._carousel.length);
    const newNextIndex = Carousel.getNextIndex(nextIndex, this._carousel.length);

    const prevSlide = document.getElementById(prevIndex);
    const currentSlide = document.getElementById(currentIndex);
    const nextSlide = document.getElementById(nextIndex);
    const newNext = document.getElementById(newNextIndex);

    prevSlide.classList.remove('prevSlide');
    currentSlide.classList.replace('currentSlide', 'prevSlide');
    nextSlide.classList.replace('nextSlide', 'currentSlide');
    newNext.classList.add('nextSlide');
    this._carousel.goNext();
  };

  goPrev = () => {
    const currentIndex = this._carousel.currentIndex;
    const prevIndex = Carousel.getPrevIndex(currentIndex, this._carousel.length);
    const nextIndex = Carousel.getNextIndex(currentIndex, this._carousel.length);
    const newPrevIndex = Carousel.getPrevIndex(prevIndex, this._carousel.length);

    const prevSlide = document.getElementById(prevIndex);
    const currentSlide = document.getElementById(currentIndex);
    const nextSlide = document.getElementById(nextIndex);
    const newPrev = document.getElementById(newPrevIndex);

    nextSlide.classList.remove('nextSlide');
    currentSlide.classList.replace('currentSlide', 'nextSlide');
    prevSlide.classList.replace('prevSlide', 'currentSlide');
    newPrev.classList.add('prevSlide');
    this._carousel.goPrev();
  };

  render () {

    const prevButton = this.renderButton();
    prevButton.addEventListener('click', this.goPrev);

    const nextButton = this.renderButton();
    nextButton.style.transform = 'rotate(180deg)';
    nextButton.style.transformOrigin = 'center';
    nextButton.addEventListener('click', this.goNext);

    const carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('carouselWrapper');
    carouselWrapper.appendChild(prevButton);
    carouselWrapper.appendChild(this.renderSlideContainer());
    carouselWrapper.appendChild(nextButton);

    return carouselWrapper;

  }

}

async function fetchJson (url, options) {

  const response = await fetch(url, options);
  return await response.json();

}

const carouselController = new CarouselController('./images.json');

const newCarousel = carouselController.render();
newCarousel.setAttribute('id', CAROUSEL_ID);
document.body.appendChild(newCarousel);
carouselController.onstart = () => {
  reRenderCarousel();
};

carouselController.onload = () => {
  reRenderCarousel();
};

carouselController.onerror = () => {
  reRenderCarousel();
};

function reRenderCarousel () {
  const newCarousel = carouselController.render();
  newCarousel.setAttribute('id', CAROUSEL_ID);
  document.body.replaceChild(newCarousel, document.getElementById(CAROUSEL_ID));
}




