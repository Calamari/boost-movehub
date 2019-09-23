
export class Color {
    COLOR_BLACK = 0x00
    COLOR_PINK = 0x01
    COLOR_PURPLE = 0x02
    COLOR_BLUE = 0x03
    COLOR_LIGHTBLUE = 0x04
    COLOR_CYAN = 0x05
    COLOR_GREEN = 0x06
    COLOR_YELLOW = 0x07
    COLOR_ORANGE = 0x09
    COLOR_RED = 0x09
    COLOR_WHITE = 0x0a
    COLOR_NONE = 0xFF
  
    constructor(data) {
      this.data = data
    }
  
    toString() {
      switch(this.data) {
        case this.COLOR_BLACK: return 'black';
        case this.COLOR_PINK: return 'pink';
        case this.COLOR_PURPLE: return 'purple';
        case this.COLOR_BLUE: return 'blue';
        case this.COLOR_LIGHTBLUE: return 'lightblue';
        case this.COLOR_CYAN: return 'cyan';
        case this.COLOR_GREEN: return 'green';
        case this.COLOR_YELLOW: return 'yellow';
        case this.COLOR_ORANGE: return 'orange';
        case this.COLOR_RED: return 'red';
        case this.COLOR_WHITE: return 'white';
        case this.COLOR_NONE: return 'none';
        default: return 'undefined'
      }
    }
  }
  