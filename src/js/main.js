import '../style/color.scss';
import '../style/layout.scss';
import '../style/retrocard.scss';
import { words } from "../data/words.json";
import { decks } from "../data/card.json"
import { getRandomInt, setRandomSeed } from "./util";
import { Deck } from "./deck";
import { UrlParamsHandler } from "./ParamsHandler";
import { Modal } from "./Modal";

const urlParamsHandler = new UrlParamsHandler();
const modal = new Modal();
let deck = new Deck(decks[urlParamsHandler.getDeckId()], true, true);
const resetButton = document.getElementById("reset");
const aboutButton = document.getElementById("about");

function drawCardsBasedOnParams(deck) {
    const drawNumber = urlParamsHandler.getDraw();
    for (let index = 0; index < drawNumber; index++) {
        deck.getCardWithoutDrawEvent();
    }
}

function Reset() {
    document.getElementById("cardContainer").innerHTML = "";
    urlParamsHandler.setDraw(0);
    location.reload();
}

function newCardDeck() {
    console.log(this);
    const word = `${words[getRandomInt(words.length)]}${words[getRandomInt(words.length)]}`;
    urlParamsHandler.setCardStack(word);
    updateModal();
    deck = new Deck(decks[urlParamsHandler.getDeckId()], true, true);
    setRandomSeed();
}

function updateModal() {
    const d = decks[urlParamsHandler.getDeckId()];
    modal.setTitle(d.meta.name);
    modal.setText(d.meta.about);
}

function createDropdown() {
    let dropdown = document.createElement("select");
    dropdown.setAttribute("id", "idCardDecks");
    decks.forEach((deck, index) => {
        dropdown.appendChild(createOptionElement(deck, index))
    })
    dropdown.addEventListener("change", (e) => {
        urlParamsHandler.setDeckId(e.target.selectedOptions[0].getAttribute("id"));
        Reset();
    })
    document.getElementById("actionsContainer").append(dropdown)
}

function createOptionElement(deck, index) {
    const option = document.createElement("option");
    if (index == urlParamsHandler.getDeckId()) {
        option.setAttribute("selected", "selected");
    }
    option.setAttribute("id", index);
    option.innerText = deck.meta.name;
    return option;
}


function init() {
    updateModal();
    if (urlParamsHandler.getCardStack() !== null) {
        newCardDeck();
    }

    document.addEventListener("drawCard", (drawPile) => {
        const newDraw = parseInt(urlParamsHandler.getDraw()) + 1;
        console.log(drawPile);
        urlParamsHandler.setDraw(newDraw);
    }, false);


    drawCardsBasedOnParams(deck);

    resetButton.addEventListener("click", () => {
        Reset();
    })
    aboutButton.addEventListener("click", () => {
        modal.show();
    })
    createDropdown();
}


init();