let audio;
exports.play = (stream) => {
  const url = stream;
  audio = new Audio(url);
  audio.play();
};

exports.stop = () => {
  audio.stop();
};
