export class Card {

    constructor(card, flipped) {
        this.text = card.text;
        this.frontClass = card.type;
        this.flipped = flipped ?? false;
        this.addToPage();
    }

    addToPage() {
        const container = document.getElementById("cardContainer");
        let card = document.createElement("div");
        let front = document.createElement("div");
        let back = document.createElement("div");
        card.classList = "card";
        front.classList = `side front ${this.frontClass}`;
        back.classList = "side back bg-black1";
        front.innerText = this.text;
        back.innerText = "Retros Against Humanity";
        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener("click", (event) => {
            this.flipCard()
        });
        this.card = card;
        container.appendChild(card);
        if (this.flipped) {
            setTimeout(() => this.flipCard(), 100);
        }
    }

    flipCard() {
        this.card.classList.toggle("flipped");
        this.flipped = !this.flipped;
    }
}