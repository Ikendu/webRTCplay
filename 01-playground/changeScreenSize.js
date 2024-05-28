const screenConstraint = navigator.mediaDevices.getSupportedConstraints();

console.log(screenConstraint);

const changeVideoSize = () => {
  stream.getVideoTracks().forEach((track) => {
    //track is a video track
    // we can get its capabilities with track.getCapabilities()
    //or we can apply new constriants with get applyConstraints
    const height = document.querySelector("#vid-height").value;
    const width = document.querySelector("#vid-width").value;
    const vConstian = {
      height: height,
      width: width,
      // height: { exact: height },
      // width: { ideal: width },
      // frameRate: 5,
      // aspectRatio: 10,
    };
    1;
    track.applyConstraints(vConstian);
  });
  // stream.getTracks().forEach((track) => {
  //   const capabilities = track.getCapabilities();
  //   console.log("CAPABILITIES", capabilities);
  // });
};

// changeVideoSize();
