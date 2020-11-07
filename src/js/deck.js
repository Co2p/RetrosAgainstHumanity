import {getRandomInt} from "./util";
import { Card } from "./card";

export class Deck {

    constructor(deck, flip) {
        this.deck = deck.front;
        this.back = deck.back;
        this.flip = flip ?? false;
    }

    getCard () {
        const i = getRandomInt(this.deck.length);
        const card = this.deck[i];
        this.deck.splice(i,1);
        if(card) {
            if (this.prev) {
                // this.prev.flipCard();
                // this.prev.hide();
            }
            this.prev = new Card(card, this.back, this.flip)
            this.prev.addToPage();
        }
    }
}