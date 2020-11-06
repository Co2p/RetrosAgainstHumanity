import {getRandomInt} from "./util";
import { Card } from "./card";

export class Deck {

    constructor(deck, flip) {
        this.deck = deck;
        this.flip = flip ?? false;
    }

    getCard () {
        const i = getRandomInt(this.deck.length);
        const card = this.deck[i];
        this.deck.splice(i,1);
        if(card) {
            new Card(card, this.flip)
        }
    }
}