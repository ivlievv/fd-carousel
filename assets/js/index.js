'use strict';

import Carousel from './carousel/index.js';

class CarouselController{
  constructor (slidesPath) {
    this._slidesPath = slidesPath;
    this._isFetching = true;
    this._carousel = null;
    this.onload = null;
    this.loadSlides = this.loadSlides.bind(this);
    setTimeout(this.loadSlides, 4000)
  }

  get isFetching () {
    return this._isFetching;
  }

  /**
   *
   * @param {boolean} value
   */
  set isFetching (value) {
    this._isFetching = value;
    if(!value && typeof this.onload === 'function'){
      this.onload()
    }
  }
   loadSlides () {
    fetchJson(this._slidesPath)
      .then(data => {
        this._carousel = new Carousel(data);
        this.isFetching = false;
      });
  }

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

    this.carousel.slides.forEach((value, index) => {
      container.appendChild(this.renderSlide(value, index));
    });

    return container;
  }

  renderButton(){
    const button = document.createElement('div');
    button.classList.add('button');
    return button;
  }

  goNext(){
    
  }

  goPrev(){
    
  }
  
  render () {

    if(this.isFetching){
      const spinner = document.createElement('h1');
      spinner.innerText = "Loading...";
      return spinner;
    }else{

      const prevButton = this.renderButton();
      const arrowLeftImage = new Image();
      arrowLeftImage.src = `${location.origin}/assets/icons/arrow-left.png`;
      prevButton.appendChild(arrowLeftImage);
      prevButton.addEventListener('click', this.goPrev);


      const nextButton = this.renderButton();
      const arrowRightImage = new Image();
      arrowRightImage.src = `${location.origin}/assets/icons/arrow-right.png`;
      nextButton.appendChild(arrowRightImage);
      nextButton.addEventListener('click', this.goNext);

      const carouselWrapper = document.createElement('div');
      carouselWrapper.classList.add('carouselWrapper');
      carouselWrapper.appendChild(prevButton);
      carouselWrapper.appendChild( this.renderSlideContainer() );
      carouselWrapper.appendChild(nextButton);

      return carouselWrapper;
    }

  }

}

async function fetchJson (url, options) {
  const response = await fetch(url, options);
  return await response.json();
}

const carouselController = new CarouselController('./images.json');

const firstRenderElem = carouselController.render();
document.body.appendChild( firstRenderElem );

carouselController.onload = () => {
  document.body.replaceChild( carouselController.render(),firstRenderElem );
};


