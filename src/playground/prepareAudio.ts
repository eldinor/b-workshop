import { Engine, Scene, Sound } from "@babylonjs/core";

export function prepareAudio(scene: Scene) {
  console.log(Engine.audioEngine);

  const radioSound = new Sound(
    "gunshot",
    "sound/fromsponsors_plus.mp3",
    scene,
    () => {
      // Sound has been downloaded & decoded
    },
    {
      spatialSound: true,
      loop: true,
      maxDistance: 11,
      // distanceModel: "linea",
      //  rolloffFactor: 0.5,
    }
  );
  const morseSound = new Sound(
    "morse",
    "sound/morse.mp3",
    scene,
    () => {
      // Sound has been downloaded & decoded
    },
    {
      spatialSound: true,
      loop: true,
      maxDistance: 11,
      //  distanceModel: "exponential",
    }
  );
  //
  const lightSwitchSound = new Sound(
    "lightSwitch",
    "sound/218115__mastersdisaster__switch-on-livingroom.wav",
    scene,
    () => {
      // Sound has been downloaded & decoded
    }
  );
  //

  // Unlock audio on first user interaction.
  window.addEventListener(
    "click",
    () => {
      if (!Engine.audioEngine!.unlocked) {
        Engine.audioEngine!.unlock();
        console.log(Engine.audioEngine);
      }
      document.getElementById("info")!.style.display = "none";
    },
    { once: true }
  );

  return [radioSound, morseSound, lightSwitchSound];
}
