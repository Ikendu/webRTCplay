const username = prompt("Enter your name here");
const password = prompt("Enter password");

document.querySelector("#user-name").innerHTML = username;

const socket = io.connect("https://localhost:5000", {
  auth: {
    username,
    password,
  },
});

const localVideoEl = document.querySelector("#local-video");
const remoteVideo = document.querySelector("#remote-video");

let localStream; // for holding the local video streal
let remoteStream; //  for holding the remote video stream
let peerConnection; //  the connection that the two client use to talk

//when a client initiates a call
const videoCall = async (e) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localVideoEl.srcObject = stream;

  localStream = stream;

  await createPeerConnection();

  //after creating peer connection
  //ctreate an offer
  try {
    console.log("creating offer....");
    const offer = await peerConnection.createOffer();
    console.log(offer);
    peerConnection.setLocalDescription(offer);
    socket.emit("newOffer", offer); //sends offer to signalingServer
  } catch (err) {
    console.log(err);
  }
};

const createPeerConnection = () => {
  return new Promise(async (resolve, reject) => {
    //RTCPeerConnection creates the connection
    //We can pass config object which may contain stun server
    //which will fetch us iceCandidate
    peerConnection = await new RTCPeerConnection(peerConfiguration);
    //getting and adding tracks to the peerConnection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
    peerConnection.addEventListener("icecandidate", (e) => {
      console.log(".........peer connection found!...........");
      console.log(e);
    });
    resolve();
  });
};

const callEl = document
  .querySelector("#call")
  .addEventListener("click", videoCall);
