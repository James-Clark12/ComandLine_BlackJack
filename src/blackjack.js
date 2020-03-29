import { GameEngine } from "./gameEngine";

// get the html elements we need
console.log(window.document);
const app = document.getElementById("app");
console.log("app is: ", app);
const messageBox = document.getElementsByClassName("message-feed");
messageBox.style.backgroundColor = "blue";

// launch the game
const gameEngine = new GameEngine();
gameEngine.play();
