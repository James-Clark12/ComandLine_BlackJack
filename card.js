
export class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  returnCard() {
    return `${this.value} of ${this.suit}`;
  }
};
