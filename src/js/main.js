import '../style/color.scss';
import '../style/layout.scss';
import '../style/retrocard.scss';
import { words } from "../data/words.json";
import { mainDeck } from "../data/card.json"
import { getRandomInt, setRandomSeed } from "./util";
import "./lib/seedrandom";
import { Deck } from './deck';

function setUrlParams(params) {
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

const params = new URLSearchParams(location.search);
const seed = params.get("cardStack");
const draw = params.get("draw");

if (seed !== null) {
    setRandomSeed();
}
else {
    newCardDeck();
}

const deck = new Deck(mainDeck, true);

document.getElementById("addRandomCard").addEventListener("click", () => {
    deck.getCard();
    const newDraw = parseInt(params.get("draw")) + 1;
    params.set("draw", newDraw);
    setUrlParams(params);
});

if (draw === null) {
    params.set("draw", 0);
    setUrlParams(params);
}
for (let index = 0; index < draw; index++) {
    deck.getCard();
}

document.getElementById("reset").addEventListener("click", () => {
    params.set("draw", 0)
    setUrlParams(params);
    newCardDeck();
    location.reload();
})

function newCardDeck() {
    const word = `${words[getRandomInt(words.length)]}${words[getRandomInt(words.length)]}`;
    params.set("cardStack", word);
    setUrlParams(params);
    setRandomSeed();
}
