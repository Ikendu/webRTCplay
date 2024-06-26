const fs = require("fs");
const express = require("express");
const https = require("https");
const app = express();
const socketio = require("socket.io");

//use express to display the static html
app.use(express.static(__dirname));

// we need a key and a cert to run https
// so we make them using mkcert (npm i -g mkcert)
// > mkcert create-ca
// > mkcert create-cert
const cert = fs.readFileSync("cert.crt");
const key = fs.readFileSync("cert.key");

// we changed our express setup so we can use https
// pass the key and cert to createServer securely with https
const expressServer = https.createServer({ cert, key }, app);

// create our socket.io server
const io = socketio(expressServer);

expressServer.listen(5000, () => console.log("runing on port 5000"));

// offer will contain objects{}
const offers = [
  // offerer username
  // offer
  // offerIceCandidates
  // answerer username
  // answer
  // answerIceCandidates
];

const connectedSockets = [
  // username,
  // socketId
];

io.on("connection", (socket) => {
  const username = socket.handshake.auth.username;
  const password = socket.handshake.auth.password;

  // add username and id to connectedSockets
  connectedSockets.push({ username, socketID: socket.id });
  // console.log(connectedSockets);

  // when a new client joins, if there is any offer available emit them to the user
  if (offers.length) {
    socket.emit("availableOffer", offers);
  }

  socket.on("newOffer", (newOffer) => {
    offers.push({
      offererUsername: username,
      offer: newOffer,
      offerIceCandidates: [],
      answererUsername: null,
      answer: null,
      answerIceCandidates: [],
    });

    // sends out all connected sockets EXCPET the caller
    // -1 gives us the most recent offer which is the last offer in the array
    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
  });

  socket.on("newAnswer", (offerObj, ackFunction) => {
    console.log("OFFEROBJ", offerObj);
    // emit the answer (offerObj) back to Client 1
    // in order to that we need Client1 socketID
    const socketToAnswer = connectedSockets.find(
      (skt) => skt.username === offerObj.offererUsername
    );
    if (!socketToAnswer) {
      console.log("No matching socket");
      return;
    }
    // we found the matching socket so we can emit to it
    const socketIdToanswer = socketToAnswer.socketID;
    // we find the offer to update so we can it
    const offerToUpdate = offers.find(
      (offer) => offer.offererUsername === offerObj.offererUsername
    );
    if (!offerToUpdate) {
      console.log("No offerToUpdate");
      return;
    }
    // send back to the answerer all the iceCandidate we have already collected
    ackFunction(offerToUpdate.offerIceCandidates);
    offerToUpdate.answer = offerObj.answer;
    offerToUpdate.answererUsername = username;
    // socket.io has the .to() which allows emitting to a room
    // every socket has its own room
    socket.to(socketIdToanswer).emit("answerResponse", offerToUpdate);
  });

  socket.on("sendIceCandidateToSignalingServer", (iceCandidateObj) => {
    const { iceCandidate, iceUsername, didIOffer } = iceCandidateObj;
    // console.log("iceCandidate", iceCandidate);
    if (didIOffer) {
      //this ice is coming from the offerer, set to the answerer
      const offerInOffers = offers.find(
        (offer) => offer.offererUsername === iceUsername
      );
      if (offerInOffers) {
        offerInOffers.offerIceCandidates.push(iceCandidate);
        // 1. when the answere takes call all existing ice candidates are sent
        // 2. Any candidate that comes in after the offer has been answered will be passed through
        // if the answerer is already here, emit the iceCandidates to the user
        if (offerInOffers.answererUsername) {
          // pass it through to the other socket
          const socketToSendTo = connectedSockets.find(
            (s) => s.username === offerInOffers.answererUsername
          );
          if (socketToSendTo) {
            socket
              .to(socketToSendTo.socketID)
              .emit("recievedIceCandidateFromServer", iceCandidate);
          } else {
            console.log("Ice candidate recieved but could not find answerer");
          }
        }
      }
    } else {
      // this ice is coming from the answerer, sent to the offerer
      // pass it through to the other socket
      const offerInOffers = offers.find(
        (offer) => offer.answererUsername === iceUsername
      );
      const socketToSendTo = connectedSockets.find(
        (s) => s.username === offerInOffers.offererUsername
      );
      if (socketToSendTo) {
        socket
          .to(socketToSendTo.socketID)
          .emit("recievedIceCandidateFromServer", iceCandidate);
      } else {
        console.log("Ice candidate recieved but could not find offerer");
      }
    }
    // console.log("OFFERS", offers);
  });
});
