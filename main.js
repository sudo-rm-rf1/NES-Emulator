

function Apu(nes) {




  
    this.nes = nes;
  
  
  
  
    
    this.dutyCycles = [
  
      [0, 1, 0, 0, 0, 0, 0, 0],
  
      [0, 1, 1, 0, 0, 0, 0, 0],
  
      [0, 1, 1, 1, 1, 0, 0, 0],
  
      [1, 0, 0, 1, 1, 1, 1, 1]
  
    ];
  
  
    
    this.lengthLoadValues = [
  
      10, 254, 20, 2,  40, 4,  80, 6,  160, 8,  60, 10, 14, 12, 26, 14,
  
      12, 16,  24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30
  
    ];
  
  
    
    this.triangleSteps = [
  
      15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5,  4,  3,  2,  1,  0,
  
      0,  1,  2,  3,  4,  5,  6, 7, 8, 9, 10, 11, 12, 13, 14, 15
  
    ];
  
  
    
    this.noiseLoadValues = [
  
      4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068
  
    ];
  
  
    
    this.dmcLoadValues = [
  
      428, 380, 340, 320, 286, 254, 226, 214, 190, 160, 142, 128, 106, 84, 72, 54
  
    ]
  
  
  
  
    
    this.output = new Float64Array(29781);
  
  
  
    this.reset = function() {
  
      for(let i = 0; i < this.output.length; i++) {
  
        this.output[i] = 0;
  
      }
  
  
  
      this.outputOffset = 0;
  
  
  
      this.frameCounter = 0;
  
  
  
      this.interruptInhibit = false;
  
      this.step5Mode = false;
  
  
  
      this.enableNoise = false;
  
      this.enableTriangle = false;
  
      this.enablePulse2 = false;
  
      this.enablePulse1 = false;
  
  
  
  
      
      this.p1Timer = 0;
  
      this.p1TimerValue = 0;
  
      this.p1Duty = 0;
  
      this.p1DutyIndex = 0;
  
      this.p1Output = 0;
  
      this.p1CounterHalt = false;
  
      this.p1Counter = 0;
  
      this.p1Volume = 0;
  
      this.p1ConstantVolume = false;
  
      this.p1Decay = 0;
  
      this.p1EnvelopeCounter = 0;
  
      this.p1EnvelopeStart = false;
  
      this.p1SweepEnabled = false;
  
      this.p1SweepPeriod = 0;
  
      this.p1SweepNegate = false;
  
      this.p1SweepShift = 0;
  
      this.p1SweepTimer = 0;
  
      this.p1SweepTarget = 0;
  
      this.p1SweepMuting = true;
  
      this.p1SweepReload = false;
  
  
  
  
      
      this.p2Timer = 0;
  
      this.p2TimerValue = 0;
  
      this.p2Duty = 0;
  
      this.p2DutyIndex = 0;
  
      this.p2Output = 0;
  
      this.p2CounterHalt = false;
  
      this.p2Counter = 0;
  
      this.p2Volume = 0;
  
      this.p2ConstantVolume = false;
  
      this.p2Decay = 0;
  
      this.p2EnvelopeCounter = 0;
  
      this.p2EnvelopeStart = false;
  
      this.p2SweepEnabled = false;
  
      this.p2SweepPeriod = 0;
  
      this.p2SweepNegate = false;
  
      this.p2SweepShift = 0;
  
      this.p2SweepTimer = 0;
  
      this.p2SweepTarget = 0;
  
      this.p2SweepMuting = true;
  
      this.p2SweepReload = false;
  
  
  
  
      
      this.triTimer = 0;
  
      this.triTimerValue = 0;
  
      this.triStepIndex = 0;
  
      this.triOutput = 0;
  
      this.triCounterHalt = false;
  
      this.triCounter = 0;
  
      this.triLinearCounter = 0;
  
      this.triReloadLinear = false;
  
      this.triLinearReload = 0;
  
  
  
  
      
      this.noiseTimer = 0;
  
      this.noiseTimerValue = 0;
  
      this.noiseShift = 1;
  
      this.noiseTonal = false;
  
      this.noiseOutput = 0;
  
      this.noiseCounterHalt = false;
  
      this.noiseCounter = 0;
  
      this.noiseVolume = 0;
  
      this.noiseConstantVolume = false;
  
      this.noiseDecay = 0;
  
      this.noiseEnvelopeCounter = 0;
  
      this.noiseEnvelopeStart = false;
  
  
  
  
      
      this.dmcInterrupt = false;
  
      this.dmcLoop = false;
  
      this.dmcTimer = 0;
  
      this.dmcTimerValue = 0;
  
      this.dmcOutput = 0;
  
      this.dmcSampleAddress = 0xc000;
  
      this.dmcAddress = 0xc000;
  
      this.dmcSample = 0;
  
      this.dmcSampleLength = 0;
  
      this.dmcSampleEmpty = true;
  
      this.dmcBytesLeft = 0;
  
      this.dmcShifter = 0;
  
      this.dmcBitsLeft = 8;
  
      this.dmcSilent = true;
  
  
  
  }
  
    this.reset();
  
    this.saveVars = [
  
      "frameCounter", "interruptInhibit", "step5Mode", "enableNoise",
  
      "enableTriangle", "enablePulse2", "enablePulse1", "p1Timer", "p1TimerValue",
  
      "p1Duty", "p1DutyIndex", "p1Output", "p1CounterHalt", "p1Counter",
  
      "p1Volume", "p1ConstantVolume", "p1Decay", "p1EnvelopeCounter",
  
      "p1EnvelopeStart", "p1SweepEnabled", "p1SweepPeriod", "p1SweepNegate",
  
      "p1SweepShift", "p1SweepTimer", "p1SweepTarget", "p1SweepMuting",
  
      "p1SweepReload", "p2Timer", "p2TimerValue", "p2Duty", "p2DutyIndex",
  
      "p2Output", "p2CounterHalt", "p2Counter", "p2Volume", "p2ConstantVolume",
  
      "p2Decay", "p2EnvelopeCounter", "p2EnvelopeStart", "p2SweepEnabled",
  
      "p2SweepPeriod", "p2SweepNegate", "p2SweepShift", "p2SweepTimer",
  
      "p2SweepTarget", "p2SweepMuting", "p2SweepReload", "triTimer",
  
      "triTimerValue", "triStepIndex", "triOutput", "triCounterHalt",
  
      "triCounter", "triLinearCounter", "triReloadLinear", "triLinearReload",
  
      "noiseTimer", "noiseTimerValue", "noiseShift", "noiseTonal", "noiseOutput",
  
      "noiseCounterHalt", "noiseCounter", "noiseVolume", "noiseConstantVolume",
  
      "noiseDecay", "noiseEnvelopeCounter", "noiseEnvelopeStart", "dmcInterrupt",
  
      "dmcLoop", "dmcTimer", "dmcTimerValue", "dmcOutput", "dmcSampleAddress",
  
      "dmcAddress", "dmcSample", "dmcSampleLength", "dmcSampleEmpty",
  
      "dmcBytesLeft", "dmcShifter", "dmcBitsLeft", "dmcSilent"
  
    ];
  
  
  
    this.cycle = function() {
  
      if(
  
        (this.frameCounter === 29830 && !this.step5Mode) ||
  
        this.frameCounter === 37282
  
      ) {
  
        this.frameCounter = 0;
  
      }
  
      this.frameCounter++;
  
  
  
      this.handleFrameCounter();
  
  
  
      this.cycleTriangle();
  
      this.cyclePulse1();
  
      this.cyclePulse2();
  
      this.cycleNoise();
  
      this.cycleDmc();
  
  
  
      this.output[this.outputOffset++] = this.mix();
  
      if(this.outputOffset === 29781) {
  
        // if we are going past the buffer (too many apu cycles per frame)
  
        this.outputOffset = 29780;
  
      }
  
  }
  
  
  
    this.cyclePulse1 = function() {
  
      if(this.p1TimerValue !== 0) {
  
        this.p1TimerValue--;
  
      } else {
  
        this.p1TimerValue = (this.p1Timer * 2) + 1;
  
        this.p1DutyIndex++;
  
        this.p1DutyIndex &= 0x7;
  
      }
  
      let output = this.dutyCycles[this.p1Duty][this.p1DutyIndex];
  
      if(output === 0 || this.p1SweepMuting || this.p1Counter === 0) {
  
        this.p1Output = 0;
  
      } else {
  
        this.p1Output = this.p1ConstantVolume ? this.p1Volume : this.p1Decay;
  
      }
  
  }
  
  
  
    this.cyclePulse2 = function() {
  
      if(this.p2TimerValue !== 0) {
  
        this.p2TimerValue--;
  
      } else {
  
        this.p2TimerValue = (this.p2Timer * 2) + 1;
  
        this.p2DutyIndex++;
  
        this.p2DutyIndex &= 0x7;
  
      }
  
      let output = this.dutyCycles[this.p2Duty][this.p2DutyIndex];
  
      if(output === 0 || this.p2SweepMuting || this.p2Counter === 0) {
  
        this.p2Output = 0;
  
      } else {
  
        this.p2Output = this.p2ConstantVolume ? this.p2Volume : this.p2Decay;
  
      }
  
  }
  
  
  
    this.cycleTriangle = function() {
  
      if(this.triTimerValue !== 0) {
  
        this.triTimerValue--;
  
      } else {
  
        this.triTimerValue = this.triTimer;
  
        if(this.triCounter !== 0 && this.triLinearCounter !== 0) {
  
          this.triOutput = this.triangleSteps[this.triStepIndex++];
  
          if(this.triTimer < 2) {
  
            // ultrasonic
  
            this.triOutput = 7.5;
  
          }
  
          this.triStepIndex &= 0x1f;
  
      }
  
  }
  
  }
  
  
  
    this.cycleNoise = function() {
  
      if(this.noiseTimerValue !== 0) {
  
        this.noiseTimerValue--;
  
      } else {
  
        this.noiseTimerValue = this.noiseTimer;
  
        let feedback = this.noiseShift & 0x1;
  
        if(this.noiseTonal) {
  
          feedback ^= (this.noiseShift & 0x40) >> 6;
  
        } else {
  
          feedback ^= (this.noiseShift & 0x2) >> 1;
  
        }
  
        this.noiseShift >>= 1;
  
        this.noiseShift |= feedback << 14;
  
      }
  
      if(this.noiseCounter === 0 || (this.noiseShift & 0x1) === 1) {
  
        this.noiseOutput = 0;
  
      } else {
  
        this.noiseOutput = (
  
          this.noiseConstantVolume ? this.noiseVolume : this.noiseDecay
        );
  
      }
  
  }
  
  
  
    this.cycleDmc = function() {
  
      if(this.dmcTimerValue !== 0) {
  
        this.dmcTimerValue--;
  
      } else {
  
        this.dmcTimerValue = this.dmcTimer;
  
        if(!this.dmcSilent) {
  
          if((this.dmcShifter & 0x1) === 0) {
  
            if(this.dmcOutput >= 2) {
  
              this.dmcOutput -= 2;
  
            }
  
          } else {
  
            if(this.dmcOutput <= 125) {
  
              this.dmcOutput += 2;
  
            }
  
          }
  
      }
  
        this.dmcShifter >>= 1;
  
        this.dmcBitsLeft--;
  
        if(this.dmcBitsLeft === 0) {
  
          this.dmcBitsLeft = 8;
  
          if(this.dmcSampleEmpty) {
  
            this.dmcSilent = true;
  
          } else {
  
            this.dmcSilent = false;
  
            this.dmcShifter = this.dmcSample;
  
            this.dmcSampleEmpty = true;
  
          }
  
      }
  
  }
  
      if(this.dmcBytesLeft > 0 && this.dmcSampleEmpty) {
  
        this.dmcSampleEmpty = false;
  
        this.dmcSample = this.nes.read(this.dmcAddress);
  
        this.dmcAddress++;
  
        if(this.dmcAddress === 0x10000) {
  
          this.dmcAddress = 0x8000;
  
        }
  
        this.dmcBytesLeft--;
  
        if(this.dmcBytesLeft === 0 && this.dmcLoop) {
  
          this.dmcBytesLeft = this.dmcSampleLength;
  
          this.dmcAddress = this.dmcSampleAddress;
  
        } else if(this.dmcBytesLeft === 0 && this.dmcInterrupt) {
  
          this.nes.dmcIrqWanted = true;
  
        }
  
      }
  
  }
  
  
  
    this.updateSweepP1 = function() {
  
      let change = this.p1Timer >> this.p1SweepShift;
  
      if(this.p1SweepNegate) {
  
        change = (-change) - 1;
  
      }
  
      this.p1SweepTarget = this.p1Timer + change;
  
      if(this.p1SweepTarget > 0x7ff || this.p1Timer < 8) {
  
        this.p1SweepMuting = true;
  
      } else {
  
        this.p1SweepMuting = false;
  
      }
  
  }
  
  
  
    this.updateSweepP2 = function() {
  
      let change = this.p2Timer >> this.p2SweepShift;
  
      if(this.p2SweepNegate) {
  
        change = (-change);
  
      }
  
      this.p2SweepTarget = this.p2Timer + change;
  
      if(this.p2SweepTarget > 0x7ff || this.p2Timer < 8) {
  
        this.p2SweepMuting = true;
  
      } else {
  
        this.p2SweepMuting = false;
  
      }
  
  }
  
  
  
    this.clockQuarter = function() {
  
      // handle triangle linear counter
  
      if(this.triReloadLinear) {
  
        this.triLinearCounter = this.triLinearReload;
  
      } else if(this.triLinearCounter !== 0) {
  
        this.triLinearCounter--;
  
      }
  
      if(!this.triCounterHalt) {
  
        this.triReloadLinear = false;
  
      }
  
      // handle envelopes
  
      if(!this.p1EnvelopeStart) {
  
        if(this.p1EnvelopeCounter !== 0) {
  
          this.p1EnvelopeCounter--;
  
        } else {
  
          this.p1EnvelopeCounter = this.p1Volume;
  
          if(this.p1Decay !== 0) {
  
            this.p1Decay--;
  
          } else {
  
            if(this.p1CounterHalt) {
  
              this.p1Decay = 15;
  
            }
  
          }
  
      }
  
  } else {
  
        this.p1EnvelopeStart = false;
  
        this.p1Decay = 15;
  
        this.p1EnvelopeCounter = this.p1Volume;
  
  }
  
  
  
      if(!this.p2EnvelopeStart) {
  
        if(this.p2EnvelopeCounter !== 0) {
  
          this.p2EnvelopeCounter--;
  
        } else {
  
          this.p2EnvelopeCounter = this.p2Volume;
  
          if(this.p2Decay !== 0) {
  
            this.p2Decay--;
  
          } else {
  
            if(this.p2CounterHalt) {
  
              this.p2Decay = 15;
  
            }
  
          }
  
      }
  
  } else {
  
        this.p2EnvelopeStart = false;
  
        this.p2Decay = 15;
  
        this.p2EnvelopeCounter = this.p2Volume;
  
  }
  
  
  
      if(!this.noiseEnvelopeStart) {
  
        if(this.noiseEnvelopeCounter !== 0) {
  
          this.noiseEnvelopeCounter--;
  
        } else {
  
          this.noiseEnvelopeCounter = this.noiseVolume;
  
          if(this.noiseDecay !== 0) {
  
            this.noiseDecay--;
  
          } else {
  
            if(this.noiseCounterHalt) {
  
              this.noiseDecay = 15;
  
            }
  
          }
  
      }
  
  } else {
  
        this.noiseEnvelopeStart = false;
  
        this.noiseDecay = 15;
  
        this.noiseEnvelopeCounter = this.noiseVolume;
  
  }
  
  }
  
  
  
    this.clockHalf = function() {
  
      // decrement length counters
  
      if(!this.p1CounterHalt && this.p1Counter !== 0) {
  
        this.p1Counter--;
  
      }
  
      if(!this.p2CounterHalt && this.p2Counter !== 0) {
  
        this.p2Counter--;
  
      }
  
      if(!this.triCounterHalt && this.triCounter !== 0) {
  
        this.triCounter--;
  
      }
  
      if(!this.noiseCounterHalt && this.noiseCounter !== 0) {
  
        this.noiseCounter--;
  
      }
  
      // handle sweeps
  
      if(
  
        this.p1SweepTimer === 0 && this.p1SweepEnabled &&
  
        !this.p1SweepMuting && this.p1SweepShift > 0
  
      ) {
  
        this.p1Timer = this.p1SweepTarget;
  
        this.updateSweepP1();
  
      }
  
      if(this.p1SweepTimer === 0 || this.p1SweepReload) {
  
        this.p1SweepTimer = this.p1SweepPeriod;
  
        this.p1SweepReload = false;
  
      } else {
  
        this.p1SweepTimer--;
  
      }
  
  
  
      if(
  
        this.p2SweepTimer === 0 && this.p2SweepEnabled &&
  
        !this.p2SweepMuting && this.p2SweepShift > 0
  
      ) {
  
        this.p2Timer = this.p2SweepTarget;
  
        this.updateSweepP2();
  
      }
  
      if(this.p2SweepTimer === 0 || this.p2SweepReload) {
  
        this.p2SweepTimer = this.p2SweepPeriod;
  
        this.p2SweepReload = false;
  
      } else {
  
        this.p2SweepTimer--;
  
      }
  
  }
  
  
  
    this.mix = function() {
  
      // from https://wiki.nesdev.com/w/index.php/APU_Mixer
  
      let tnd = (
  
        0.00851 * this.triOutput +
  
        0.00494 * this.noiseOutput +
  
        0.00335 * this.dmcOutput
      );
  
      let pulse = 0.00752 * (this.p1Output + this.p2Output);
  
      return tnd + pulse;
  
  }
  
  
  
    this.handleFrameCounter = function() {
  
      if(this.frameCounter === 7457) {
  
        this.clockQuarter();
  
      } else if(this.frameCounter === 14913) {
  
        this.clockQuarter();
  
        this.clockHalf();
  
      } else if(this.frameCounter === 22371) {
  
        this.clockQuarter();
  
      } else if(this.frameCounter === 29829 && !this.step5Mode) {
  
        this.clockQuarter();
  
        this.clockHalf();
  
        if(!this.interruptInhibit) {
  
          this.nes.frameIrqWanted = true;
  
        }
  
      } else if(this.frameCounter === 37281) {
  
        this.clockQuarter();
  
        this.clockHalf();
  
      }
  
  }
  
  
  
    this.getOutput = function() {
  
      let ret = [this.outputOffset, this.output];
  
      this.outputOffset = 0;
  
      return ret;
  
    }
  
  
  
    this.peak = function(adr) {
  
      if(adr === 0x4015) {
  
        let ret = 0;
  
        ret |= (this.p1Counter > 0) ? 0x1 : 0;
  
        ret |= (this.p2Counter > 0) ? 0x2 : 0;
  
        ret |= (this.triCounter > 0) ? 0x4 : 0;
  
        ret |= (this.noiseCounter > 0) ? 0x8 : 0;
  
        ret |= (this.dmcBytesLeft > 0) ? 0x10 : 0;
  
        ret |= this.nes.frameIrqWanted ? 0x40 : 0;
  
        ret |= this.nes.dmcIrqWanted ? 0x80 : 0;
  
        return ret;
  
      }
  
      return 0;
  
  }
  
  
  
    this.read = function(adr) {
  
      if(adr === 0x4015) {
  
        let ret = 0;
  
        ret |= (this.p1Counter > 0) ? 0x1 : 0;
  
        ret |= (this.p2Counter > 0) ? 0x2 : 0;
  
        ret |= (this.triCounter > 0) ? 0x4 : 0;
  
        ret |= (this.noiseCounter > 0) ? 0x8 : 0;
  
        ret |= (this.dmcBytesLeft > 0) ? 0x10 : 0;
  
        ret |= this.nes.frameIrqWanted ? 0x40 : 0;
  
        ret |= this.nes.dmcIrqWanted ? 0x80 : 0;
  
        this.nes.frameIrqWanted = false;
  
        return ret;
  
      }
  
      return 0;
  
  }
  
  
  
    this.write = function(adr, value) {
  
      switch(adr) {
  
        case 0x4000: {
  
          this.p1Duty = (value & 0xc0) >> 6;
  
          this.p1Volume = value & 0xf;
  
          this.p1CounterHalt = (value & 0x20) > 0;
  
          this.p1ConstantVolume = (value & 0x10) > 0;
  
          break;
  
        }
  
        case 0x4001: {
  
          this.p1SweepEnabled = (value & 0x80) > 0;
  
          this.p1SweepPeriod = (value & 0x70) >> 4;
  
          this.p1SweepNegate = (value & 0x08) > 0;
  
          this.p1SweepShift = value & 0x7;
  
          this.p1SweepReload = true;
  
          this.updateSweepP1();
  
          break;
  
        }
  
        case 0x4002: {
  
          this.p1Timer &= 0x700;
  
          this.p1Timer |= value;
  
          this.updateSweepP1();
  
          break;
  
        }
  
        case 0x4003: {
  
          this.p1Timer &= 0xff;
  
          this.p1Timer |= (value & 0x7) << 8;
  
          this.p1DutyIndex = 0;
  
          if(this.enablePulse1) {
  
            this.p1Counter = this.lengthLoadValues[(value & 0xf8) >> 3];
  
          }
  
          this.p1EnvelopeStart = true;
  
          this.updateSweepP1();
  
          break;
  
      }
  
        case 0x4004: {
  
          this.p2Duty = (value & 0xc0) >> 6;
  
          this.p2Volume = value & 0xf;
  
          this.p2CounterHalt = (value & 0x20) > 0;
  
          this.p2ConstantVolume = (value & 0x10) > 0;
  
          break;
  
        }
  
        case 0x4005: {
  
          this.p2SweepEnabled = (value & 0x80) > 0;
  
          this.p2SweepPeriod = (value & 0x70) >> 4;
  
          this.p2SweepNegate = (value & 0x08) > 0;
  
          this.p2SweepShift = value & 0x7;
  
          this.p2SweepReload = true;
  
          this.updateSweepP2();
  
          break;
  
        }
  
        case 0x4006: {
  
          this.p2Timer &= 0x700;
  
          this.p2Timer |= value;
  
          this.updateSweepP2();
  
          break;
  
        }
  
        case 0x4007: {
  
          this.p2Timer &= 0xff;
  
          this.p2Timer |= (value & 0x7) << 8;
  
          this.p2DutyIndex = 0;
  
          if(this.enablePulse2) {
  
            this.p2Counter = this.lengthLoadValues[(value & 0xf8) >> 3];
  
          }
  
          this.p2EnvelopeStart = true;
  
          this.updateSweepP2();
  
          break;
  
      }
  
        case 0x4008: {
  
          this.triCounterHalt = (value & 0x80) > 0;
  
          this.triLinearReload = value & 0x7f;
  
  
  
          // looks like this is a mistake in the nesdev wiki?
  
          // http://forums.nesdev.com/viewtopic.php?f=3&t=13767#p163155
  
          // doesn't do this, neither does Mesen,
  
          // and doing it breaks Super Mario Bros. 2's triangle between notes
  
  
  
          // this.triReloadLinear = true;
  
          break;
  
        }
  
        case 0x400a: {
  
          this.triTimer &= 0x700;
  
          this.triTimer |= value;
  
          break;
  
        }
  
        case 0x400b: {
  
          this.triTimer &= 0xff;
  
          this.triTimer |= (value & 0x7) << 8;
  
          if(this.enableTriangle) {
  
            this.triCounter = this.lengthLoadValues[(value & 0xf8) >> 3];
  
          }
  
          this.triReloadLinear = true;
  
          break;
  
      }
  
        case 0x400c: {
  
          this.noiseCounterHalt = (value & 0x20) > 0;
  
          this.noiseConstantVolume = (value & 0x10) > 0;
  
          this.noiseVolume = value & 0xf;
  
          break;
  
        }
  
        case 0x400e: {
  
          this.noiseTonal = (value & 0x80) > 0;
  
          this.noiseTimer = this.noiseLoadValues[value & 0xf] - 1;
  
          break;
  
        }
  
        case 0x400f: {
  
          if(this.enableNoise) {
  
            this.noiseCounter = this.lengthLoadValues[(value & 0xf8) >> 3];
  
          }
  
          this.noiseEnvelopeStart = true;
  
          break;
  
      }
  
        case 0x4010: {
  
          this.dmcInterrupt = (value & 0x80) > 0;
  
          this.dmcLoop = (value & 0x40) > 0;
  
          this.dmcTimer = this.dmcLoadValues[value & 0xf] - 1;
  
          if(!this.dmcInterrupt) {
  
            this.nes.dmcIrqWanted = false;
  
          }
  
          break;
  
      }
  
        case 0x4011: {
  
          this.dmcOutput = value & 0x7f;
  
          break;
  
        }
  
        case 0x4012: {
  
          this.dmcSampleAddress = 0xc000 | (value << 6);
  
          break;
  
        }
  
        case 0x4013: {
  
          this.dmcSampleLength = (value << 4) + 1;
  
          break;
  
        }
  
        case 0x4015: {
  
          this.enableNoise = (value & 0x08) > 0;
  
          this.enableTriangle = (value & 0x04) > 0;
  
          this.enablePulse2 = (value & 0x02) > 0;
  
          this.enablePulse1 = (value & 0x01) > 0;
  
          if(!this.enablePulse1) {
  
            this.p1Counter = 0;
  
          }
  
          if(!this.enablePulse2) {
  
            this.p2Counter = 0;
  
          }
  
          if(!this.enableTriangle) {
  
            this.triCounter = 0;
  
          }
  
          if(!this.enableNoise) {
  
            this.noiseCounter = 0;
  
          }
  
          if((value & 0x10) > 0) {
  
            if(this.dmcBytesLeft === 0) {
  
              this.dmcBytesLeft = this.dmcSampleLength;
  
              this.dmcAddress = this.dmcSampleAddress;
  
            }
  
          } else {
  
            this.dmcBytesLeft = 0;
  
          }
  
          this.nes.dmcIrqWanted = false;
  
          break;
  
      }
  
        case 0x4017: {
  
          this.step5Mode = (value & 0x80) > 0;
  
          this.interruptInhibit = (value & 0x40) > 0;
  
          if(this.interruptInhibit) {
  
            this.nes.frameIrqWanted = false;
  
          }
  
          this.frameCounter = 0;
  
          if(this.step5Mode) {
  
            this.clockQuarter();
  
            this.clockHalf();
  
          }
  
          break;
  
      }
  
        default: {
  
          break;
  
        }
  
      }
  
  }
  
  
      }

      

Cpu = (function() {

    const IMP = 0;
  
    const IMM = 1;
  
    const ZP = 2;
  
    const ZPX = 3;
  
    const ZPY = 4;
  
    const IZX = 5;
  
    const IZY = 6;
  
    const ABS = 7;
  
    const ABX = 8;
  
    const ABY = 9;
  
    const IND = 11;
  
    const REL = 12;
  
    const IZYr = 13; 
  
    const ABXr = 14; 
  
    const ABYr = 15;
  
  
  
  
    const A = 0;
  
    const X = 1;
  
    const Y = 2;
  
    const SP = 3;
  
    const PC = 0;
  
  
  
    return function(mem) {
  
  
      this.r = new Uint8Array(4);
  
      this.br = new Uint16Array(1);
  
  
  
  
      this.mem = mem;
  
  
  
      this.reset = function() {
  
        this.r[A] = 0;
  
        this.r[X] = 0;
  
        this.r[Y] = 0;
  
        this.r[SP] = 0xfd;
  
        if(this.mem.read) {
  
          this.br[PC] = this.mem.read(0xfffc) | (this.mem.read(0xfffd) << 8);
  
        } else {
  
  
          this.br[PC] = 0;
  
        }
  
  
  
  
        this.n = false;
  
        this.v = false;
  
        this.d = false;
  
        this.i = true;
  
        this.z = false;
  
        this.c = false;
  
  
  
  
        this.irqWanted = false;
  
        this.nmiWanted = false;
  
  
  
  
        this.cyclesLeft = 7;
  
      }
  
      this.reset();
  
      this.saveVars = [
  
        "r", "br", "n", "v", "d", "i", "z", "c", "irqWanted", "nmiWanted",
  
        "cyclesLeft"
  
      ];
  
  
  
  
  
  
      this.addressingModes = [
  
  
        IMP, IZX, IMP, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //0x
  
        REL, IZYr,IMP, IZY, ZPX, ZPX, ZPX, ZPX, IMP, ABYr,IMP, ABY, ABXr,ABXr,ABX, ABX, //1x
  
        ABS, IZX, IMP, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //2x
  
        REL, IZYr,IMP, IZY, ZPX, ZPX, ZPX, ZPX, IMP, ABYr,IMP, ABY, ABXr,ABXr,ABX, ABX, //3x
  
        IMP, IZX, IMP, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //4x
  
        REL, IZYr,IMP, IZY, ZPX, ZPX, ZPX, ZPX, IMP, ABYr,IMP, ABY, ABXr,ABXr,ABX, ABX, //5x
  
        IMP, IZX, IMP, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, IND, ABS, ABS, ABS, //6x
  
        REL, IZYr,IMP, IZY, ZPX, ZPX, ZPX, ZPX, IMP, ABYr,IMP, ABY, ABXr,ABXr,ABX, ABX, //7x
  
        IMM, IZX, IMM, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //8x
  
        REL, IZY, IMP, IZY, ZPX, ZPX, ZPY, ZPY, IMP, ABY, IMP, ABY, ABX, ABX, ABY, ABY, //9x
  
        IMM, IZX, IMM, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //ax
  
        REL, IZYr,IMP, IZYr,ZPX, ZPX, ZPY, ZPY, IMP, ABYr,IMP, ABYr,ABXr,ABXr,ABYr,ABYr,//bx
  
        IMM, IZX, IMM, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //cx
  
        REL, IZYr,IMP, IZY, ZPX, ZPX, ZPX, ZPX, IMP, ABYr,IMP, ABY, ABXr,ABXr,ABX, ABX, //dx
  
        IMM, IZX, IMM, IZX, ZP , ZP , ZP , ZP , IMP, IMM, IMP, IMM, ABS, ABS, ABS, ABS, //ex
  
        REL, IZYr,IMP, IZY, ZPX, ZPX, ZPX, ZPX, IMP, ABYr,IMP, ABY, ABXr,ABXr,ABX, ABX, //fx
  
      ];
  
  
  
      this.cycles = [
  
  
        7, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6, //0x
  
        2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, //1x
  
        6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6, //2x
  
        2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, //3x
  
        6, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6, //4x
  
        2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, //5x
  
        6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6, //6x
  
        2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, //7x
  
        2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, //8x
  
        2, 6, 2, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5, //9x
  
        2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, //ax
  
        2, 5, 2, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4, //bx
  
        2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, //cx
  
        2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, //dx
  
        2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6, //ex
  
        2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7, //fx
  
      ]
  
  
  
  
  
  
      this.cycle = function() {
  
        if(this.cyclesLeft === 0) {
  
  
          let instr = this.mem.read(this.br[PC]++);
  
          let mode = this.addressingModes[instr];
  
          this.cyclesLeft = this.cycles[instr];
  
  
          if(this.nmiWanted || (this.irqWanted && !this.i)) {
  
  
            this.br[PC]--;
  
            if(this.nmiWanted) {
  
              this.nmiWanted = false;
  
              instr = 0x100; // NMI
  
            } else {
  
              instr = 0x101; // IRQ
  
            }
  
            mode = IMP;
  
            this.cyclesLeft = 7;
  
          }
  
          // get the effective address, and execute the instruction
  
          let eff = this.getAdr(mode);
  
          this.functions[instr].call(this, eff, instr);
  
      }
  
        this.cyclesLeft--;
  
  }
  
  
  
      // create a P value from the flags
  
      this.getP = function(bFlag) {
  
        let value = 0;
  
  
  
        value |= this.n ? 0x80 : 0;
  
        value |= this.v ? 0x40 : 0;
  
        value |= this.d ? 0x08 : 0;
  
        value |= this.i ? 0x04 : 0;
  
        value |= this.z ? 0x02 : 0;
  
        value |= this.c ? 0x01 : 0;
  
        value |= 0x20; // bit 5 is always set
  
        value |= bFlag ? 0x10 : 0;
  
  
  
        return value;
  
      }
  
  
  
      // set the flags according to a P value
  
      this.setP = function(value) {
  
        this.n = (value & 0x80) > 0;
  
        this.v = (value & 0x40) > 0;
  
        this.d = (value & 0x08) > 0;
  
        this.i = (value & 0x04) > 0;
  
        this.z = (value & 0x02) > 0;
  
        this.c = (value & 0x01) > 0;
  
      }
  
  
  
      // set Z (zero flag) and N (overflow flag) according to the value
  
      this.setZandN = function(value) {
  
        value &= 0xff;
  
        this.z = value === 0;
  
        this.n = value > 0x7f;
  
      }
  
  
  
      // get a singed value (-128 - 127) out of a unsigned one (0 - 255)
  
      this.getSigned = function(value) {
  
        if(value > 127) {
  
          return -(256 - value);
  
        }
  
        return value;
  
      }
  
  
  
      this.doBranch = function(test, rel) {
  
        if(test) {
  
          // taken branch: 1 extra cycle
  
          this.cyclesLeft++;
  
          if((this.br[PC] >> 8) !== ((this.br[PC] + rel) >> 8)) {
  
            // taken branch across page: another extra cycle
  
            this.cyclesLeft++;
  
          }
  
          this.br[PC] += rel;
  
      }
  
  }
  
  
  
      // after fetching the instruction byte, this gets the address to affect
  
      // pc is pointing to byte after instruction byte
  
      this.getAdr = function(mode) {
  
        switch(mode) {
  
          case IMP: {
  
            // implied, wont use an address
  
            return 0;
  
          }
  
          case IMM: {
  
            // immediate
  
            return this.br[PC]++;
  
          }
  
          case ZP: {
  
            // zero page
  
            return this.mem.read(this.br[PC]++);
  
          }
  
          case ZPX: {
  
            // zero page, indexed by x
  
            let adr = this.mem.read(this.br[PC]++);
  
            return (adr + this.r[X]) & 0xff;
  
          }
  
          case ZPY: {
  
            // zero page, indexed by y
  
            let adr = this.mem.read(this.br[PC]++);
  
            return (adr + this.r[Y]) & 0xff;
  
          }
  
          case IZX: {
  
            // zero page, indexed indirect by x
  
            let adr = (this.mem.read(this.br[PC]++) + this.r[X]) & 0xff;
  
            return this.mem.read(adr) | (this.mem.read((adr + 1) & 0xff) << 8);
  
          }
  
          case IZY: {
  
            // zero page, indirect indexed by y (for RMW and writes)
  
            let adr = this.mem.read(this.br[PC]++);
  
            let radr = this.mem.read(adr) | (this.mem.read((adr + 1) & 0xff) << 8);
  
            return (radr + this.r[Y]) & 0xffff;
  
          }
  
          case IZYr: {
  
            // zero page, indirect indexed by y (for reads)
  
            let adr = this.mem.read(this.br[PC]++);
  
            let radr = this.mem.read(adr) | (this.mem.read((adr + 1) & 0xff) << 8);
  
            if((radr >> 8) < ((radr + this.r[Y]) >> 8)) {
  
              this.cyclesLeft++;
  
            }
  
            return (radr + this.r[Y]) & 0xffff;
  
          }
  
          case ABS: {
  
            // absolute
  
            let adr = this.mem.read(this.br[PC]++);
  
            adr |= (this.mem.read(this.br[PC]++) << 8);
  
            return adr;
  
          }
  
          case ABX: {
  
            // absolute, indexed by x (for RMW and writes)
  
            let adr = this.mem.read(this.br[PC]++);
  
            adr |= (this.mem.read(this.br[PC]++) << 8);
  
            return (adr + this.r[X]) & 0xffff;
  
          }
  
          case ABXr: {
  
            // absolute, indexed by x (for reads)
  
            let adr = this.mem.read(this.br[PC]++);
  
            adr |= (this.mem.read(this.br[PC]++) << 8);
  
            if((adr >> 8) < ((adr + this.r[X]) >> 8)) {
  
              this.cyclesLeft++;
  
            }
  
            return (adr + this.r[X]) & 0xffff;
  
          }
  
          case ABY: {
  
            // absolute, indexed by y (for RMW and writes)
  
            let adr = this.mem.read(this.br[PC]++);
  
            adr |= (this.mem.read(this.br[PC]++) << 8);
  
            return (adr + this.r[Y]) & 0xffff;
  
          }
  
          case ABYr: {
  
            // absolute, indexed by y (for reads)
  
            let adr = this.mem.read(this.br[PC]++);
  
            adr |= (this.mem.read(this.br[PC]++) << 8);
  
            if((adr >> 8) < ((adr + this.r[Y]) >> 8)) {
  
              this.cyclesLeft++;
  
            }
  
            return (adr + this.r[Y]) & 0xffff;
  
          }
  
          case IND: {
  
            // indirect, doesn't loop pages properly
  
            let adrl = this.mem.read(this.br[PC]++);
  
            let adrh = this.mem.read(this.br[PC]++);
  
            let radr = this.mem.read(adrl | (adrh << 8));
  
            radr |= (this.mem.read(((adrl + 1) & 0xff) | (adrh << 8))) << 8;
  
            return radr;
  
          }
  
          case REL: {
  
            // relative to PC, for branches
  
            let rel = this.mem.read(this.br[PC]++);
  
            return this.getSigned(rel);
  
          }
  
        }
  
      }
  
  
  
      // instruction functions
  
  
  
      this.uni = function(adr, num) {
  
        // unimplemented instruction
  
        log("unimplemented instruction " + this.mem.getByteRep(num));
  
      }
  
  
  
      this.ora = function(adr) {
  
        // ORs A with the value, set Z and N
  
        this.r[A] |= this.mem.read(adr);
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.and = function(adr) {
  
        // ANDs A with the value, set Z and N
  
        this.r[A] &= this.mem.read(adr);
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.eor = function(adr) {
  
        // XORs A with the value, set Z and N
  
        this.r[A] ^= this.mem.read(adr);
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.adc = function(adr) {
  
        // adds the value + C to A, set C, V, Z and N
  
        let value = this.mem.read(adr);
  
        let result = this.r[A] + value + (this.c ? 1 : 0);
  
        this.c = result > 0xff;
  
        this.v = (
  
          (this.r[A] & 0x80) === (value & 0x80) &&
  
          (value & 0x80) !== (result & 0x80)
  
        );
  
        this.r[A] = result;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.sbc = function(adr) {
  
        // subtracts the value + !C from A, set C, V, Z and N
  
        let value = this.mem.read(adr) ^ 0xff;
  
        let result = this.r[A] + value + (this.c ? 1 : 0);
  
        this.c = result > 0xff;
  
        this.v = (
  
          (this.r[A] & 0x80) === (value & 0x80) &&
  
          (value & 0x80) !== (result & 0x80)
  
        );
  
        this.r[A] = result;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.cmp = function(adr) {
  
        // sets C, Z and N according to what A - value would do
  
        let value = this.mem.read(adr) ^ 0xff;
  
        let result = this.r[A] + value + 1;
  
        this.c = result > 0xff;
  
        this.setZandN(result & 0xff);
  
      }
  
  
  
      this.cpx = function(adr) {
  
        // sets C, Z and N according to what X - value would do
  
        let value = this.mem.read(adr) ^ 0xff;
  
        let result = this.r[X] + value + 1;
  
        this.c = result > 0xff;
  
        this.setZandN(result & 0xff);
  
      }
  
  
  
      this.cpy = function(adr) {
  
        // sets C, Z and N according to what Y - value would do
  
        let value = this.mem.read(adr) ^ 0xff;
  
        let result = this.r[Y] + value + 1;
  
        this.c = result > 0xff;
  
        this.setZandN(result & 0xff);
  
      }
  
  
  
      this.dec = function(adr) {
  
        // decrements a memory location, set Z and N
  
        let result = (this.mem.read(adr) - 1) & 0xff;
  
        this.setZandN(result);
  
        this.mem.write(adr, result);
  
      }
  
  
  
      this.dex = function(adr) {
  
        // decrements X, set Z and N
  
        this.r[X]--;
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      this.dey = function(adr) {
  
        // decrements Y, set Z and N
  
        this.r[Y]--;
  
        this.setZandN(this.r[Y]);
  
      }
  
  
  
      this.inc = function(adr) {
  
        // increments a memory location, set Z and N
  
        let result = (this.mem.read(adr) + 1) & 0xff;
  
        this.setZandN(result);
  
        this.mem.write(adr, result);
  
      }
  
  
  
      this.inx = function(adr) {
  
        // increments X, set Z and N
  
        this.r[X]++;
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      this.iny = function(adr) {
  
        // increments Y, set Z and N
  
        this.r[Y]++;
  
        this.setZandN(this.r[Y]);
  
      }
  
  
  
      this.asla = function(adr) {
  
        // shifts A left 1, set C, Z and N
  
        let result = this.r[A] << 1;
  
        this.c = result > 0xff;
  
        this.setZandN(result);
  
        this.r[A] = result;
  
      }
  
  
  
      this.asl = function(adr) {
  
        // shifts a memory location left 1, set C, Z and N
  
        let result = this.mem.read(adr) << 1;
  
        this.c = result > 0xff;
  
        this.setZandN(result);
  
        this.mem.write(adr, result);
  
      }
  
  
  
      this.rola = function(adr) {
  
        // rolls A left 1, rolls C in, set C, Z and N
  
        let result = (this.r[A] << 1) | (this.c ? 1 : 0);
  
        this.c = result > 0xff;
  
        this.setZandN(result);
  
        this.r[A] = result;
  
      }
  
  
  
      this.rol = function(adr) {
  
        // rolls a memory location left 1, rolls C in, set C, Z and N
  
        let result = (this.mem.read(adr) << 1) | (this.c ? 1 : 0);
  
        this.c = result > 0xff;
  
        this.setZandN(result);
  
        this.mem.write(adr, result);
  
      }
  
  
  
      this.lsra = function(adr) {
  
        // shifts A right 1, set C, Z and N
  
        let carry = this.r[A] & 0x1;
  
        let result = this.r[A] >> 1;
  
        this.c = carry > 0;
  
        this.setZandN(result);
  
        this.r[A] = result;
  
      }
  
  
  
      this.lsr = function(adr) {
  
        // shifts a memory location right 1, set C, Z and N
  
        let value = this.mem.read(adr);
  
        let carry = value & 0x1;
  
        let result = value >> 1;
  
        this.c = carry > 0;
  
        this.setZandN(result);
  
        this.mem.write(adr, result);
  
      }
  
  
  
      this.rora = function(adr) {
  
        // rolls A right 1, rolls C in, set C, Z and N
  
        let carry = this.r[A] & 0x1;
  
        let result = (this.r[A] >> 1) | ((this.c ? 1 : 0) << 7);
  
        this.c = carry > 0;
  
        this.setZandN(result);
  
        this.r[A] = result;
  
      }
  
  
  
      this.ror = function(adr) {
  
        // rolls a memory location right 1, rolls C in, set C, Z and N
  
        let value = this.mem.read(adr);
  
        let carry = value & 0x1;
  
        let result = (value >> 1) | ((this.c ? 1 : 0) << 7);
  
        this.c = carry > 0;
  
        this.setZandN(result);
  
        this.mem.write(adr, result);
  
      }
  
  
  
      this.lda = function(adr) {
  
        // loads a value in a, sets Z and N
  
        this.r[A] = this.mem.read(adr);
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.sta = function(adr) {
  
        // stores a to a memory location
  
        this.mem.write(adr, this.r[A]);
  
      }
  
  
  
      this.ldx = function(adr) {
  
        // loads x value in a, sets Z and N
  
        this.r[X] = this.mem.read(adr);
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      this.stx = function(adr) {
  
        // stores x to a memory location
  
        this.mem.write(adr, this.r[X]);
  
      }
  
  
  
      this.ldy = function(adr) {
  
        // loads a value in y, sets Z and N
  
        this.r[Y] = this.mem.read(adr);
  
        this.setZandN(this.r[Y]);
  
      }
  
  
  
      this.sty = function(adr) {
  
        // stores y to a memory location
  
        this.mem.write(adr, this.r[Y]);
  
      }
  
  
  
      this.tax = function(adr) {
  
        // transfers a to x, sets Z and N
  
        this.r[X] = this.r[A];
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      this.txa = function(adr) {
  
        // transfers x to a, sets Z and N
  
        this.r[A] = this.r[X];
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.tay = function(adr) {
  
        // transfers a to y, sets Z and N
  
        this.r[Y] = this.r[A];
  
        this.setZandN(this.r[Y]);
  
      }
  
  
  
      this.tya = function(adr) {
  
        // transfers y to a, sets Z and N
  
        this.r[A] = this.r[Y];
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.tsx = function(adr) {
  
        // transfers the stack pointer to x, sets Z and N
  
        this.r[X] = this.r[SP];
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      this.txs = function(adr) {
  
        // transfers x to the stack pointer
  
        this.r[SP] = this.r[X];
  
      }
  
  
  
      this.pla = function(adr) {
  
        // pulls a from the stack, sets Z and N
  
        this.r[A] = this.mem.read(0x100 + ((++this.r[SP]) & 0xff));
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.pha = function(adr) {
  
        // pushes a to the stack
  
        this.mem.write(0x100 + this.r[SP]--, this.r[A]);
  
      }
  
  
  
      this.plp = function(adr) {
  
        // pulls the flags from the stack
  
        this.setP(this.mem.read(0x100 + ((++this.r[SP]) & 0xff)));
  
      }
  
  
  
      this.php = function(adr) {
  
        // pushes the flags to the stack
  
        this.mem.write(0x100 + this.r[SP]--, this.getP(true));
  
      }
  
  
  
      this.bpl = function(adr) {
  
        // branches if N is 0
  
        this.doBranch(!this.n, adr);
  
      }
  
  
  
      this.bmi = function(adr) {
  
        // branches if N is 1
  
        this.doBranch(this.n, adr);
  
      }
  
  
  
      this.bvc = function(adr) {
  
        // branches if V is 0
  
        this.doBranch(!this.v, adr);
  
      }
  
  
  
      this.bvs = function(adr) {
  
        // branches if V is 1
  
        this.doBranch(this.v, adr);
  
      }
  
  
  
      this.bcc = function(adr) {
  
        // branches if C is 0
  
        this.doBranch(!this.c, adr);
  
      }
  
  
  
      this.bcs = function(adr) {
  
        // branches if C is 1
  
        this.doBranch(this.c, adr);
  
      }
  
  
  
      this.bne = function(adr) {
  
        // branches if Z is 0
  
        this.doBranch(!this.z, adr);
  
      }
  
  
  
      this.beq = function(adr) {
  
        // branches if Z is 1
  
        this.doBranch(this.z, adr);
  
      }
  
  
  
      this.brk = function(adr) {
  
        // break to irq handler
  
        let pushPc = (this.br[PC] + 1) & 0xffff;
  
        this.mem.write(0x100 + this.r[SP]--, pushPc >> 8);
  
        this.mem.write(0x100 + this.r[SP]--, pushPc & 0xff);
  
        this.mem.write(0x100 + this.r[SP]--, this.getP(true));
  
        this.i = true;
  
        this.br[PC] = this.mem.read(0xfffe) | (this.mem.read(0xffff) << 8);
  
      }
  
  
  
      this.rti = function(adr) {
  
        // return from interrupt
  
        this.setP(this.mem.read(0x100 + ((++this.r[SP]) & 0xff)));
  
        let pullPc = this.mem.read(0x100 + ((++this.r[SP]) & 0xff));
  
        pullPc |= (this.mem.read(0x100 + ((++this.r[SP]) & 0xff)) << 8);
        
        this.br[PC] = pullPc;
  
  
      }
  
  
  
      this.jsr = function(adr) {
  
        // jump to subroutine
  
        let pushPc = (this.br[PC] - 1) & 0xffff;
  
        this.mem.write(0x100 + this.r[SP]--, pushPc >> 8);
  
        this.mem.write(0x100 + this.r[SP]--, pushPc & 0xff);
  
        this.br[PC] = adr;
  
      }
  
  
  
      this.rts = function(adr) {
  
        // return from subroutine
  
        let pullPc = this.mem.read(0x100 + ((++this.r[SP]) & 0xff));
  
        pullPc |= (this.mem.read(0x100 + ((++this.r[SP]) & 0xff)) << 8);
  
        this.br[PC] = pullPc + 1;
  
      }
  
  
  
      this.jmp = function(adr) {
  
        // jump to address
  
        this.br[PC] = adr;
  
      }
  
  
  
      this.bit = function(adr) {
  
        // bit test A with value, set N to b7, V to b6 and Z to result
  
        let value = this.mem.read(adr);
  
        this.n = (value & 0x80) > 0;
  
        this.v = (value & 0x40) > 0;
  
        let res = this.r[A] & value;
  
        this.z = res === 0;
  
      }
  
  
  
      this.clc = function(adr) {
  
        // clear carry flag
  
        this.c = false;
  
      }
  
  
  
      this.sec = function(adr) {
  
        // set carry flag
  
        this.c = true;
  
      }
  
  
  
      this.cld = function(adr) {
  
        // clear decimal flag
  
        this.d = false;
  
      }
  
  
  
      this.sed = function(adr) {
  
        // set decimal flag
  
        this.d = true;
  
      }
  
  
  
      this.cli = function(adr) {
  
        // clear interrupt flag
  
        this.i = false;
  
      }
  
  
  
      this.sei = function(adr) {
  
        // set interrupt flag
  
        this.i = true;
  
      }
  
  
  
      this.clv = function(adr) {
  
        // clear overflow flag
  
        this.v = false;
  
      }
  
  
  
      this.nop = function(adr) {
  
        // no operation
  
      }
  
  
  
      this.irq = function(adr) {
  
        // handle irq interrupt
  
        let pushPc = this.br[PC];
  
        this.mem.write(0x100 + this.r[SP]--, pushPc >> 8);
  
        this.mem.write(0x100 + this.r[SP]--, pushPc & 0xff);
  
        this.mem.write(0x100 + this.r[SP]--, this.getP(false));
  
        this.i = true;
  
        this.br[PC] = this.mem.read(0xfffe) | (this.mem.read(0xffff) << 8);
  
      }
  
  
  
      this.nmi = function(adr) {
  
        // handle nmi interrupt
  
        let pushPc = this.br[PC];
  
        this.mem.write(0x100 + this.r[SP]--, pushPc >> 8);
  
        this.mem.write(0x100 + this.r[SP]--, pushPc & 0xff);
  
        this.mem.write(0x100 + this.r[SP]--, this.getP(false));
  
        this.i = true;
  
        this.br[PC] = this.mem.read(0xfffa) | (this.mem.read(0xfffb) << 8);
  
      }
  
  
  
      // undocumented opcodes
  
  
  
      this.kil = function(adr) {
  
        // stopts the cpu
  
        this.br[PC]--;
  
      }
  
  
  
      this.slo = function(adr) {
  
        // shifts a memory location left 1, ORs a with the result, sets N, Z and C
  
        let result = this.mem.read(adr) << 1;
  
        this.c = result > 0xff;
  
        this.mem.write(adr, result);
  
        this.r[A] |= result;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.rla = function(adr) {
  
        // rolls a memory location left 1, ANDs a with the result, sets N, Z and C
  
        let result = (this.mem.read(adr) << 1) | (this.c ? 1 : 0);
  
        this.c = result > 0xff;
  
        this.mem.write(adr, result);
  
        this.r[A] &= result;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.sre = function(adr) {
  
        // shifts a memory location right 1, XORs A with the result, sets N, Z and C
  
        let value = this.mem.read(adr);
  
        let carry = value & 0x1;
  
        let result = value >> 1;
  
        this.c = carry > 0;
  
        this.mem.write(adr, result);
  
        this.r[A] ^= result;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.rra = function(adr) {
  
        // rolls a memory location right 1, adds the result to A, sets N, Z, C and V
  
        let value = this.mem.read(adr);
  
        let carry = value & 0x1;
  
        let result = (value >> 1) | ((this.c ? 1 : 0) << 7);
  
        this.mem.write(adr, result);
  
        let addResult = this.r[A] + result + carry;
  
        this.c = addResult > 0xff;
  
        this.v = (
  
          (this.r[A] & 0x80) === (result & 0x80) &&
  
          (result & 0x80) !== (addResult & 0x80)
  
        );
  
        this.r[A] = addResult;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.sax = function(adr) {
  
        // stores A ANDed with X to a memory location
  
        this.mem.write(adr, this.r[A] & this.r[X]);
  
      }
  
  
  
      this.lax = function(adr) {
  
        // loads A and X with a value
  
        this.r[A] = this.mem.read(adr);
  
        this.r[X] = this.r[A];
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      this.dcp = function(adr) {
  
        // decrement a memory location, and sets C, Z and N to what A - result does
  
        let value = (this.mem.read(adr) - 1) & 0xff;
  
        this.mem.write(adr, value);
  
        value ^= 0xff;
  
        let result = this.r[A] + value + 1;
  
        this.c = result > 0xff;
  
        this.setZandN(result & 0xff);
  
      }
  
  
  
      this.isc = function(adr) {
  
        // increments a memory location, and subtract it+!C from A, sets Z, N, V, C
  
        let value = (this.mem.read(adr) + 1) & 0xff;
  
        this.mem.write(adr, value);
  
        value ^= 0xff;
  
        let result = this.r[A] + value + (this.c ? 1 : 0);
  
        this.c = result > 0xff;
  
        this.v = (
  
          (this.r[A] & 0x80) === (value & 0x80) &&
  
          (value & 0x80) !== (result & 0x80)
  
        );
  
        this.r[A] = result;
  
        this.setZandN(this.r[A]);
  
      }
  
  
  
      this.anc = function(adr) {
  
        // ANDs a with the value, sets Z and N, then sets C to N
  
        this.r[A] &= this.mem.read(adr);
  
        this.setZandN(this.r[A]);
  
        this.c = this.n;
  
      }
  
  
  
      this.alr = function(adr) {
  
        // ANDs a with the value, then shifts A right 1, sets C, Z and N
  
        this.r[A] &= this.mem.read(adr);
  
        let carry = this.r[A] & 0x1;
  
        let result = this.r[A] >> 1;
  
        this.c = carry > 0;
  
        this.setZandN(result);
  
        this.r[A] = result;
  
      }
  
  
  
      this.arr = function(adr) {
  
        // ANDs a with the value, then rolls A right 1, sets Z, N, C and V oddly
  
        this.r[A] &= this.mem.read(adr);
  
        let result = (this.r[A] >> 1) | ((this.c ? 1 : 0) << 7);
  
        this.setZandN(result);
  
        this.c = (result & 0x40) > 0;
  
        this.v = ((result & 0x40) ^ ((result & 0x20) << 1)) > 0;
  
        this.r[A] = result;
  
      }
  
  
  
      this.axs = function(adr) {
  
        // sets X to A ANDed with X minus the value, sets N, Z and C
  
        let value = this.mem.read(adr) ^ 0xff;
  
        let andedA = this.r[A] & this.r[X];
  
        let result = andedA + value + 1;
  
        this.c = result > 0xff;
  
        this.r[X] = result;
  
        this.setZandN(this.r[X]);
  
      }
  
  
  
      // function table
  
      this.functions = [
  
        //x0      x1        x2        x3        x4        x5        x6        x7        x8        x9        xa        xb        xc        xd        xe        xf
  
        this.brk, this.ora, this.kil, this.slo, this.nop, this.ora, this.asl, this.slo, this.php, this.ora, this.asla,this.anc, this.nop, this.ora, this.asl, this.slo, //0x
  
        this.bpl, this.ora, this.kil, this.slo, this.nop, this.ora, this.asl, this.slo, this.clc, this.ora, this.nop, this.slo, this.nop, this.ora, this.asl, this.slo, //1x
  
        this.jsr, this.and, this.kil, this.rla, this.bit, this.and, this.rol, this.rla, this.plp, this.and, this.rola,this.anc, this.bit, this.and, this.rol, this.rla, //2x
  
        this.bmi, this.and, this.kil, this.rla, this.nop, this.and, this.rol, this.rla, this.sec, this.and, this.nop, this.rla, this.nop, this.and, this.rol, this.rla, //3x
  
        this.rti, this.eor, this.kil, this.sre, this.nop, this.eor, this.lsr, this.sre, this.pha, this.eor, this.lsra,this.alr, this.jmp, this.eor, this.lsr, this.sre, //4x
  
        this.bvc, this.eor, this.kil, this.sre, this.nop, this.eor, this.lsr, this.sre, this.cli, this.eor, this.nop, this.sre, this.nop, this.eor, this.lsr, this.sre, //5x
  
        this.rts, this.adc, this.kil, this.rra, this.nop, this.adc, this.ror, this.rra, this.pla, this.adc, this.rora,this.arr, this.jmp, this.adc, this.ror, this.rra, //6x
  
        this.bvs, this.adc, this.kil, this.rra, this.nop, this.adc, this.ror, this.rra, this.sei, this.adc, this.nop, this.rra, this.nop, this.adc, this.ror, this.rra, //7x
  
        this.nop, this.sta, this.nop, this.sax, this.sty, this.sta, this.stx, this.sax, this.dey, this.nop, this.txa, this.uni, this.sty, this.sta, this.stx, this.sax, //8x
  
        this.bcc, this.sta, this.kil, this.uni, this.sty, this.sta, this.stx, this.sax, this.tya, this.sta, this.txs, this.uni, this.uni, this.sta, this.uni, this.uni, //9x
  
        this.ldy, this.lda, this.ldx, this.lax, this.ldy, this.lda, this.ldx, this.lax, this.tay, this.lda, this.tax, this.uni, this.ldy, this.lda, this.ldx, this.lax, //ax
  
        this.bcs, this.lda, this.kil, this.lax, this.ldy, this.lda, this.ldx, this.lax, this.clv, this.lda, this.tsx, this.uni, this.ldy, this.lda, this.ldx, this.lax, //bx
  
        this.cpy, this.cmp, this.nop, this.dcp, this.cpy, this.cmp, this.dec, this.dcp, this.iny, this.cmp, this.dex, this.axs, this.cpy, this.cmp, this.dec, this.dcp, //cx
  
        this.bne, this.cmp, this.kil, this.dcp, this.nop, this.cmp, this.dec, this.dcp, this.cld, this.cmp, this.nop, this.dcp, this.nop, this.cmp, this.dec, this.dcp, //dx
  
        this.cpx, this.sbc, this.nop, this.isc, this.cpx, this.sbc, this.inc, this.isc, this.inx, this.sbc, this.nop, this.sbc, this.cpx, this.sbc, this.inc, this.isc, //ex
  
        this.beq, this.sbc, this.kil, this.isc, this.nop, this.sbc, this.inc, this.isc, this.sed, this.sbc, this.nop, this.isc, this.nop, this.sbc, this.inc, this.isc, //fx
  
        this.nmi, this.irq // 0x100: NMI, 0x101: IRQ
  
      ];
  
  
  
    }
  
  })()

  
function Nes() {

    this.stateVersion = 1;
    this.ram = new Uint8Array(0x800);
    this.cpu = new Cpu(this);
    this.ppu = new Ppu(this);
    this.apu = new Apu(this);
    this.mapper;
  
    this.currentControl1State = 0;
    this.currentControl2State = 0;
  
    this.onread = undefined;
    this.onwrite = undefined;
    this.onexecute = undefined;
  
    this.reset = function(hard) {
      if(hard) {
        for(let i = 0; i < this.ram.length; i++) {
          this.ram[i] = 0;
        }
      }
      this.cpu.reset();
      this.ppu.reset();
      this.apu.reset();
      if(this.mapper) {
        this.mapper.reset(hard);
      }
  
      this.cycles = 0;
  
      this.inDma = false;
      this.dmaTimer = 0;
      this.dmaBase = 0;
      this.dmaValue = 0;
  
      this.latchedControl1State = 0;
      this.latchedControl2State = 0;
      this.controllerLatched = false;
  
      this.mapperIrqWanted = false;
      this.frameIrqWanted = false;
      this.dmcIrqWanted = false;
    }
    this.reset(true);
    this.saveVars = [
      "ram", "cycles", "inDma", "dmaTimer", "dmaBase", "dmaValue",
      "latchedControl1State", "latchedControl2State", "controllerLatched",
      "mapperIrqWanted", "frameIrqWanted", "dmcIrqWanted"
    ];
  
    this.loadRom = function(rom) {
      if(rom.length < 0x10) {
        log("Invalid rom loaded");
        return false;
      }
      if(
        rom[0] !== 0x4e || rom[1] !== 0x45 ||
        rom[2] !== 0x53 || rom[3] !== 0x1a
      ) {
        log("Invalid rom loaded");
        return false;
      }
      let header = this.parseHeader(rom);
      if(rom.length < header.chrBase + 0x2000 * header.chrBanks) {
        log("Rom file is missing data");
        return false;
      }
      if(mappers[header.mapper] === undefined) {
        log("Unsupported mapper: " + header.mapper);
        return false;
      } else {
        try {
          this.mapper = new mappers[header.mapper](this, rom, header);
        } catch(e) {
          log("Rom load error: " + e);
          return false;
        }
      }
      log(
        "Loaded " + this.mapper.name + " rom: " + this.mapper.h.banks +
        " PRG bank(s), " + this.mapper.h.chrBanks + " CHR bank(s)"
      );
      return true;
    }
  
    this.parseHeader = function(rom) {
      let o = {
        banks: rom[4],
        chrBanks: rom[5],
        mapper: (rom[6] >> 4) | (rom[7] & 0xf0),
        verticalMirroring: (rom[6] & 0x01) > 0,
        battery: (rom[6] & 0x02) > 0,
        trainer: (rom[6] & 0x04) > 0,
        fourScreen: (rom[6] & 0x08) > 0,
      };
      o["base"] = 16 + (o.trainer ? 512 : 0);
      o["chrBase"] = o.base + 0x4000 * o.banks;
      o["prgAnd"] = (o.banks * 0x4000) - 1;
      o["chrAnd"] = o.chrBanks === 0 ? 0x1fff : (o.chrBanks * 0x2000) - 1;
      o["saveVars"] = [
        "banks", "chrBanks", "mapper", "verticalMirroring", "battery", "trainer",
        "fourScreen"
      ];
      return o;
    }
  
    this.getPixels = function(data) {
      this.ppu.setFrame(data);
    }
  
    this.getSamples = function(data, count) {
      let samples = this.apu.getOutput();
      let runAdd = (29780 / count);
      let total = 0;
      let inputPos = 0;
      let running = 0;
      for(let i = 0; i < count; i++) {
        running += runAdd;
        let total = 0;
        let avgCount = running & 0xffff;
        for(let j = inputPos; j < inputPos + avgCount; j++) {
          total += samples[1][j];
        }
        data[i] = total / avgCount;
        inputPos += avgCount;
        running -= avgCount;
      }
    }
  
    this.cycle = function() {
      if(this.cycles === 0) {
        this.cycles = 3;
        if(this.controllerLatched) {
          this.latchedControl1State = this.currentControl1State;
          this.latchedControl2State = this.currentControl2State;
        }
  
        if(this.mapperIrqWanted || this.frameIrqWanted || this.dmcIrqWanted) {
          this.cpu.irqWanted = true;
        } else {
          this.cpu.irqWanted = false;
        }
  
        if(!this.inDma) {
          if(this.onexecute && this.cpu.cyclesLeft === 0) {
            this.onexecute(this.cpu.br[0], this.peak(this.cpu.br[0]));
          }
          this.cpu.cycle();
        } else {
          if(this.dmaTimer > 0) {
            if((this.dmaTimer & 1) === 0) {
              this.ppu.write(4, this.dmaValue);
            } else {
              this.dmaValue = this.read(
                this.dmaBase + ((this.dmaTimer / 2) & 0xff)
              );
            }
          }
          this.dmaTimer++;
          if(this.dmaTimer === 513) {
            this.dmaTimer = 0;
            this.inDma = false;
          }
        }
  
        this.apu.cycle();
      }
      this.ppu.cycle();
      this.cycles--;
    }
  
    this.runFrame = function() {
      do {
        this.cycle()
      } while(!(this.ppu.line === 240 && this.ppu.dot === 0));
    }
  
    this.peak = function(adr) {
      adr &= 0xffff;
      if(adr < 0x2000) {
        return this.ram[adr & 0x7ff];
      }
      if(adr < 0x4000) {
        return this.ppu.peak(adr & 0x7);
      }
      if(adr < 0x4020) {
        if(adr === 0x4014) {
          return 0;
        }
        if(adr === 0x4016) {
          let ret = this.latchedControl1State & 1;
          return ret | 0x40;
        }
        if(adr === 0x4017) {
          let ret = this.latchedControl2State & 1;
          return ret | 0x40;
        }
        return this.apu.peak(adr);
      }
      return this.mapper.peak(adr);
    }
  
    this.read = function(adr) {
      adr &= 0xffff;
      if(this.onread) {
        this.onread(adr, this.peak(adr));
      }
  
      if(adr < 0x2000) {
        return this.ram[adr & 0x7ff];
      }
      if(adr < 0x4000) {
        return this.ppu.read(adr & 0x7);
      }
      if(adr < 0x4020) {
        if(adr === 0x4014) {
          return 0;
        }
        if(adr === 0x4016) {
          let ret = this.latchedControl1State & 1;
          this.latchedControl1State >>= 1;
          this.latchedControl1State |= 0x80;
          return ret | 0x40;
        }
        if(adr === 0x4017) {
          let ret = this.latchedControl2State & 1;
          this.latchedControl2State >>= 1;
          this.latchedControl2State |= 0x80;
          return ret | 0x40;
        }
        return this.apu.read(adr);
      }
      return this.mapper.read(adr);
    }
  
    this.write = function(adr, value) {
      adr &= 0xffff;
      if(this.onwrite) {
        this.onwrite(adr, value);
      }
      if(adr < 0x2000) {
        this.ram[adr & 0x7ff] = value;
        return;
      }
      if(adr < 0x4000) {
        this.ppu.write(adr & 0x7, value);
        return;
      }
      if(adr < 0x4020) {
        if(adr === 0x4014) {
          this.inDma = true;
          this.dmaBase = value << 8;
          return;
        }
        if(adr === 0x4016) {
          if((value & 0x01) > 0) {
            this.controllerLatched = true;
          } else {
            this.controllerLatched = false;
          }
          return;
        }
        this.apu.write(adr, value);
        return;
      }
      this.mapper.write(adr, value);
    }
  
    // print bytes and words nicely
    this.getByteRep = function(val) {
      return ("0" + val.toString(16)).slice(-2);
    }
  
    this.getWordRep = function(val) {
      return ("000" + val.toString(16)).slice(-4);
    }
  
    // get controls in
    this.setButtonPressed = function(player, button) {
      if(player === 1) {
        this.currentControl1State |= (1 << button);
      } else if(player === 2) {
        this.currentControl2State |= (1 << button);
      }
    }
  
    this.setButtonReleased = function(player, button) {
      if(player === 1) {
        this.currentControl1State &= (~(1 << button)) & 0xff;
      } else if(player === 2) {
        this.currentControl2State &= (~(1 << button)) & 0xff;
      }
    }
  
    this.INPUT = {
      A: 0,
      B: 1,
      SELECT: 2,
      START: 3,
      UP: 4,
      DOWN: 5,
      LEFT: 6,
      RIGHT: 7
    }
  
    // save states, battery saves
    this.getBattery = function() {
      if(this.mapper.h.battery) {
        return {data: this.mapper.getBattery()};
      }
      return undefined;
    }
  
    this.setBattery = function(data) {
      if(this.mapper.h.battery) {
        return this.mapper.setBattery(data.data);
      }
      return true;
    }
  
    this.getState = function() {
      let cpuObj = this.getObjState(this.cpu);
      let ppuObj = this.getObjState(this.ppu);
      let apuObj = this.getObjState(this.apu);
      let mapperObj = this.getObjState(this.mapper);
      let headerObj = this.getObjState(this.mapper.h);
      let final = this.getObjState(this);
      final["cpu"] = cpuObj;
      final["ppu"] = ppuObj;
      final["apu"] = apuObj;
      final["mapper"] = mapperObj;
      final["header"] = headerObj;
      final["mapperVersion"] = this.mapper.version;
      final["version"] = this.stateVersion;
      return final;
    }
  
    this.setState = function(obj) {
      if(obj.version !== this.stateVersion || obj.mapperVersion !== this.mapper.version) {
        return false;
      }
      // check header
      if(!this.checkObjState(this.mapper.h, obj.header)) {
        return false;
      }
      this.setObjState(this.cpu, obj.cpu);
      this.setObjState(this.ppu, obj.ppu);
      this.setObjState(this.apu, obj.apu);
      this.setObjState(this.mapper, obj.mapper);
      this.setObjState(this, obj);
      return true;
    }
  
    this.getObjState = function(obj) {
      let ret = {};
      for(let i = 0; i < obj.saveVars.length; i++) {
        let name = obj.saveVars[i];
        let val = obj[name];
        if(val instanceof Uint8Array || val instanceof Uint16Array) {
          ret[name] = Array.prototype.slice.call(val);
        } else {
          ret[name] = val;
        }
      }
      return ret;
    }
  
    this.setObjState = function(obj, save) {
      for(let i = 0; i < obj.saveVars.length; i++) {
        let name = obj.saveVars[i];
        let val = obj[name];
        if(val instanceof Uint8Array) {
          obj[name] = new Uint8Array(save[name]);
        } else if(val instanceof Uint16Array) {
          obj[name] = new Uint16Array(save[name]);
        } else {
          obj[name] = save[name];
        }
      }
    }
  
    this.checkObjState = function(obj, save) {
      for(let i = 0; i < obj.saveVars.length; i++) {
        let name = obj.saveVars[i];
        if(obj[name] !== save[name]) {
          return false;
        }
      }
      return true;
    }
  }

  
function Ppu(nes) {

    this.nes = nes;
  
  
    this.paletteRam = new Uint8Array(0x20);
  
    this.oamRam = new Uint8Array(0x100);
  
    this.secondaryOam = new Uint8Array(0x20);
    this.spriteTiles = new Uint8Array(0x10);
  
    this.pixelOutput = new Uint16Array(256 * 240);
  
    this.reset = function() {
      for(let i = 0; i < this.paletteRam.length; i++) {
        this.paletteRam[i] = 0;
      }
      for(let i = 0; i < this.oamRam.length; i++) {
        this.oamRam[i] = 0;
      }
      for(let i = 0; i < this.secondaryOam.length; i++) {
        this.secondaryOam[i] = 0;
      }
      for(let i = 0; i < this.spriteTiles.length; i++) {
        this.spriteTiles[i] = 0;
      }
      for(let i = 0; i < this.pixelOutput.length; i++) {
        this.pixelOutput[i] = 0;
      }
  
      this.t = 0;
      this.v = 0;
      this.w = 0;
      this.x = 0; 
  
      this.line = 0;
      this.dot = 0;
      this.evenFrame = true;
  
      this.oamAddress = 0;
      this.readBuffer = 0; 
      this.spriteZero = false;
      this.spriteOverflow = false;
      this.inVblank = false;
  
      this.vramIncrement = 1;
      this.spritePatternBase = 0;
      this.bgPatternBase = 0;
      this.spriteHeight = 8;
      this.slave = false;
      this.generateNmi = false;
  
      this.greyScale = false;
      this.bgInLeft = false;
      this.sprInLeft = false;
      this.bgRendering = false;
      this.sprRendering = false;
      this.emphasis = 0;
  
      this.atl = 0;
      this.atr = 0;
      this.tl = 0;
      this.th = 0;
      this.spriteZeroIn = false;
      this.spriteCount = 0;
    }
    this.reset();
    this.saveVars = [
      "paletteRam", "oamRam", "secondaryOam", "spriteTiles", "t", "v",
      "w", "x", "line", "dot", "evenFrame", "oamAddress", "readBuffer",
      "spriteZero", "spriteOverflow", "inVblank", "vramIncrement",
      "spritePatternBase", "bgPatternBase", "spriteHeight", "slave",
      "generateNmi", "greyScale", "bgInLeft", "sprInLeft", "bgRendering",
      "sprRendering", "emphasis", "atl", "atr", "tl", "th", "spriteZeroIn",
      "spriteCount"
    ];
  
    this.cycle = function() {
      if(this.line < 240) {
        if(this.dot < 256) {
          this.generateDot();
          if(((this.dot + 1) & 0x7) === 0) {
            if(this.bgRendering || this.sprRendering) {
              this.readTileBuffers();
              this.incrementVx();
            }
          }
        } else if(this.dot === 256) {
          if(this.bgRendering || this.sprRendering) {
            this.incrementVy();
          }
        } else if(this.dot === 257) {
          if(this.bgRendering || this.sprRendering) {
            this.v &= 0x7be0;
            this.v |= (this.t & 0x41f);
          }
        } else if(this.dot === 270) {
          this.spriteZeroIn = false;
          this.spriteCount = 0;
          if(this.bgRendering || this.sprRendering) {
            this.evaluateSprites();
          }
        } else if(this.dot === 321 || this.dot === 329) {
          if (this.bgRendering || this.sprRendering) {
            this.readTileBuffers();
            this.incrementVx();
          }
        }
      } else if(this.line === 241) {
        if(this.dot === 1) {
          this.inVblank = true;
          if(this.generateNmi) {
            this.nes.cpu.nmiWanted = true;
          }
          if(this.bgRendering || this.sprRendering) {
            this.evenFrame = !this.evenFrame;
          } else {
            this.evenFrame = true; 
          }
        }
      } else if(this.line === 261) {
        if(this.dot === 1) {
          this.inVblank = false;
          this.spriteZero = false;
          this.spriteOverflow = false;
        } else if(this.dot === 257) {
          if(this.bgRendering || this.sprRendering) {
            this.v &= 0x7be0;
            this.v |= (this.t & 0x41f);
          }
        } else if(this.dot === 270) {
          this.spriteZeroIn = false;
          this.spriteCount = 0;
          if(this.bgRendering || this.sprRendering) {
            let base = this.spriteHeight === 16 ? 0x1000 : this.spritePatternBase;
            this.readInternal(base + 0xfff);
          }
        } else if(this.dot === 280) {
          if(this.bgRendering || this.sprRendering) {
            this.v &= 0x41f;
            this.v |= (this.t & 0x7be0);
          }
        } else if(this.dot === 321 || this.dot === 329) {
          if(this.bgRendering || this.sprRendering) {
            this.readTileBuffers();
            this.incrementVx();
          }
        }
      }
  
      this.dot++;
      if(this.dot === 341 || (
        this.dot === 340 && this.line === 261 && !this.evenFrame
      )) {
        this.dot = 0;
        this.line++;
        if(this.line === 262) {
          this.line = 0;
        }
      }
    }
  
    this.evaluateSprites = function() {
      for(let i = 0; i < 256; i += 4) {
        let sprY = this.oamRam[i];
        let sprRow = this.line - sprY;
        if(sprRow >= 0 && sprRow < this.spriteHeight) {
          if(this.spriteCount === 8) {
            this.spriteOverflow = true;
            break;
          } else {
             if(i === 0) {
                   this.spriteZeroIn = true;
            }
            this.secondaryOam[this.spriteCount * 4] = this.oamRam[i];
            this.secondaryOam[this.spriteCount * 4 + 1] = this.oamRam[i + 1];
            this.secondaryOam[this.spriteCount * 4 + 2] = this.oamRam[i + 2];
            this.secondaryOam[this.spriteCount * 4 + 3] = this.oamRam[i + 3];
            if((this.oamRam[i + 2] & 0x80) > 0) {
              sprRow = this.spriteHeight - 1 - sprRow;
            }
            let base = this.spritePatternBase;
            let tileNum = this.oamRam[i + 1];
            if(this.spriteHeight === 16) {
              base = (tileNum & 0x1) * 0x1000;
              tileNum = (tileNum & 0xfe);
              tileNum += (sprRow & 0x8) >> 3;
              sprRow &= 0x7;
            }
            this.spriteTiles[this.spriteCount] = this.readInternal(
              base + tileNum * 16 + sprRow
            );
            this.spriteTiles[this.spriteCount + 8] = this.readInternal(
              base + tileNum * 16 + sprRow + 8
            );
            this.spriteCount++;
          }
        }
      }
      if(this.spriteCount < 8) {
        let base = this.spriteHeight === 16 ? 0x1000 : this.spritePatternBase;
        this.readInternal(base + 0xfff);
      }
    }
  
    this.readTileBuffers = function() {
      let tileNum = this.readInternal(0x2000 + (this.v & 0xfff));
  
      this.atl = this.atr;
      let attAdr = 0x23c0;
      attAdr |= (this.v & 0x1c) >> 2;
      attAdr |= (this.v & 0x380) >> 4;
      attAdr |= (this.v & 0xc00);
      this.atr = this.readInternal(attAdr);
      if((this.v & 0x40) > 0) {
        this.atr >>= 4;
      }
      this.atr &= 0xf;
      if((this.v & 0x02) > 0) {
        this.atr >>= 2;
      }
      this.atr &= 0x3;
  
      let fineY = (this.v & 0x7000) >> 12;
      this.tl &= 0xff;
      this.tl <<= 8;
      this.tl |= this.readInternal(this.bgPatternBase + tileNum * 16 + fineY);
      this.th &= 0xff;
      this.th <<= 8;
      this.th |= this.readInternal(
        this.bgPatternBase + tileNum * 16 + fineY + 8
      );
    }
  
    this.generateDot = function() {
      let i = this.dot & 0x7;
      let bgPixel = 0;
      let sprPixel = 0;
      let sprNum = -1;
      let sprPriority = 0;
      let finalColor;
  
      if(this.sprRendering && (this.dot > 7 || this.sprInLeft)) {
        for(let j = 0; j < this.spriteCount; j++) {
          let xPos = this.secondaryOam[j * 4 + 3];
          let xCol = this.dot - xPos;
          if(xCol >= 0 && xCol < 8) {
            if((this.secondaryOam[j * 4 + 2] & 0x40) > 0) {
              xCol = 7 - xCol;
            }
            let shift = 7 - xCol;
            let pixel = (this.spriteTiles[j] >> shift) & 1;
            pixel |= ((this.spriteTiles[j + 8] >> shift) & 1) << 1;
            if(pixel > 0) {
              sprPixel = pixel | ((this.secondaryOam[j * 4 + 2] & 0x3) << 2);
              sprPriority = (this.secondaryOam[j * 4 + 2] & 0x20) >> 5;
              sprNum = j;
              break;
            }
          }
        }
      }
  
      if(this.bgRendering && (this.dot > 7 || this.bgInLeft)) {
        let shiftAmount = 15 - i - this.x;
        bgPixel = (this.tl >> shiftAmount) & 1;
        bgPixel |= ((this.th >> shiftAmount) & 1) << 1;
        let atrOff;
        if(this.x + i > 7) {
          atrOff = this.atr * 4;
        } else {
          atrOff = this.atl * 4;
        }
        if(bgPixel > 0) {
          bgPixel += atrOff;
        }
      }
  
      if(!this.bgRendering && !this.sprRendering) {
        if((this.v & 0x3fff) >= 0x3f00) {
          finalColor = this.readPalette(this.v & 0x1f);
        } else {
          finalColor = this.readPalette(0);
        }
      } else {
        if(bgPixel === 0) {
          if(sprPixel > 0) {
            finalColor = this.readPalette(sprPixel + 0x10);
          } else {
            finalColor = this.readPalette(0);
          }
        } else {
          if(sprPixel > 0) {
            if(sprNum === 0 && this.spriteZeroIn && this.dot !== 255) {
              this.spriteZero = true;
            }
          }
          if(sprPixel > 0 && sprPriority === 0) {
            finalColor = this.readPalette(sprPixel + 0x10);
          } else {
            finalColor = this.readPalette(bgPixel);
          }
        }
      }
  
      this.pixelOutput[
        this.line * 256 + this.dot
      ] = (this.emphasis << 6) | (finalColor & 0x3f);
    }
  
    this.setFrame = function(finalArray) {
      for(let i = 0; i < this.pixelOutput.length; i++) {
        let color = this.pixelOutput[i];
        let r = this.nesPal[color & 0x3f][0];
        let g = this.nesPal[color & 0x3f][1];
        let b = this.nesPal[color & 0x3f][2];
        if((color & 0x40) > 0) {
          r = r * 1.1;
          g = g * 0.9;
          b = b * 0.9;
        }
        if((color & 0x80) > 0) {
          r = r * 0.9;
          g = g * 1.1;
          b = b * 0.9;
        }
        if((color & 0x100) > 0) {
          r = r * 0.9;
          g = g * 0.9;
          b = b * 1.1;
        }
        r = (r > 255 ? 255 : r) & 0xff;
        g = (g > 255 ? 255 : g) & 0xff;
        b = (b > 255 ? 255 : b) & 0xff;
        finalArray[i * 4] = r;
        finalArray[i * 4 + 1] = g;
        finalArray[i * 4 + 2] = b;
        finalArray[i * 4 + 3] = 255;
      }
    }
  
    this.incrementVx = function() {
      if((this.v & 0x1f) === 0x1f) {
        this.v &= 0x7fe0;
        this.v ^= 0x400;
      } else {
        this.v++;
      }
    }
    this.incrementVy = function() {
      if((this.v & 0x7000) !== 0x7000) {
        this.v += 0x1000;
      } else {
        this.v &= 0xfff;
        let coarseY = (this.v & 0x3e0) >> 5;
        if(coarseY === 29) {
          coarseY = 0;
          this.v ^= 0x800;
        } else if(coarseY === 31) {
          coarseY = 0;
        } else {
          coarseY++;
        }
        this.v &= 0x7c1f;
        this.v |= (coarseY << 5);
      }
    }
  
    this.readInternal = function(adr) {
      adr &= 0x3fff;
      return this.nes.mapper.ppuRead(adr);
    }
  
    this.writeInternal = function(adr, value) {
      adr &= 0x3fff;
      this.nes.mapper.ppuWrite(adr, value);
    }
  
    this.readPalette = function(adr) {
      let palAdr = adr & 0x1f;
      if(palAdr >= 0x10 && (palAdr & 0x3) === 0) {
        palAdr -= 0x10;
      }
      let ret = this.paletteRam[palAdr];
      if(this.greyScale) {
        ret &= 0x30;
      }
      return ret;
    }
  
    this.writePalette = function(adr, value) {
      let palAdr = adr & 0x1f;
      if(palAdr >= 0x10 && (palAdr & 0x3) === 0) {
        palAdr -= 0x10;
      }
      this.paletteRam[palAdr] = value;
    }
  
    this.peak = function(adr) {
      switch(adr) {
        case 0:
        case 1: {
          return 0;
        }
        case 2: {
          let ret = 0;
          if(this.inVblank) {
            ret |= 0x80;
          }
          ret |= this.spriteZero ? 0x40 : 0;
          ret |= this.spriteOverflow ? 0x20 : 0;
          return ret;
        }
        case 3: {
          return 0;
        }
        case 4: {
          return this.oamRam[this.oamAddress];
        }
        case 5:
        case 6: {
          return 0;
        }
        case 7: {
          let adr = this.v & 0x3fff;
          let temp = this.readBuffer;
          if(adr >= 0x3f00) {
            temp = this.readPalette(adr);
          }
          return temp;
        }
      }
    }
  
    this.read = function(adr) {
      switch(adr) {
        case 0: {
          return 0;
        }
        case 1: {
          return 0;
        }
        case 2: {
          this.w = 0;
          let ret = 0;
          if(this.inVblank) {
            ret |= 0x80;
            this.inVblank = false;
          }
          ret |= this.spriteZero ? 0x40 : 0;
          ret |= this.spriteOverflow ? 0x20 : 0;
          return ret;
        }
        case 3: {
          return 0;
        }
        case 4: {
          return this.oamRam[this.oamAddress];
        }
        case 5: {
          return 0;
        }
        case 6: {
          return 0;
        }
        case 7: {
          let adr = this.v & 0x3fff;
          if(
            (this.bgRendering || this.sprRendering) &&
            (this.line < 240 || this.line === 261)
          ) {
            this.incrementVy();
            this.incrementVx();
          } else {
            this.v += this.vramIncrement;
            this.v &= 0x7fff;
          }
          let temp = this.readBuffer;
          if(adr >= 0x3f00) {
            temp = this.readPalette(adr);
          }
          this.readBuffer = this.readInternal(adr);
          return temp;
        }
      }
    }
  
    this.write = function(adr, value) {
      switch(adr) {
        case 0: {
          this.t &= 0x73ff;
          this.t |= (value & 0x3) << 10;
  
          this.vramIncrement = (value & 0x04) > 0 ? 32 : 1;
          this.spritePatternBase = (value & 0x08) > 0 ? 0x1000 : 0;
          this.bgPatternBase = (value & 0x10) > 0 ? 0x1000 : 0;
          this.spriteHeight = (value & 0x20) > 0 ? 16 : 8;
          let oldNmi = this.generateNmi;
          this.slave = (value & 0x40) > 0;
          this.generateNmi = (value & 0x80) > 0;
  
          if(this.generateNmi && !oldNmi && this.inVblank) {
            this.nes.cpu.nmiWanted = true;
          }
          return;
        }
        case 1: {
          this.greyScale = (value & 0x01) > 0;
          this.bgInLeft = (value & 0x02) > 0;
          this.sprInLeft = (value & 0x04) > 0;
          this.bgRendering = (value & 0x08) > 0;
          this.sprRendering = (value & 0x10) > 0;
          this.emphasis = (value & 0xe0) >> 5;
          return;
        }
        case 2: {
          return;
        }
        case 3: {
          this.oamAddress = value;
          return;
        }
        case 4: {
          this.oamRam[this.oamAddress++] = value;
          this.oamAddress &= 0xff;
          return;
        }
        case 5: {
          if(this.w === 0) {
            this.t &= 0x7fe0;
            this.t |= (value & 0xf8) >> 3;
            this.x = value & 0x7;
            this.w = 1;
          } else {
            this.t &= 0x0c1f;
            this.t |= (value & 0x7) << 12;
            this.t |= (value & 0xf8) << 2;
            this.w = 0;
          }
          return;
        }
        case 6: {
          if(this.w === 0) {
            this.t &= 0xff;
            this.t |= (value & 0x3f) << 8;
            this.w = 1;
          } else {
            this.t &= 0x7f00;
            this.t |= value;
            this.v = this.t;
            this.w = 0;
          }
          return;
        }
        case 7: {
          let adr = this.v & 0x3fff;
          if(
            (this.bgRendering || this.sprRendering) &&
            (this.line < 240 || this.line === 261)
          ) {
            this.incrementVy();
            this.incrementVx();
          } else {
            this.v += this.vramIncrement;
            this.v &= 0x7fff;
          }
          if(adr >= 0x3f00) {
            this.writePalette(adr, value);
            return;
          }
          this.writeInternal(adr, value);
          return;
        }
      }
    }
  
    this.nesPal = [
      [101,101,101],[0,45,105],[19,31,127],[60,19,124],[96,11,98],[115,10,55],[113,15,7],[90,26,0],[52,40,0],[11,52,0],[0,60,0],[0,61,16],[0,56,64],[0,0,0],[0,0,0],[0,0,0],
      [174,174,174],[15,99,179],[64,81,208],[120,65,204],[167,54,169],[192,52,112],[189,60,48],[159,74,0],[109,92,0],[54,109,0],[7,119,4],[0,121,61],[0,114,125],[0,0,0],[0,0,0],[0,0,0],
      [254,254,255],[93,179,255],[143,161,255],[200,144,255],[247,133,250],[255,131,192],[255,139,127],[239,154,73],[189,172,44],[133,188,47],[85,199,83],[60,201,140],[62,194,205],[78,78,78],[0,0,0],[0,0,0],
      [254,254,255],[188,223,255],[209,216,255],[232,209,255],[251,205,253],[255,204,229],[255,207,202],[248,213,180],[228,220,168],[204,227,169],[185,232,184],[174,232,208],[175,229,234],[182,182,182],[0,0,0],[0,0,0]
    ]
  
  }
  
  