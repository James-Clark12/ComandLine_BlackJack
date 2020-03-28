import {Deck} from './deck';
import {Hand} from './hand';
var readlineSync = require('readline-sync');

export class GameEngine{

  constructor() {
    this.deck;
    this.playerHand;
    this.playerFunds = 10000;
    this.stake = 0;
    this.dealerHand;
    this.gameOver;
    this.playing;
    this.playerHasBlackJack;
    this.dealerHasBlackJack;
  }

  showBlackJackResults(playerHasBlackJack, dealerHasBlackJack) {
    if (playerHasBlackJack && dealerHasBlackJack) {
      console.log("Both players have blackjack! Draw!");
      if (this.stake > 0) {
        console.log(`Player receives his stake of ${this.stake} back`);
        this.playerFunds = this.playerFunds + (this.stake);
      }
    } else if (playerHasBlackJack) {
      console.log("You have blackjack! You win!");
      if (this.stake > 0) {
        console.log(`Player doubles his stake of ${this.stake}`);
        this.playerFunds = this.playerFunds + (2*this.stake);
      }
    } else if (dealerHasBlackJack) {
      console.log("Dealer has blackjack! Dealer wins!");
      if (this.stake > 0) {
        console.log(`Player loses his stake of ${this.stake}`);
      }
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

      let wantToStake = readlineSync.question(`Would you like to place a stake on this round?, you currently have ${this.playerFunds} available. \n\n`);
      if (['y', 'yes', 'Y', 'Yes'].includes(wantToStake)) {
        let stake = readlineSync.question('Enter your desired stake as an integer \n\n');
        console.log(parseInt(stake));
        this.stake=(parseInt(stake));
        this.playerFunds = this.playerFunds - this.stake;
        console.log(`${stake} accepted.`);
      } else {
        console.log('\n We can begin then');
        this.stake = 0;
      }

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
            if (this.stake > 0) {
              console.log(`Player loses his stake of ${this.stake}`);
            }
            let dealerHandValue = this.dealerHand.getValue();
            console.log("Dealer's hand was: ", dealerHandValue);
            this.gameOver = true;
          }
        } else {
          // player has stuck
          let playerHandValue = this.playerHand.getValue();
          let dealerHandValue = this.dealerHand.getValue();

          console.log("Dealer's hand is: ", dealerHandValue);

          // dealer shold hit if below 17
          while(dealerHandValue < 17 && dealerHandValue < 22) {
            console.log('Dealer will hit');
            this.dealerHand.addCard(this.deck.deal());
            dealerHandValue = this.dealerHand.getValue();
            console.log("Dealer's hand is now: ", dealerHandValue);
          }

          if (dealerHandValue > 21) {
            console.log('Dealer has gone bust');
            console.log('Player wins');
            if (this.stake > 0) {
              console.log(`Player doubles his stake of ${this.stake}`);
              this.playerFunds = this.playerFunds + this.stake;
              this.gameOver = true;
            }
          } else {
            console.log('Results of this round are...');
            console.log('Player hand is: ', playerHandValue);
            console.log("Dealer's hand is: ", dealerHandValue);

            if (playerHandValue > dealerHandValue) {
              console.log('Player wins');
              if (this.stake > 0) {
                console.log(`Player doubles his stake of ${this.stake}`);
                this.playerFunds = this.playerFunds + (2*this.stake);
              }
            } else if (playerHandValue === dealerHandValue) {
              console.log("It's a tie");
              if (this.stake > 0) {
                console.log(`Player receives his stake of ${this.stake} back`);
                this.playerFunds = this.playerFunds + (this.stake);
              }
            } else {
              console.log('Dealer wins');
              if (this.stake > 0) {
                console.log(`Player loses his stake of ${this.stake}`);
              }
            }
            this.gameOver = true;
          }
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
