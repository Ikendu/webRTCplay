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

io.on("connection", (socket) => {
  const username = socket.handshake.auth.username;
  const password = socket.handshake.auth.password;
  console.log(username, password);
  socket.on("newOffer", (newOffer) => {});
});
