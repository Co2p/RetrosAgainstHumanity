export class UrlParamsHandler {
    constructor() {
        this.params = new URLSearchParams(location.search);
    }

    setDraw(draw) {
        this.params.set("draw", draw);
        this.setUrlParams();
    }

    getDraw() {
        return Number(this.nullCheck("draw", 0));
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
        return Number(this.nullCheck("deckId", 0));
    }

    nullCheck(param, defaultValue) {
        return this.params.get(param) == null ? defaultValue : this.params.get(param);
    }

    setUrlParams() {
        window.history.replaceState({}, '', `${location.pathname}?${this.params}`);
    }
}