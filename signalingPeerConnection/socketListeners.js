// on-connection get all the available offers
// call createOfferels and pass all offers
socket.on("availableOffer", (offers) => {
  //   console.log("AVAILABLE OFFERS", offers);

  createOffEls(offers);
});

// when new person made an offer, call createOfferEls and pass offer
socket.on("newOfferAwaiting", (offers) => {
  createOffEls(offers);
});

function createOffEls(offers) {
  const answerEl = document.querySelector("#answer");
  offers.forEach((offer) => {
    console.log("OfferER", offer);
    const newOfferEl = document.createElement("div");
    newOfferEl.addEventListener("click", () => answerOffer(offer));
    newOfferEl.innerHTML = `<button class='btn btn-success col-1'>Anwser ${offer.offererUsername}</button>`;
    answerEl.appendChild(newOfferEl);
  });
}
