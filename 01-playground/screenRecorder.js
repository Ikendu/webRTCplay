let mediaRecorder;
let recordedBlobs;

const startRecording = (e) => {
  console.log("Start Recording");

  recordedBlobs = []; //an array to hold the blob for playback

  mediaRecorder = new MediaRecorder(stream); //make a media recorder from the constructor

  mediaRecorder.ondataavailable = (e) => {
    //   ondataavailable will run when the stream ends of stops or we spcifically ask for it
    console.log("Data is available for media recorder");
    recordedBlobs.push(e.data);
  };
  mediaRecorder.start();
};

const stopRecording = (e) => {
  console.log("Stop Recording");
  mediaRecorder.stop();
};

const playRecording = (e) => {
  console.log("Play Recording");
  const superBuffer = new Blob(recordedBlobs);
  const recordedVideoEl = document.querySelector("#other-video");
  recordedVideoEl.src = window.URL.createObjectURL(superBuffer);
};
