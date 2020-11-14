import '../style/card.scss';

export class Card {

    constructor(card, back, flipped) {
        this.text = card.text;
        this.frontClass = card.type;
        this.flipped = flipped ?? false;
        this.back = back;

        let cardDiv = document.createElement("div");
        let frontDiv = document.createElement("div");
        let backDiv = document.createElement("div");
        let removeButtonFront = document.createElement("div");
        let removeButtonBack = document.createElement("div");
        cardDiv.classList = "card";
        removeButtonFront.classList = "remove";
        removeButtonBack.classList = "remove";
        frontDiv.classList = `side front ${this.frontClass}`;
        backDiv.classList = `side back ${this.back.class}`;
        frontDiv.innerText = this.text;
        backDiv.innerText = this.back.text;
        backDiv.appendChild(removeButtonBack);
        frontDiv.appendChild(removeButtonFront);
        cardDiv.appendChild(frontDiv);
        cardDiv.appendChild(backDiv);
        removeButtonBack.addEventListener("click", () => this.hide());
        removeButtonFront.addEventListener("click", () => this.hide());
        this.card = cardDiv;
    }
    
    setBack(back) {
        this.back = back;
    }
    
    addToPage() {
        const container = document.getElementById("cardContainer");
        container.appendChild(this.card);
    }

    hide () {
        this.card.style = "display: none;";
    }

    show () {
        this.card.style = "display: inherit"
    }
}

export class StartCard extends Card {
    constructor(back) {
        super({type: "drawPile", text: ""}, back)
    }
}

class FlippableCard extends Card {
    constructor(card, back) {
        super(card, back);
        this.flipped = false
        this.card.addEventListener("click", () => {
            this.flipCard()
        });
    }

    flipCard() {
        this.card.classList.toggle("flipped");
        this.flipped = !this.flipped;
    }
}

export class FaceDownCard extends FlippableCard {
    constructor(card, back) {
        super(card,back);
        this.flipped = false;
    }

}

export class FaceUpCard extends FlippableCard {
    constructor(card, back) {
        super(card,back);
        this.flipped = true;
    }

    addToPage() {
        const container = document.getElementById("cardContainer");
        container.appendChild(this.card);
        setTimeout(() => this.flipCard(), 100);
    }
}

