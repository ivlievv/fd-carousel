'use strict';

import Carousel from './carousel/index.js';

class CarouselController {
  constructor (slidesPath) {
    this._slidesPath = slidesPath;
    this._isFetching = true;
    this._carousel = null;
    this.loadSlides();
  }

  get isFetching(){
    return this._isFetching;
  }

  loadSlides () {
    fetchJson(this._slidesPath)
      .then(data => {
        this._carousel = new Carousel(data);
        this._isFetching = false;
      });
  }

}

async function fetchJson (url, options) {
  const response = await fetch(url, options);
  return await response.json();
}
