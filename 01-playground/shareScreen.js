const shareScreen = async () => {
  const options = {
    video: true,
    audio: false,
    surfaceSwitching: "include", //include or exclude
  };

  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
  } catch (error) {
    console.log(error);
  }

  //we dont handle all buttons paths. to do so you need to check the DOM
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "green",
    "green",
    "green",
    "green",
  ]);
};
