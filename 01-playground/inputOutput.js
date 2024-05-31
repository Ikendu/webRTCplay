const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);

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

const changeAudioInput = async (e) => {
  const deviceId = e.target.value;

  const newConstraint = {
    audio: { deviceId: { exact: deviceId } },
    video: true,
  };
  stream = await navigator.mediaDevices.getUserMedia(newConstraint);
  console.log(stream);
  const track = stream.getTracks();
  console.log(track);
};
const changeAudioOutput = async (e) => {};
const changeVideoInput = async (e) => {};

getDevices();
