const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "01a1b9f8-3de3-7059-9bdb-9629ae83d9ce",
};

function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

function deleteDeck(deckID) {
  return fetch(`${baseUrl}/decks/${deckID}`, {
    method: "DELETE",
    headers: headers,
  }).then(processResponse);
}

function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    body: JSON.stringify({ name, color, cards }),
    headers: headers,
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck };
