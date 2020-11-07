import '../style/card.scss';

export class Card {

    constructor(card, back, flipped) {
        this.text = card.text;
        this.frontClass = card.type;
        this.flipped = flipped ?? false;
        this.back = back;

        let cardDiv = document.createElement("div");
        let front = document.createElement("div");
        let backDiv = document.createElement("div");
        cardDiv.classList = "card";
        front.classList = `side front ${this.frontClass}`;
        backDiv.classList = `side back ${this.back.class}`;
        front.innerText = this.text;
        backDiv.innerText = this.back.text;
        cardDiv.appendChild(front);
        cardDiv.appendChild(backDiv);
        cardDiv.addEventListener("click", () => {
            this.flipCard()
        });
        this.card = cardDiv;
    }
    
    setBack(back) {
        this.back = back;
    }
    
    addToPage() {
        const container = document.getElementById("cardContainer");
        container.appendChild(this.card);
        if (this.flipped) {
            setTimeout(() => this.flipCard(), 100);
        }
    }

    hide () {
        this.card.style = "display: none;";
    }

    flipCard() {
        this.card.classList.toggle("flipped");
        this.flipped = !this.flipped;
    }
}