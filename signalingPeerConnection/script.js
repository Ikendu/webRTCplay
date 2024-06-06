// const username = "Dav-" + Math.floor(Math.random() * 10000);

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
let didIOffer = false; // boolean for checking offer

// //get user media reusable function
// const fetchUserMedia = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localVideoEl.srcObject = stream;
//       localStream = stream;
//       resolve();
//     } catch (error) {
//       console.log(error);
//       reject();
//     }
//   });
// };

const fetchUserMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoEl.srcObject = stream;
    localStream = stream;
  } catch (error) {
    console.log(error);
  }
};

//when a client initiates a call
const videoCall = async (e) => {
  await fetchUserMedia();
  await createPeerConnection();

  //after creating peer connection
  //create an offer
  try {
    console.log("creating offer....");
    const offer = await peerConnection.createOffer();
    console.log(offer);
    peerConnection.setLocalDescription(offer);

    //sends offer to signalingServer
    socket.emit("newOffer", offer);
    didIOffer = true;
  } catch (err) {
    console.log(err);
  }
};

const answerOffer = async (offerObj) => {
  // console.log("ANSWERER", offer);
  await fetchUserMedia();
  await createPeerConnection(offerObj);
  const answer = await peerConnection.createAnswer({});
  peerConnection.setLocalDescription(answer); // Client2 uses the answer as the local description
  console.log("the answer", answer);
  // add the answer to the offerObj so the server knows which property this is related to
  offerObj.answer = answer;
  // emit the answer to the signallg server so that it can get to Client1
  // socket.emit('newAnswer', offerObj)
  // expect a response from the server with the already exisiting ICE candidate
  const offerIceCandidates = await socket.emitWithAck("newAnswer", offerObj);
};

const addAnswer = async (offerObj) => {
  // addAnswer is call in socketListeners when an ansResponse is emited
  // at this point the offer and the anser have been exchange
  // now Client1 needs to set the remote
  await peerConnection.setRemoteDescription(offerObj.answer);
  console.log("signaling state", peerConnection.signalingState);
};

const createPeerConnection = (offerObj) => {
  return new Promise(async (resolve, reject) => {
    //RTCPeerConnection creates the connection
    //We can pass config object which may contain stun server
    //which will fetch us iceCandidate
    peerConnection = await new RTCPeerConnection(peerConfiguration);
    //getting and adding tracks to the peerConnection
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
    // checker
    peerConnection.addEventListener("signalingstatechange", (e) => {
      console.log(e);
      console.log("signaling state2", peerConnection.signalingState);
    });
    peerConnection.addEventListener("icecandidate", (e) => {
      console.log(".........peer connection found!...........");
      console.log(e);

      //emit the ice candidate of a user
      if (e.candidate) {
        socket.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUsername: username,
          didIOffer,
        });
      }
    });
    if (offerObj) {
      // wont be set when called from call()
      // will be set when called from answerOffer()
      peerConnection.setRemoteDescription(offerObj.offer);
    }
    resolve();
  });
};

const callEl = document
  .querySelector("#call")
  .addEventListener("click", videoCall);
