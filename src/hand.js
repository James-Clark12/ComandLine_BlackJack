import * as helperFuncs from './helperFuncs';

export class Hand {
  constructor(dealer=false) {
    this.dealer = dealer;
    this.cards = [];
    this.value = 0;
  }

  display() {
    if (this.dealer === true) {
      console.log('Hidden');
      console.log(this.cards[1]);
    } else {
      this.cards.forEach(card => {
        console.log(card);
      })
      console.log('Value: ', this.getValue());
    }
  }

  addCard(card) {
    this.cards.push(card);
  }

  calculateValue() {
    this.value = 0;
    let hasAce = false;
    // add up value of cards ** easier to just attach an int value to each card - make them objects
    this.cards.forEach(card => {
      if(helperFuncs.isNumeric(card.value)) {
        this.value = this.value + parseInt(card.value);
      } else {
        if (card.value === 'A') {
          hasAce = true;
          this.value = this.value + 11;
        } else {
          this.value = this.value + 10;
        }
      }
    })
    //ace can be 1 if that is beneficial
    if (hasAce && this.value>21) {
      this.value = this.value - 10;
    }
  }

  getValue() {
    this.calculateValue();
    return this.value;
  }
};
