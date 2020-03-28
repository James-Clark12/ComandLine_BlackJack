
var readlineSync = require('readline-sync');

function isNumeric (value) {
  return ['2', '3', '4', '5', '6' ,'7', '8', '9', '10'].includes(value);
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  returnCard() {
    return `${this.value} of ${this.suit}`;
  }
};

const possibleCardsValues = ['A', '2', '3', '4', '5', '6' ,'7', '8', '9', '10', 'J', 'Q', 'K'];
const possibleSuits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];

class Deck {
  constructor() {
    this.cards = [];
    // create all the possible cards
    possibleSuits.forEach(suit => {
      possibleCardsValues.forEach(value => {
        this.cards.push(new Card(suit, value));
      })
    })
  }

  fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
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

class Hand {
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
      if(isNumeric(card.value)) {
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

// seems fairly robust above here - maybe the parseInt might be problematic

class Game {

  constructor() {
    this.deck;
    this.playerHand;
    this.dealerHand;
    this.gameOver;
    this.playing;
    this.playerHasBlackJack;
    this.dealerHasBlackJack;
  }

  showBlackJackResults(playerHasBlackJack, dealerHasBlackJack) {
    if (playerHasBlackJack && dealerHasBlackJack) {
      console.log("Both players have blackjack! Draw!");
    } else if (playerHasBlackJack) {
      console.log("You have blackjack! You win!");
    } else if (dealerHasBlackJack) {
      console.log("Dealer has blackjack! Dealer wins!");
    }
  }

  checkForBlackJack(player) {
    if (player === 'player') {
      let player = false;
      if (this.playerHand.getValue() === 21) {
        player = true;
      }
      return player;
    } else if (player === 'dealer') {
      let dealer = false;
      if (this.dealerHand.getValue() === 21) {
        dealer = true;
      }
      return dealer;
    }
  }

  playerIsOver() {
    return this.playerHand.getValue() > 21;
  }

  play() {
    this.playing = true;

    while(this.playing===true) {
      this.deck = new Deck();
      this.deck.shuffle();

      this.playerHand = new Hand();
      this.dealerHand = new Hand(true);

      for(let i=0; i<2; i++) {
        this.playerHand.addCard(this.deck.deal());
        this.dealerHand.addCard(this.deck.deal());
      }

      console.log('Your hand is: ');
      this.playerHand.display();
      console.log("Dealer's hand is: ");
      this.dealerHand.display();

      this.gameOver = false;

      while(this.gameOver !== true) {
        this.playerHasBlackJack = this.checkForBlackJack('player');
        this.dealerHasBlackJack = this.checkForBlackJack('dealer');
        if (this.playerHasBlackJack || this.dealerHasBlackJack) {
          this.gameOver = true;
          this.showBlackJackResults(this.playerHasBlackJack, this.dealerHasBlackJack);
          break;
        }
        // it's not making it to here for some bugged reason
        let choice = readlineSync.question('Please choose [Hit / Stick] \n\n');

        if (['hit', 'Hit', 'h'].includes(choice)) {
          this.playerHand.addCard(this.deck.deal());
          this.playerHand.display();
          if (this.playerIsOver()) {
            console.log('Player is bust');
            this.gameOver = true;
          }
        } else {
          // player has stuck
          let playerHandValue = this.playerHand.getValue();
          let dealerHandValue = this.dealerHand.getValue();

          console.log('Results of this round are...');
          console.log('Player hand is: ', playerHandValue);
          console.log("Dealer's hand is: ", dealerHandValue);

          if (playerHandValue > dealerHandValue) {
            console.log('Player wins');
          } else if (playerHandValue < dealerHandValue) {
            console.log("It's a tie");
          } else {
            console.log('Dealer wins');
          }
          this.gameOver = true;
        }
    }
    let again = readlineSync.question('Play another round? \n\n');
    if (['y', 'yes', 'Y', 'Yes'].includes(again)) {
      console.log('\n Next round...');
      this.gameOver = false;
    } else {
      console.log('\n Thanks for playing!');
      this.playing = false;
    }
    }
  }
};

const game = new Game();
game.play();
