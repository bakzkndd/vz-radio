let audio;
exports.play = (stream, volume) => {
  const url = stream;
  audio = new Audio(url);
  audio.volume = volume / 100
  audio.play();
};

exports.stop = () => {
  if(!audio) return
  audio.pause();
  audio.currentTime = 0;
  audio.src = "";
};
