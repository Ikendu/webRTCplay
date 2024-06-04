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

//create our socket.io server
const io = socketio(expressServer);

expressServer.listen(5000, () => console.log("runing on port 5000"));

const offers = [
  // offerer username
  // offer
  // offerIceCandidates
  // answerer username
  // answer
  // answerIceCandidates
];

const connectedSockets = [
  // username, socketId
];

io.on("connection", (socket) => {
  const username = socket.handshake.auth.username;
  const password = socket.handshake.auth.password;

  connectedSockets.push({ username, socketID: socket.id });
  console.log(connectedSockets);

  socket.on("newOffer", (newOffer) => {
    offers.push({
      offererUsername: username,
      offer: newOffer,
      offerIceCandidates: [],
      answererUsername: null,
      answer: null,
      answerIceCandidates: [],
    });
    console.log(newOffer);

    // sends out all connected sockets EXCPET the caller
    // -1 gives us the most recent offer which is the last offer in the array
    socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
  });
});
