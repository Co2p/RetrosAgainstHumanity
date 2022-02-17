import {getRandomInt} from "./util";
import { StartCard, FaceDownCard, FaceUpCard } from "./card";

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
        this.drawpile = new StartCard(this.back, );
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
            if (this.flip) {
                new FaceUpCard(card, this.back).addToPage();
            }
            else {
                new FaceDownCard(card, this.back).addToPage();
            }
        }
    }
}