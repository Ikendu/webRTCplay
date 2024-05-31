let mediaRecorder;
let recordedBlobs;

const startRecording = (e) => {
  //change to mediaStream during screen capture
  if (!stream) {
    alert("No ongoing stream to record");
    return;
  }
  console.log("Start Recording");

  recordedBlobs = []; //an array to hold the blob for playback

  //change to mediaStream during screen capture
  mediaRecorder = new MediaRecorder(stream); //make a media recorder from the constructor

  mediaRecorder.ondataavailable = (e) => {
    //   ondataavailable will run when the stream ends of stops or we spcifically ask for it
    console.log("Data is available for media recorder");
    recordedBlobs.push(e.data);
  };
  mediaRecorder.start();
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "blue",
    "grey",
    "blue",
  ]);
};

const stopRecording = (e) => {
  if (!mediaRecorder) {
    alert("No ongoing recording to stop");
  }
  console.log("Stop Recording");
  mediaRecorder.stop();
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "green",
    "blue",
    "blue",
  ]);
};

const playRecording = (e) => {
  console.log("Play Recording");
  const superBuffer = new Blob(recordedBlobs);
  const recordedVideoEl = document.querySelector("#other-video");
  recordedVideoEl.src = window.URL.createObjectURL(superBuffer);
  recordedVideoEl.controls = true; // for playing, pausing and stopping the video
  recordedVideoEl.play();
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "green",
    "green",
    "blue",
  ]);
};
