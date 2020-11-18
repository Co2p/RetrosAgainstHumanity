export class Modal {
    constructor(title, text, classNames) {
        this.title = title;
        this.text = text;
        this.classNames = classNames;
        this.buildModal();
    }

    buildModal() {
        const container = document.getElementById("modalContainer");
        const modalDiv = document.createElement("div");
        const titleH1 = document.createElement("h1");
        const textDiv = document.createElement("div");
        const okButton = document.createElement("a");
        titleH1.innerHTML = this.title;
        textDiv.innerHTML = this.text;
        okButton.classList = "okbutton";
        okButton.innerText = "Ok";
        okButton.addEventListener("click", () => this.hide())
        modalDiv.classList = `modal hidden ${this.classNames}`;
        modalDiv.appendChild(titleH1);
        modalDiv.appendChild(textDiv);
        modalDiv.appendChild(okButton);
        this.titleH1 = titleH1;
        this.textDiv = textDiv;
        this.modal = modalDiv;
        container.appendChild(modalDiv);
    }

    setText(text) {
        this.text = text;
        this.textDiv.innerHTML = this.text;
    }

    setTitle(title) {
        this.title = title;
        this.titleH1.innerHTML = this.title;
    }

    show() {
        this.modal.classList.remove("hidden");
    }

    hide() {
        this.modal.classList.add("hidden");
    }

}