let audio;
exports.play = (stream, volume) => {
  const url = stream;
  audio = new Audio(url);
  audio.volume = volume / 100
  audio.play();
};

exports.stop = () => {
  audio.pause();
  audio.currentTime = 0;
  audio.src = "";
};
