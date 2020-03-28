import {Card} from './card';
import * as constants from './constants';

export class Deck {
  constructor() {
    this.cards = [];
    // create all the possible cards
    constants.possibleSuits.forEach(suit => {
      constants.possibleCardsValues.forEach(value => {
        this.cards.push(new Card(suit, value));
      })
    })
  }

  fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffle() {
    if (this.cards.length > 1) {
      this.fisherYatesShuffle(this.cards);
    }
  }

  deal() {
    if(this.cards.length > 1) {
      return this.cards.pop();
    }
  }
};
