const screenConstraint = navigator.mediaDevices.getSupportedConstraints();

console.log(screenConstraint);

const changeVideoSize = () => {
  stream.getTracks().forEach((track) => {
    const capabilities = track.getCapabilities();
    console.log("CAPABILITIES", capabilities);
  });
};

// changeVideoSize();
