import { isAutomation } from '../../util/envHelper';

class RoomCodeGenerator {
  private usedCodes: Set<string> = new Set();

  generateRandomCode = (): string => {
    if (isAutomation()) {
      return '8722';
    }
    return Math.random().toString(10).substr(2, 4);
  };

  getNewCode = (): string => {
    let newCode = this.generateRandomCode();
    while (this.usedCodes.has(newCode)) {
      newCode = this.generateRandomCode();
    }
    this.usedCodes.add(newCode);
    console.log(this.usedCodes);
    return newCode;
  };

  releaseCode = (code: string) => {
    this.usedCodes.delete(code);
    console.log(this.usedCodes);
  };
}

export default new RoomCodeGenerator();
