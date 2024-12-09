let mappers = [];

mappers[7] = function(nes, rom, header) {
    this.name = "AxROM";
    this.version = 1;
  
    this.nes = nes;
  
    this.rom = rom;
  
    this.h = header;
  
    this.chrRam = new Uint8Array(0x2000);
    this.ppuRam = new Uint8Array(0x800);
  
    this.reset = function(hard) {
      if(hard) {
        // clear chr ram
        for(let i = 0; i < this.chrRam.length; i++) {
          this.chrRam[i] = 0;
        }
        // clear ppu ram
        for(let i = 0; i < this.ppuRam.length; i++) {
          this.ppuRam[i] = 0;
        }
      }
  
      this.prgBank = 0;
      this.mirroring = 0;
    }
    this.reset(true);
    this.saveVars = [
      "name", "chrRam", "ppuRam", "prgBank", "mirroring"
    ];
  
    this.getBattery = function() {
      return [];
    }
  
    this.setBattery = function(data) {
      return true;
    }
  
    this.getRomAdr = function(adr) {
      let final = this.prgBank * 0x8000 + (adr & 0x7fff);
      return final & this.h.prgAnd;
    }
  
    this.getMirroringAdr = function(adr) {
      if(this.mirroring === 0) {
        // A
        return adr & 0x3ff;
      } else {
        // B
        return 0x400 + (adr & 0x3ff);
      }
    }
  
    this.getChrAdr = function(adr) {
      return adr;
    }
  
    this.peak = function(adr) {
      return this.read(adr);
    }
  
    this.read = function(adr) {
      if(adr < 0x8000) {
        return 0; // not readable
      }
      return this.rom[this.h.base + this.getRomAdr(adr)];
    }
  
    this.write = function(adr, value) {
      if(adr < 0x8000) {
        return; // no mapper registers or rpg-ram
      }
      this.prgBank = value & 0xf;
      this.mirroring = (value & 0x10) >> 4;
    }
  
    this.ppuPeak = function(adr) {
      return this.ppuRead(adr);
    }
  
    // ppu-read
    this.ppuRead = function(adr) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-write
    this.ppuWrite = function(adr, value) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          this.chrRam[this.getChrAdr(adr)] = value;
          return;
        } else {
          // not writable
          return;
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)] = value;
      }
    }
  
  }

  mappers[3] = function(nes, rom, header) {
    this.name = "CNROM";
    this.version = 1;
  
    this.nes = nes;
  
    this.rom = rom;
  
    this.h = header;
  
    this.chrRam = new Uint8Array(0x2000);
    this.ppuRam = new Uint8Array(0x800);
  
    this.reset = function(hard) {
      if(hard) {
        // clear chr ram
        for(let i = 0; i < this.chrRam.length; i++) {
          this.chrRam[i] = 0;
        }
        // clear ppu ram
        for(let i = 0; i < this.ppuRam.length; i++) {
          this.ppuRam[i] = 0;
        }
      }
  
      this.chrBank = 0;
    }
    this.reset(true);
    this.saveVars = [
      "name", "chrRam", "ppuRam", "chrBank"
    ];
  
    this.getBattery = function() {
      return [];
    }
  
    this.setBattery = function(data) {
      return true;
    }
  
    this.getRomAdr = function(adr) {
      if(this.banks === 2) {
        return adr & 0x7fff;
      }
      return adr & 0x3fff;
    }
  
    this.getMirroringAdr = function(adr) {
      if(this.h.verticalMirroring) {
        return adr & 0x7ff;
      } else {
        // horizontal
        return (adr & 0x3ff) | ((adr & 0x800) >> 1);
      }
    }
  
    this.getChrAdr = function(adr) {
      let final = this.chrBank * 0x2000 + (adr & 0x1fff);
      return final & this.h.chrAnd;
    }
  
    this.peak = function(adr) {
      return this.read(adr);
    }
  
    this.read = function(adr) {
      if(adr < 0x8000) {
        return 0; // not readable
      }
      return this.rom[this.h.base + this.getRomAdr(adr)];
    }
  
    this.write = function(adr, value) {
      if(adr < 0x8000) {
        return; // no mapper registers or prg ram
      }
      this.chrBank = value;
    }
  
    this.ppuPeak = function(adr) {
      return this.ppuRead(adr);
    }
  
    // ppu-read
    this.ppuRead = function(adr) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-write
    this.ppuWrite = function(adr, value) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          this.chrRam[this.getChrAdr(adr)] = value;
          return;
        } else {
          // not writable
          return;
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)] = value;
      }
    }
  
  }

  mappers[1] = function(nes, rom, header) {
    this.name = "MMC1";
    this.version = 1;
  
    this.nes = nes;
  
    this.rom = rom;
  
    this.h = header;
  
    this.chrRam = new Uint8Array(0x2000);
    this.prgRam = new Uint8Array(0x2000);
    this.ppuRam = new Uint8Array(0x800);
  
    this.reset = function(hard) {
      if(hard) {
        // clear chr ram
        for(let i = 0; i < this.chrRam.length; i++) {
          this.chrRam[i] = 0;
        }
        // clear prg ram, only if not battery backed
        if(!this.h.battery) {
          for(let i = 0; i < this.prgRam.length; i++) {
            this.prgRam[i] = 0;
          }
        }
        // clear ppu ram
        for(let i = 0; i < this.ppuRam.length; i++) {
          this.ppuRam[i] = 0;
        }
      }
  
      this.shiftReg = 0;
      this.shiftCount = 0;
  
      this.mirroring = 0;
      this.prgMode = 3;
      this.chrMode = 1;
      this.chrBank0 = 0;
      this.chrBank1 = 0;
      this.prgBank = 0;
      this.ramEnable = 0;
    }
    this.reset(true);
    this.saveVars = [
      "name", "chrRam", "prgRam", "ppuRam", "shiftReg", "shiftCount", "mirroring",
      "prgMode", "chrMode", "chrBank0", "chrBank1", "prgBank", "ramEnable"
    ];
  
    this.getBattery = function() {
      return Array.prototype.slice.call(this.prgRam);
    }
  
    this.setBattery = function(data) {
      if(data.length !== 0x2000) {
        return false;
      }
      this.prgRam = new Uint8Array(data);
      return true;
    }
  
    this.getRomAdr = function(adr) {
      let final = 0;
      switch(this.prgMode) {
        case 0:
        case 1: {
          final = 0x8000 * (this.prgBank >> 1) + (adr & 0x7fff);
          break;
        }
        case 2: {
          if(adr < 0xc000) {
            final = adr & 0x3fff;
          } else {
            final = this.prgBank * 0x4000 + (adr & 0x3fff);
          }
          break;
        }
        case 3: {
          if(adr < 0xc000) {
            final = this.prgBank * 0x4000 + (adr & 0x3fff);
          } else {
            final = (this.h.banks - 1) * 0x4000 + (adr & 0x3fff);
          }
          break;
        }
      }
      return final & this.h.prgAnd;
    }
  
    this.getMirroringAdr = function(adr) {
      switch(this.mirroring) {
        case 0: {
          // 1-screen A
          return adr & 0x3ff;
        }
        case 1: {
          // 1-screen B
          return 0x400 + (adr & 0x3ff);
        }
        case 2: {
          // vertical
          return adr & 0x7ff;
        }
        case 3: {
          // horizontal
          return (adr & 0x3ff) | ((adr & 0x800) >> 1);
        }
      }
    }
  
    this.getChrAdr = function(adr) {
      let final = 0;
      if(this.chrMode === 1) {
        if(adr < 0x1000) {
          final = this.chrBank0 * 0x1000 + (adr & 0xfff);
        } else {
          final = this.chrBank1 * 0x1000 + (adr & 0xfff);
        }
      } else {
        final = (this.chrBank0 >> 1) * 0x2000 + (adr & 0x1fff);
      }
      return final & this.h.chrAnd;
    }
  
    this.peak = function(adr) {
      return this.read(adr);
    }
  
    this.read = function(adr) {
      if(adr < 0x6000) {
        return 0; // not readable
      }
      if(adr < 0x8000) {
        if(this.ramEnable === 1) {
          return 0; // not enabled
        }
        return this.prgRam[adr & 0x1fff];
      }
      return this.rom[this.h.base + this.getRomAdr(adr)];
    }
  
    this.write = function(adr, value) {
      if(adr < 0x6000) {
        return; // no mapper registers
      }
      if(adr < 0x8000) {
        if(this.ramEnable === 1) {
          return; // not enabled
        }
        this.prgRam[adr & 0x1fff] = value;
        return;
      }
      if((value & 0x80) > 0) {
        this.shiftCount = 0;
        this.shiftReg = 0;
      } else {
        this.shiftReg |= (value & 0x1) << this.shiftCount;
        this.shiftCount++;
        if(this.shiftCount === 5) {
          switch((adr & 0x6000) >> 13) {
            case 0: {
              this.mirroring = this.shiftReg & 0x3;
              this.prgMode = (this.shiftReg & 0xc) >> 2;
              this.chrMode = (this.shiftReg & 0x10) >> 4;
              break;
            }
            case 1: {
              this.chrBank0 = this.shiftReg;
              break;
            }
            case 2: {
              this.chrBank1 = this.shiftReg;
              break;
            }
            case 3: {
              this.prgBank = this.shiftReg & 0xf;
              this.ramEnable = (this.shiftReg & 0x10) >> 4;
              break;
            }
          }
          this.shiftCount = 0;
          this.shiftReg = 0;
        }
      }
    }
  
    this.ppuPeak = function(adr) {
      return this.ppuRead(adr);
    }
  
    // ppu-read
    this.ppuRead = function(adr) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-write
    this.ppuWrite = function(adr, value) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          this.chrRam[this.getChrAdr(adr)] = value;
          return;
        } else {
          // not writable
          return;
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)] = value;
      }
    }
  
  }

  mappers[4] = function(nes, rom, header) {
    this.name = "MMC3";
    this.version = 1;
  
    this.nes = nes;
  
    this.rom = rom;
  
    this.h = header;
  
    this.chrRam = new Uint8Array(0x2000);
    this.prgRam = new Uint8Array(0x2000);
    this.ppuRam = new Uint8Array(0x800);
  
    this.bankRegs = new Uint8Array(8);
  
    this.reset = function(hard) {
      if(hard) {
        // clear chr ram
        for(let i = 0; i < this.chrRam.length; i++) {
          this.chrRam[i] = 0;
        }
        // clear prg ram, only if not battery backed
        if(!this.h.battery) {
          for(let i = 0; i < this.prgRam.length; i++) {
            this.prgRam[i] = 0;
          }
        }
        // clear ppu ram
        for(let i = 0; i < this.ppuRam.length; i++) {
          this.ppuRam[i] = 0;
        }
      }
      for(let i = 0; i < this.bankRegs.length; i++) {
        this.bankRegs[i] = 0;
      }
  
      this.mirroring = 0;
      this.prgMode = 1;
      this.chrMode = 1;
      this.regSelect = 0;
  
      this.reloadIrq = false;
      this.irqLatch = 0;
      this.irqEnabled = false;
      this.irqCounter = 0;
  
      this.lastRead = 0;
    }
    this.reset(true);
    this.saveVars = [
      "name", "chrRam", "prgRam", "ppuRam", "bankRegs", "mirroring", "prgMode",
      "chrMode", "regSelect", "reloadIrq", "irqLatch", "irqEnabled", "irqCounter",
      "lastRead"
    ];
  
    this.getBattery = function() {
      return Array.prototype.slice.call(this.prgRam);
    }
  
    this.setBattery = function(data) {
      if(data.length !== 0x2000) {
        return false;
      }
      this.prgRam = new Uint8Array(data);
      return true;
    }
  
    this.getRomAdr = function(adr) {
      let final = 0;
      if(this.prgMode === 1) {
        if(adr < 0xa000) {
          final = ((this.h.banks * 2) - 2) * 0x2000 + (adr & 0x1fff);
        } else if(adr < 0xc000) {
          final = this.bankRegs[7] * 0x2000 + (adr & 0x1fff);
        } else if(adr < 0xe000) {
          final = this.bankRegs[6] * 0x2000 + (adr & 0x1fff);
        } else {
          final = ((this.h.banks * 2) - 1) * 0x2000 + (adr & 0x1fff);
        }
      } else {
        if(adr < 0xa000) {
          final = this.bankRegs[6] * 0x2000 + (adr & 0x1fff);
        } else if(adr < 0xc000) {
          final = this.bankRegs[7] * 0x2000 + (adr & 0x1fff);
        } else if(adr < 0xe000) {
          final = ((this.h.banks * 2) - 2) * 0x2000 + (adr & 0x1fff);
        } else {
          final = ((this.h.banks * 2) - 1) * 0x2000 + (adr & 0x1fff);
        }
      }
      return final & this.h.prgAnd;
    }
  
    this.getMirroringAdr = function(adr) {
      if(this.mirroring === 0) {
        // vertical
        return adr & 0x7ff;
      } else {
        // horizontal
        return (adr & 0x3ff) | ((adr & 0x800) >> 1);
      }
    }
  
    this.getChrAdr = function(adr) {
      if(this.chrMode === 1) {
        adr ^= 0x1000;
      }
      let final = 0;
      if(adr < 0x800) {
        final = (this.bankRegs[0] >> 1) * 0x800 + (adr & 0x7ff);
      } else if(adr < 0x1000) {
        final = (this.bankRegs[1] >> 1) * 0x800 + (adr & 0x7ff);
      } else if(adr < 0x1400) {
        final = this.bankRegs[2] * 0x400 + (adr & 0x3ff);
      } else if(adr < 0x1800) {
        final = this.bankRegs[3] * 0x400 + (adr & 0x3ff);
      } else if(adr < 0x1c00) {
        final = this.bankRegs[4] * 0x400 + (adr & 0x3ff);
      } else {
        final = this.bankRegs[5] * 0x400 + (adr & 0x3ff);
      }
      return final & this.h.chrAnd;
    }
  
    this.clockIrq = function() {
      if(this.irqCounter === 0 || this.reloadIrq) {
        this.irqCounter = this.irqLatch;
        this.reloadIrq = false;
      } else {
        this.irqCounter--;
        this.irqCounter &= 0xff;
      }
      if(this.irqCounter === 0 && this.irqEnabled) {
        this.nes.mapperIrqWanted = true;
      }
    }
  
    this.peak = function(adr) {
      return this.read(adr);
    }
  
    this.read = function(adr) {
      if(adr < 0x6000) {
        return 0; // not readable
      }
      if(adr < 0x8000) {
        return this.prgRam[adr & 0x1fff];
      }
      return this.rom[this.h.base + this.getRomAdr(adr)];
    }
  
    this.write = function(adr, value) {
      if(adr < 0x6000) {
        return; // no mapper registers
      }
      if(adr < 0x8000) {
        this.prgRam[adr & 0x1fff] = value;
        return;
      }
      switch(adr & 0x6001) {
        case 0x0000: {
          this.regSelect = value & 0x7;
          this.prgMode = (value & 0x40) >> 6;
          this.chrMode = (value & 0x80) >> 7;
          break;
        }
        case 0x0001: {
          this.bankRegs[this.regSelect] = value;
          break;
        }
        case 0x2000: {
          this.mirroring = value & 0x1;
          break;
        }
        case 0x2001: {
          // ram protection not implemented
          break;
        }
        case 0x4000: {
          this.irqLatch = value;
          break;
        }
        case 0x4001: {
          this.reloadIrq = true;
          break;
        }
        case 0x6000: {
          this.irqEnabled = false;
          this.nes.mapperIrqWanted = false;
          break;
        }
        case 0x6001: {
          this.irqEnabled = true;
          break;
        }
      }
    }
  
    this.ppuPeak = function(adr) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-read
    this.ppuRead = function(adr) {
      if(adr < 0x2000) {
        // A12 should be ignored for 8 cycles after going high
        // see https://forums.nesdev.com/viewtopic.php?f=3&t=17290#p217456
        // ignore for nametables, for now
        if((this.lastRead & 0x1000) === 0 && (adr & 0x1000) > 0) {
          // A12 went high, clock irq
          this.clockIrq();
        }
        this.lastRead = adr;
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-write
    this.ppuWrite = function(adr, value) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          this.chrRam[this.getChrAdr(adr)] = value;
          return;
        } else {
          // not writable
          return;
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)] = value;
      }
    }
  
  }

  mappers[0] = function(nes, rom, header) {
    this.name = "NROM";
    this.version = 1;
  
    this.nes = nes;
  
    this.rom = rom;
  
    this.h = header;
  
    this.chrRam = new Uint8Array(0x2000);
    this.prgRam = new Uint8Array(0x2000);
    this.ppuRam = new Uint8Array(0x800);
  
    this.reset = function(hard) {
      if(hard) {
        // clear chr ram
        for(let i = 0; i < this.chrRam.length; i++) {
          this.chrRam[i] = 0;
        }
        // clear prg ram, only if not battery backed
        if(!this.h.battery) {
          for(let i = 0; i < this.prgRam.length; i++) {
            this.prgRam[i] = 0;
          }
        }
        // clear ppu ram
        for(let i = 0; i < this.ppuRam.length; i++) {
          this.ppuRam[i] = 0;
        }
      }
    }
    this.reset(true);
    this.saveVars = [
      "name", "chrRam", "prgRam", "ppuRam"
    ];
  
    this.getBattery = function() {
      return Array.prototype.slice.call(this.prgRam);
    }
  
    this.setBattery = function(data) {
      if(data.length !== 0x2000) {
        return false;
      }
      this.prgRam = new Uint8Array(data);
      return true;
    }
  
    this.getRomAdr = function(adr) {
      if(this.h.banks === 2) {
        return adr & 0x7fff;
      }
      return adr & 0x3fff;
    }
  
    this.getMirroringAdr = function(adr) {
      if(this.h.verticalMirroring) {
        return adr & 0x7ff;
      } else {
        // horizontal
        return (adr & 0x3ff) | ((adr & 0x800) >> 1);
      }
    }
  
    this.getChrAdr = function(adr) {
      return adr;
    }
  
    this.peak = function(adr) {
      return this.read(adr);
    }
  
    this.read = function(adr) {
      if(adr < 0x6000) {
        return 0; // not readable
      }
      if(adr < 0x8000) {
        return this.prgRam[adr & 0x1fff];
      }
      return this.rom[this.h.base + this.getRomAdr(adr)];
    }
  
    this.write = function(adr, value) {
      if(adr < 0x6000 || adr >= 0x8000) {
        return; // no mapper registers
      }
      this.prgRam[adr & 0x1fff] = value;
    }
  
    this.ppuPeak = function(adr) {
      return this.ppuRead(adr);
    }
  
    // ppu-read
    this.ppuRead = function(adr) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-write
    this.ppuWrite = function(adr, value) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          this.chrRam[this.getChrAdr(adr)] = value;
          return;
        } else {
          // not writable
          return;
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)] = value;
      }
    }
  
  }

  mappers[2] = function(nes, rom, header) {
    this.name = "UxROM";
    this.version = 1;
  
    this.nes = nes;
  
    this.rom = rom;
  
    this.h = header;
  
    this.chrRam = new Uint8Array(0x2000);
    this.ppuRam = new Uint8Array(0x800);
  
    this.reset = function(hard) {
      if(hard) {
        // clear chr ram
        for(let i = 0; i < this.chrRam.length; i++) {
          this.chrRam[i] = 0;
        }
        // clear ppu ram
        for(let i = 0; i < this.ppuRam.length; i++) {
          this.ppuRam[i] = 0;
        }
      }
  
      this.prgBank = 0;
    }
    this.reset(true);
    this.saveVars = [
      "name", "chrRam", "ppuRam", "prgBank"
    ];
  
    this.getBattery = function() {
      return [];
    }
  
    this.setBattery = function(data) {
      return true;
    }
  
    this.getRomAdr = function(adr) {
      let final = 0;
      if(adr < 0xc000) {
        final = this.prgBank * 0x4000 + (adr & 0x3fff);
      } else {
        final = (this.h.banks - 1) * 0x4000 + (adr & 0x3fff);
      }
      return final & this.h.prgAnd;
    }
  
    this.getMirroringAdr = function(adr) {
      if(this.h.verticalMirroring) {
        return adr & 0x7ff;
      } else {
        // horizontal
        return (adr & 0x3ff) | ((adr & 0x800) >> 1);
      }
    }
  
    this.getChrAdr = function(adr) {
      return adr;
    }
  
    this.peak = function(adr) {
      return this.read(adr);
    }
  
    this.read = function(adr) {
      if(adr < 0x8000) {
        return 0; // not readable
      }
      return this.rom[this.h.base + this.getRomAdr(adr)];
    }
  
    this.write = function(adr, value) {
      if(adr < 0x8000) {
        return; // no mapper registers or prg-ram
      }
      this.prgBank = value;
    }
  
    this.ppuPeak = function(adr) {
      return this.ppuRead(adr);
    }
  
    // ppu-read
    this.ppuRead = function(adr) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          return this.chrRam[this.getChrAdr(adr)];
        } else {
          return this.rom[this.h.chrBase + this.getChrAdr(adr)];
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)];
      }
    }
  
    // ppu-write
    this.ppuWrite = function(adr, value) {
      if(adr < 0x2000) {
        if(this.h.chrBanks === 0) {
          this.chrRam[this.getChrAdr(adr)] = value;
          return;
        } else {
          // not writable
          return;
        }
      } else {
        return this.ppuRam[this.getMirroringAdr(adr)] = value;
      }
    }
  
  }
            