const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(devices);
  } catch (error) {
    console.log(error);
  }
};

getDevices();
