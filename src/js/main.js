import '../style/color.scss';
import '../style/layout.scss';
import '../style/retrocard.scss';
import { words } from "../data/words.json";
import { decks } from "../data/card.json"
import { getRandomInt, setRandomSeed } from "./util";
import "./lib/seedrandom";
import { Deck } from "./deck";
import { UrlParamsHandler } from "./url"

const p = new UrlParamsHandler();
let deck = new Deck(decks[p.getDeckId()], true);

if (p.getCardStack() !== null) {
    setRandomSeed();
}
else {
    newCardDeck();
}


document.getElementById("addRandomCard").addEventListener("click", () => {
    deck.getCard();
    const newDraw = parseInt(p.getDraw()) + 1;
    p.setDraw(newDraw);
});

if (p.getDraw() === null) {
    p.setDraw(0);
}
for (let index = 0; index < p.getDraw(); index++) {
    deck.getCard();
}

document.getElementById("reset").addEventListener("click", () => {
    Reset();
})

function Reset() {
    p.setDraw(0);
    newCardDeck();
    location.reload();
}

function newCardDeck() {
    const word = `${words[getRandomInt(words.length)]}${words[getRandomInt(words.length)]}`;
    p.setCardStack(word);
    // p.setDeckId(deckId);
    deck = new Deck(decks[p.getDeckId()], true);
    setRandomSeed();
}

function createDropdown() {
    let dropdown = document.createElement("select");
    dropdown.setAttribute("id","idCardDecks");
    decks.forEach((deck, index) => {
        dropdown.appendChild(createOptionElement(deck, index))
    })
    dropdown.addEventListener("change", (e) => {
        p.setDeckId(e.target.selectedOptions[0].getAttribute("is"));
        Reset();

    })
    document.getElementById("actionsContainer").append(dropdown)
}

function createOptionElement(deck, index) {
    const option = document.createElement("option", index);
    if (index == p.getDeckId()) {
        option.setAttribute("selected", "selected");
    }
    option.innerText = deck.meta.name;
    return option;
}

createDropdown();