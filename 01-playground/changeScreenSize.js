const screenConstraint = navigator.mediaDevices.getSupportedConstraints();

console.log(screenConstraint);

const changeVideoSize = () => {
  streams.getVideoTracks().forEach((track) => {
    //track is a video track
    // we can get its capabilities with track.getCapabilities
    //or we can apply new constriants with get applyConstriants
  });
  // stream.getTracks().forEach((track) => {
  //   const capabilities = track.getCapabilities();
  //   console.log("CAPABILITIES", capabilities);
  // });
};

// changeVideoSize();
