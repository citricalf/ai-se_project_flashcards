const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "01a1b9f8-3de3-7059-9bdb-9629ae83d9ce",
};

/**
 * Parses a successful API response as JSON or rejects with its HTTP status.
 *
 * @param {Response} res - The response returned by fetch
 * @returns {Promise<any>} The parsed response body
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Retrieves all decks from the API.
 *
 * @returns {Promise<Object[]>} The decks returned by the API
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Deletes a deck from the API.
 *
 * @param {string} deckID - The unique identifier of the deck to delete
 * @returns {Promise<any>} The parsed API response
 */
function deleteDeck(deckID) {
  return fetch(`${baseUrl}/decks/${deckID}`, {
    method: "DELETE",
    headers: headers,
  }).then(processResponse);
}

/**
 * Creates a deck through the API.
 *
 * @param {{name: string, color: string, cards: Object[]}} deck - The deck data to create
 * @returns {Promise<Object>} The created deck returned by the API
 */
function addDeck({ name, color, cards }) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    body: JSON.stringify({ name, color, cards }),
    headers: headers,
  }).then(processResponse);
}

export { getDecks, deleteDeck, addDeck };
