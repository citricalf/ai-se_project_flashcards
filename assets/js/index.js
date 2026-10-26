import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";
import { renderDeckView } from "./deck-view.js";

const homeSection = document.querySelector("#home");
const deckViewSection = document.querySelector("#deck-view");
const carouselSection = document.querySelector("#carousel");
const notFoundSection = document.querySelector("#not-found");
const pageElement = document.querySelector(".page");
const mainContent = document.querySelector(".page__main-content");
const practiceButton = deckViewSection.querySelector(".gallery__practice-btn");
let currentDeck = null;

practiceButton.addEventListener("click", () => {
  if (currentDeck) {
    window.location.hash = `#carousel/${currentDeck.id}`;
  }
});

function renderHomeView() {
  const deckTemplateEl = document.querySelector("#deck-template");
  const deckContainerEl = homeSection.querySelector(".gallery__list");
  deckContainerEl.innerHTML = "";

  function createDeckEl(item) {
    const cloneEl = deckTemplateEl.content.querySelector("li").cloneNode(true);

    const deckTitleEl = cloneEl.querySelector(".card__title");
    deckTitleEl.textContent = item.name;

    removeColorClasses(cloneEl);

    const deckColorEl = hexToString(item.color);
    cloneEl.classList.add(`card_color_${deckColorEl}`);

    const deckCountEl = cloneEl.querySelector(".card__count");
    deckCountEl.textContent = `${item.cards.length} cards`;

    const deckLinkEl = cloneEl.querySelector(".card__link");
    deckLinkEl.href = `#deck/${item.id}`;
    deckLinkEl.addEventListener("click", () => {
      currentDeck = item;
    });

    const deleteDeck = cloneEl.querySelector(".card__delete-btn");
    deleteDeck.addEventListener("click", () => {
      cloneEl.remove();
    });

    return cloneEl;
  }

  function renderDeckEl(item) {
    const cloneEl = createDeckEl(item);
    deckContainerEl.prepend(cloneEl);
  }

  decks.forEach(renderDeckEl);
}

function renderNotFoundView() {
  pageElement.classList.add("page_no-mobile-bar");
  notFoundSection.style.display = "flex";
}

function router() {
  const hash = window.location.hash.slice(1) || "home";
  const routeMatch = hash.match(/^(deck|carousel)\/([^/]+)$/);

  if (hash === "home" || hash === "") {
    pageElement.classList.remove("page_no-mobile-bar");
    mainContent.classList.remove("page__main-content_location_carousel");
    homeSection.style.display = "block";
    deckViewSection.style.display = "none";
    carouselSection.style.display = "none";
    notFoundSection.style.display = "none";
    renderHomeView();
  } else if (routeMatch) {
    const [, route, deckID] = routeMatch;
    const deck = getDeckByID(deckID);

    if (!deck) {
      homeSection.style.display = "none";
      deckViewSection.style.display = "none";
      carouselSection.style.display = "none";
      renderNotFoundView();
      mainContent.classList.remove("page__main-content_location_carousel");
      return;
    }

    currentDeck = deck;
    notFoundSection.style.display = "none";

    if (route === "deck") {
      pageElement.classList.remove("page_no-mobile-bar");
      mainContent.classList.remove("page__main-content_location_carousel");
      homeSection.style.display = "none";
      deckViewSection.style.display = "block";
      carouselSection.style.display = "none";
      renderDeckView(deck);
    } else {
      pageElement.classList.add("page_no-mobile-bar");
      mainContent.classList.add("page__main-content_location_carousel");
      homeSection.style.display = "none";
      deckViewSection.style.display = "none";
      carouselSection.style.display = "flex";
      renderCarouselView(deck);
    }
  } else {
    homeSection.style.display = "none";
    deckViewSection.style.display = "none";
    carouselSection.style.display = "none";
    mainContent.classList.remove("page__main-content_location_carousel");
    renderNotFoundView();
  }
}

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);
