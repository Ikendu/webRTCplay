const localVideoEl = document.querySelector("#local-video");
const remoteVideo = document.querySelector("#remote-video");

let localStream;
let remoteStream;
let peerConnection;

const videoCall = async (e) => {
  const stream = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localVideoEl.srcObject = stream;
};

const callEl = document
  .querySelector("#call")
  .addEventListener("click", videoCall);
