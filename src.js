
function AudioHandler() {

    this.hasAudio = true;
    let Ac = window.AudioContext || window.webkitAudioContext;
    this.sampleBuffer = new Float64Array(735);
    this.samplesPerFrame = 735;
  
    if(Ac === undefined) {
      log("Audio disabled: no Web Audio API support");
      this.hasAudio = false;
    } else {
      this.actx = new Ac();
  
      let samples = this.actx.sampleRate / 60;
      this.sampleBuffer = new Float64Array(samples);
      this.samplesPerFrame = samples;
  
      log("Audio initialized, sample rate: " + samples * 60);
  
      this.inputBuffer = new Float64Array(4096);
      this.inputBufferPos = 0;
      this.inputReadPos = 0;
  
      this.scriptNode = undefined;
      this.dummyNode = undefined;
    }
  
    this.resume = function() {
      // for Chrome autoplay policy
      if(this.hasAudio) {
        this.actx.onstatechange = function() { console.log(this.actx.state) };
        this.actx.resume();
      }
    }
  
    this.start = function() {
      if(this.hasAudio) {
  
        this.dummyNode = this.actx.createBufferSource();
        this.dummyNode.buffer = this.actx.createBuffer(1, 44100, 44100);
        this.dummyNode.loop = true;
  
        this.scriptNode = this.actx.createScriptProcessor(2048, 1, 1);
        let that = this;
        this.scriptNode.onaudioprocess = function(e) {
          that.process(e);
        }
  
        this.dummyNode.connect(this.scriptNode);
        this.scriptNode.connect(this.actx.destination);
        this.dummyNode.start();
  
      }
    }
  
    this.stop = function() {
      if(this.hasAudio) {
        if(this.dummyNode) {
          this.dummyNode.stop();
          this.dummyNode.disconnect();
          this.dummyNode = undefined;
        }
        if(this.scriptNode) {
          this.scriptNode.disconnect();
          this.scriptNode = undefined;
        }
        this.inputBufferPos = 0;
        this.inputReadPos = 0;
      }
    }
  
    this.process = function(e) {
      if(this.inputReadPos + 2048 > this.inputBufferPos) {
        // we overran the buffer
        //log("Audio buffer overran");
        this.inputReadPos = this.inputBufferPos - 2048;
      }
      if(this.inputReadPos + 4096 < this.inputBufferPos) {
        // we underran the buffer
        //log("Audio buffer underran");
        this.inputReadPos += 2048;
      }
      let output = e.outputBuffer.getChannelData(0);
      for(let i = 0; i < 2048; i++) {
        output[i] = this.inputBuffer[(this.inputReadPos++) & 0xfff];
      }
    }
  
    this.nextBuffer = function() {
      if(this.hasAudio) {
        for(let i = 0; i < this.samplesPerFrame; i++) {
          let val = this.sampleBuffer[i];
          this.inputBuffer[(this.inputBufferPos++) & 0xfff] = val;
        }
      }
    }
  }

  
let nes = new Nes();
let audioHandler = new AudioHandler();
let paused = false;
let loaded = false;
let pausedInBg = false;
let loopId = 0;
let loadedName = "";

let c = el("output");
c.width = 256;
c.height = 240;
let ctx = c.getContext("2d");
let imgData = ctx.createImageData(256, 240);

let controlsP1 = {
  arrowright: nes.INPUT.RIGHT,
  arrowleft: nes.INPUT.LEFT,
  arrowdown: nes.INPUT.DOWN,
  arrowup: nes.INPUT.UP,
  enter: nes.INPUT.START,
  shift: nes.INPUT.SELECT,
  a: nes.INPUT.B,
  z: nes.INPUT.A
}
let controlsP2 = {
  l: nes.INPUT.RIGHT,
  j: nes.INPUT.LEFT,
  k: nes.INPUT.DOWN,
  i: nes.INPUT.UP,
  p: nes.INPUT.START,
  o: nes.INPUT.SELECT,
  t: nes.INPUT.B,
  g: nes.INPUT.A
}

zip.workerScriptsPath = "/";
zip.useWebWorkers = false;

el("rom").onchange = function(e) {
  audioHandler.resume();
  let freader = new FileReader();
  freader.onload = function() {
    let buf = freader.result;
    if(e.target.files[0].name.slice(-4) === ".zip") {
      // use zip.js to read the zip
      let blob = new Blob([buf]);
      zip.createReader(new zip.BlobReader(blob), function(reader) {
        reader.getEntries(function(entries) {
          if(entries.length) {
            let found = false;
            for(let i = 0; i < entries.length; i++) {
              let name = entries[i].filename;
              if(name.slice(-4) !== ".nes" && name.slice(-4) !== ".NES") {
                continue;
              }
              found = true;
              log("Loaded \"" + name + "\" from zip");
              entries[i].getData(new zip.BlobWriter(), function(blob) {
                let breader = new FileReader();
                breader.onload = function() {
                  let rbuf = breader.result;
                  let arr = new Uint8Array(rbuf);
                  loadRom(arr, name);
                  reader.close(function() {});
                }
                breader.readAsArrayBuffer(blob);
              }, function(curr, total) {});
              break;
            }
            if(!found) {
              log("No .nes file found in zip");
            }
          } else {
            log("Zip file was empty");
          }
        });
      }, function(err) {
        log("Failed to read zip: " + err);
      });
    } else {
      // load rom normally
      let parts = e.target.value.split("\\");
      let name = parts[parts.length - 1];
      let arr = new Uint8Array(buf);
      loadRom(arr, name);
    }
  }
  freader.readAsArrayBuffer(e.target.files[0]);
}

el("pause").onclick = function(e) {
  if(paused && loaded) {
    loopId = requestAnimationFrame(update);
    audioHandler.start();
    paused = false;
    el("pause").innerText = "Pause";
  } else {
    cancelAnimationFrame(loopId);
    audioHandler.stop();
    paused = true;
    el("pause").innerText = "Unpause";
  }
}

el("reset").onclick = function(e) {
  nes.reset(false);
}

el("hardreset").onclick = function(e) {
  nes.reset(true);
}

el("runframe").onclick = function(e) {
  if(loaded) {
    runFrame();
  }
}

document.onvisibilitychange = function(e) {
  if(document.hidden) {
    pausedInBg = false;
    if(!paused && loaded) {
      el("pause").click();
      pausedInBg = true;
    }
  } else {
    if(pausedInBg && loaded) {
      el("pause").click();
      pausedInBg = false;
    }
  }
}

window.onpagehide = function(e) {
  saveBatteryForRom();
}

function loadRom(rom, name) {
  saveBatteryForRom();
  if(nes.loadRom(rom)) {
    // load the roms battery data
    let data = localStorage.getItem(name + "_battery");
    if(data) {
      let obj = JSON.parse(data);
      nes.setBattery(obj);
      log("Loaded battery");
    }
    nes.reset(true);
    if(!loaded && !paused) {
      loopId = requestAnimationFrame(update);
      audioHandler.start();
    }
    loaded = true;
    loadedName = name;
  }
}

function saveBatteryForRom() {
  // save the loadedName's battery data
  if(loaded) {
    let data = nes.getBattery();
    if(data) {
      try {
        localStorage.setItem(loadedName + "_battery", JSON.stringify(data));
        log("Saved battery");
      } catch(e) {
        log("Failed to save battery: " + e);
      }
    }
  }
}

function update() {
  runFrame();
  loopId = requestAnimationFrame(update);
}

function runFrame() {
  nes.runFrame();
  nes.getSamples(audioHandler.sampleBuffer, audioHandler.samplesPerFrame);
  audioHandler.nextBuffer();
  nes.getPixels(imgData.data);
  ctx.putImageData(imgData, 0, 0);
}

function log(text) {
  el("log").innerHTML += text + "<br>";
  el("log").scrollTop = el("log").scrollHeight;
}

function el(id) {
  return document.getElementById(id);
}

window.onkeydown = function(e) {
  if(controlsP1[e.key.toLowerCase()] !== undefined) {
    nes.setButtonPressed(1, controlsP1[e.key.toLowerCase()]);
    e.preventDefault();
  }
  if(controlsP2[e.key.toLowerCase()] !== undefined) {
    nes.setButtonPressed(2, controlsP2[e.key.toLowerCase()]);
    e.preventDefault();
  }
}

window.onkeyup = function(e) {
  if(controlsP1[e.key.toLowerCase()] !== undefined) {
    nes.setButtonReleased(1, controlsP1[e.key.toLowerCase()]);
    e.preventDefault();
  }
  if(controlsP2[e.key.toLowerCase()] !== undefined) {
    nes.setButtonReleased(2, controlsP2[e.key.toLowerCase()]);
    e.preventDefault();
  }
  if(e.key.toLowerCase() === "m" && loaded) {
    let saveState = nes.getState();
    try {
      localStorage.setItem(loadedName + "_savestate", JSON.stringify(saveState));
      log("Saved state");
    } catch(e) {
      log("Failed to save state: " + e);
    }
  }
  if(e.key.toLowerCase() === "n" && loaded) {
    let data = localStorage.getItem(loadedName + "_savestate");
    if(data) {
      let obj = JSON.parse(data);
      if(nes.setState(obj)) {
        log("Loaded state");
      } else {
        log("Failed to load state");
      }
    } else {
      log("No state saved yet");
    }
  }
}
