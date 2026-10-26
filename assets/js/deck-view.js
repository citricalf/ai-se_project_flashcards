import { hexToString, removeColorClasses } from "./colors.js";

function renderDeckView(deck) {
  document.querySelector(".page").classList.remove("page_no-mobile-bar");
  const deckViewSection = document.querySelector("#deck-view");
  const deckTitle = deckViewSection.querySelector(".gallery__title");
  const deckContainer = deckViewSection.querySelector(".gallery__list");
  const practiceButton = deckViewSection.querySelector(
    ".gallery__practice-btn",
  );
  const cardTemplate = document.querySelector("#card-template");

  deckTitle.textContent = deck.name;
  deckContainer.innerHTML = "";
  practiceButton.disabled = deck.cards.length === 0;

  deck.cards.forEach((card) => {
    const cardElement = cardTemplate.content
      .querySelector("li")
      .cloneNode(true);
    const cardTitle = cardElement.querySelector(".card__title");
    const flipButton = cardElement.querySelector(".card__flip-btn");
    const deleteButton = cardElement.querySelector(".card__delete-btn");
    const deckColor = hexToString(deck.color);
    let showingQuestion = true;

    cardTitle.textContent = card.question;
    removeColorClasses(cardElement);
    cardElement.classList.add(`card_color_${deckColor}`);

    flipButton.onclick = () => {
      showingQuestion = !showingQuestion;
      cardTitle.textContent = showingQuestion ? card.question : card.answer;
      removeColorClasses(cardElement);
      cardElement.classList.add(
        showingQuestion ? `card_color_${deckColor}` : "card_color_white",
      );
      flipButton.setAttribute(
        "aria-label",
        showingQuestion ? "Show answer" : "Show question",
      );
    };

    deleteButton.onclick = () => {
      deck.cards.splice(deck.cards.indexOf(card), 1);
      cardElement.remove();
      practiceButton.disabled = deck.cards.length === 0;
    };

    deckContainer.append(cardElement);
  });
}

export { renderDeckView };
