const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);

    //get all the available devices
    devices.forEach((device) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.text = device.label;
      if (device.kind === "audioinput") {
        audioInputEl.appendChild(option);
      } else if (device.kind === "audiooutput") {
        audioOutputEl.appendChild(option);
      } else if (device.kind === "videoinput") {
        videoInputEl.appendChild(option);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get the audio input devices
const changeAudioInput = async (e) => {
  const deviceId = e.target.value;
  const newConstraint = {
    audio: { deviceId: { exact: deviceId } },
    video: true,
  };
  stream = await navigator.mediaDevices.getUserMedia(newConstraint);
  console.log(stream);
  const track = stream.getAudioTracks();
  console.log("Tracks", track);
};
//get the audio output devices
const changeAudioOutput = async (e) => {
  const deviceId = e.target.value;
  await videoEl.setSinkId(deviceId);
};

//get the video input devices
const changeVideoInput = async (e) => {
  const deviceId = e.target.value;
  const newConstraint = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  stream = await navigator.mediaDevices.getUserMedia(newConstraint);
  console.log(stream);
  const track = stream.getVideoTracks();
  console.log("Tracks", track);
};

getDevices();
