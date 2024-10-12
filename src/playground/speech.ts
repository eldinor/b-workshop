export function wSpeech() {
  console.log("wSpeech start");
  //
  let synth = window.speechSynthesis;
  let rate = 1;
  let pitch = 1;

  let msg = new SpeechSynthesisUtterance("International");
  console.log(synth);
  let voices = synth.getVoices();
  console.log(voices);
  //
}
