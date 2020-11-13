export class UrlParamsHandler {
    constructor() {
        this.params = new URLSearchParams(location.search);
        this.params.set("deckId", this.params.get("deckId") === null ? 0 : this.params.get("deckId"));
    }

    setDraw(draw) {
        this.params.set("draw", draw);
        this.setUrlParams();
    }

    getDraw() {
        return this.params.get("draw");
    }
    
    setCardStack(cardStack) {
        this.params.set("cardStack", cardStack);
        this.setUrlParams();
    }

    getCardStack() {
        return this.params.get("cardStack");
    }

    setDeckId(deckId) {
        this.params.set("deckId", deckId);
        this.setUrlParams();
    }

    getDeckId() {
        return this.params.get("deckId");
    }

    setUrlParams() {
        window.history.replaceState({}, '', `${location.pathname}?${this.params}`);
    }
}