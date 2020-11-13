import {getRandomInt} from "./util";
import { Card } from "./card";

export class Deck {

    constructor(deck, flip, displayDrawPile) {
        this.deck = deck.front;
        this.back = deck.back;
        this.flip = flip ?? false;
        if (displayDrawPile) {
            this.addInitialCard();
        }
        this.drawEvent = new Event("drawCard");
    }

    addInitialCard() {
        this.drawpile = new Card({type: "drawPile", text: ""}, this.back, false, false);
        this.drawpile.addToPage();
        this.drawpile.card.addEventListener("click", () => {
            this.getCard();
        })
    }

    getCardWithoutDrawEvent() {
        this.getCard(false);
    }

    getCard (countAsDraw = true) {
        if (countAsDraw) {
            document.dispatchEvent(this.drawEvent);
        }
        const i = getRandomInt(this.deck.length);
        const card = this.deck[i];
        this.deck.splice(i,1);
        if(card) {
            new Card(card, this.back, true, this.flip).addToPage();
        }
    }
}