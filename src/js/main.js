import '../style/color.scss';
import '../style/layout.scss';
import '../style/retrocard.scss';
import { words } from "../data/words.json";
import { decks } from "../data/card.json"
import { getRandomInt, setRandomSeed } from "./util";
import "./lib/seedrandom";
import { Deck } from "./deck";
import { UrlParamsHandler } from "./ParamsHandler";
import {Modal} from "./Modal";

const p = new UrlParamsHandler();
let deck = new Deck(decks[p.getDeckId()], true, true);
const t = new Modal();
updateModal();
if (p.getCardStack() !== null) {
    setRandomSeed();
}

document.addEventListener("drawCard", (drawPile) => {
        const newDraw = parseInt(p.getDraw()) + 1;
        p.setDraw(newDraw);
}, false);


drawCardsBasedOnParams();

document.getElementById("reset").addEventListener("click", () => {
    Reset();
})
document.getElementById("about").addEventListener("click", () => {
    t.show();
})

function drawCardsBasedOnParams() {
    const drawNumber = p.getDraw();
    for (let index = 0; index < drawNumber; index++) {
        deck.getCardWithoutDrawEvent();
    }
}

function Reset() {
    document.getElementById("cardContainer").innerHTML = "";
    p.setDraw(0);
    newCardDeck();
    location.reload();
}

function newCardDeck() {
    const word = `${words[getRandomInt(words.length)]}${words[getRandomInt(words.length)]}`;
    p.setCardStack(word);
    updateModal();
    deck = new Deck(decks[p.getDeckId()], true, true);
    setRandomSeed();
}

function updateModal() {
    const d = decks[p.getDeckId()];
    t.setTitle(d.meta.name);
    t.setText(d.meta.about);
}

function createDropdown() {
    let dropdown = document.createElement("select");
    dropdown.setAttribute("id","idCardDecks");
    decks.forEach((deck, index) => {
        dropdown.appendChild(createOptionElement(deck, index))
    })
    dropdown.addEventListener("change", (e) => {
        p.setDeckId(e.target.selectedOptions[0].getAttribute("id"));
        Reset();
    })
    document.getElementById("actionsContainer").append(dropdown)
}

function createOptionElement(deck, index) {
    const option = document.createElement("option");
    if (index == p.getDeckId()) {
        option.setAttribute("selected", "selected");
    }
    option.setAttribute("id", index);
    option.innerText = deck.meta.name;
    return option;
}

createDropdown();