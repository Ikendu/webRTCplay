const videoEl = document.querySelector("#my-video");

let stream = null; //init stream variable that can be used anywhere
let mediaStream = null; //init stream variable for sharing of screens

const constraints = {
  audio: true, //use your headphones or be perpared for feedback
  video: true,
};

const getMicAndCamera = async (e) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
    changeButtons([
      "green",
      "blue",
      "blue",
      "grey",
      "grey",
      "grey",
      "grey",
      "grey",
    ]);
  } catch {
    //user denies access to constraints
    console.log("User reject constraints");
  }
};

const showMyFeed = () => {
  if (!stream) {
    alert("stream is loading...");
    return;
  }
  videoEl.srcObject = stream; //this will set our midia stream (stream) to our <video/> tag
  const tracks = stream.getTracks();
  console.log("Tracks", tracks);
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "blue",
    "grey",
    "grey",
    "blue",
  ]);
};

const stopMyFeed = (e) => {
  if (!stream) {
    alert("stream is loading...");
    return;
  }
  const tracks = stream.getTracks();
  tracks.forEach((track, idx) => {
    console.log("Track", idx, track);
    track.stop();
  });
  changeButtons([
    "green",
    "blue",
    "blue",
    "grey",
    "grey",
    "grey",
    "grey",
    "grey",
  ]);
};

const share = document
  .querySelector("#share")
  .addEventListener("click", (e) => getMicAndCamera(e));

const showVideo = document
  .querySelector("#show-video")
  .addEventListener("click", (e) => showMyFeed(e));

const stopVideo = document
  .querySelector("#stop-video")
  .addEventListener("click", (e) => stopMyFeed(e));

const changSize = document
  .querySelector("#change-size")
  .addEventListener("click", (e) => changeVideoSize(e));

const startRec = document
  .querySelector("#start-record")
  .addEventListener("click", (e) => startRecording(e));

const stopRec = document
  .querySelector("#stop-record")
  .addEventListener("click", (e) => stopRecording(e));

const playRec = document
  .querySelector("#play-record")
  .addEventListener("click", (e) => playRecording(e));

document
  .querySelector("#share-screen")
  .addEventListener("click", (e) => shareScreen(e));

document
  .querySelector("#audio-input")
  .addEventListener("change", (e) => changeAudioInput(e));

document
  .querySelector("#audio-output")
  .addEventListener("change", (e) => changeAudioOutput(e));

document
  .querySelector("#video-input")
  .addEventListener("change", (e) => changeVideoInput(e));