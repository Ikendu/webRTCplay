const videoEl = document.querySelector("#my-video");

let stream = null; //initial stream variable that can be used anywhere

const constraints = {
  audio: true, //use your headphones or be perpared for feedback
  video: true,
};

const getMicAndCamera = async (e) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
  } catch {
    //user denies access to constraints
    console.log("User reject constraints");
  }
};

const showMyFeed = () => {
  videoEl.srcObject = stream; //this will set our midia stream (stream) to our <video/> tag
  const tracks = stream.getTracks();
  console.log("Tracks", tracks);
};

const stopMyFeed = (e) => {
  const tracks = stream.getTracks();
  tracks.forEach((track, idx) => {
    console.log("Track", idx, track);
    track.stop();
  });
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
