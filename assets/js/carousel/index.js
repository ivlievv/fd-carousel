'use strict';

class Carousel {
  /**
   *
   * @param {Array<string>} slidesPaths
   */
  constructor (slidesPaths) {
    if(slidesPaths.length){
      this._slides = slidesPaths;
      this._currentIndex = 0
    }
    else{
      throw new Error()
    }

  }

  get currentIndex(){
    return this._currentIndex;
  }

  /**
   *
   * @param {number} value
   */
  set currentIndex(value){
    if(isNaN(value)){
      throw new TypeError();
    }
    if (value < 0 || value > this._slides.length - 1) {
      throw new RangeError();
    }
     this._currentIndex = value;
  }

  goNext () {
    this.currentIndex = Carousel.getNextIndex(this.currentIndex, this._slides.length);
  }

  goPrev () {
    this.currentIndex = Carousel.getPrevIndex(this.currentIndex, this._slides.length);
  }

  /**
   *
   * @param {number} index
   * @param {number} length
   * @return {number} - next slide index in carousel
   * @static
   */
  static getNextIndex (index, length) {
    if (index < 0 || index > length - 1) {
      throw new RangeError();
    }
    return (index + 1) % length;
  }

  /**
   *
   * @param {number} index
   * @param {number} length
   * @return {number} - previous slide index in carousel
   * @static
   */
  static getPrevIndex (index, length) {
    if (index < 0 || index > length - 1) {
      throw new RangeError();
    }
    return (index - 1 + length) % length;
  }
}

export default Carousel;
