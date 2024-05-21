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

const share = document
  .querySelector("#share")
  .addEventListener("click", (e) => getMicAndCamera(e));
