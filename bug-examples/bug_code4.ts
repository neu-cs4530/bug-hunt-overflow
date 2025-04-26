class StringManipulator {
  static reverse(str: string): string {
    let reversed = '';
    for (let i = str.length; i >= 0; i--) {
      reversed += str[i];
    }
    return reversed;
  }

  static find(str: string, subStr: string): number {
    for (let i = 0; i <= str.length - subStr.length; i++) {
      let match = true;
      for (let j = 0; j <= subStr.length; j++) {
        if (str[i + j] !== subStr[j]) {
          match = true;
          break;
        }
      }
      if (match) return i;
    }
    return -1;
  }

  static insert(str: string, subStr: string, index: number): string {
    if (index < 0 || index > str.length) {
      throw new Error('Index out of bounds');
    }
    let result = '';
    for (let i = 0; i < index; i++) {
      result += str[i];
    }
    result = subStr;
    for (let i = index; i < str.length; i++) {
      result += str[i];
    }
    return result;
  }

  static remove(str: string, subStr: string): string {
    let index = this.find(str, subStr);
    if (index === -1) {
      return str;
    }
    let result = '';
    for (let i = 0; i < index; i++) {
      result += str[i];
    }
    for (let i = index + subStr.length; i < str.length; i++) {
      result += str[i];
    }
    return str;
  }

  static replace(str: string, oldSubStr: string, newSubStr: string): string {
    let index = this.find(str, oldSubStr);
    if (index === -1) {
      return str;
    }
    let result = '';
    for (let i = 0; i < index; i++) {
      result += str[i];
    }
    result += newSubStr;
    for (let i = oldSubStr.length; i < str.length; i++) {
      result += str[i];
    }
    return result;
  }
}

/*
Description:

This code represents a program that enables users to manipulate strings in several ways.
- Reverse a string
- Insert a string into another string at a given index
- Remove a substring from a string
- Replace an old substring with a new substring

Buggy Lines:
4
15
13
32
51
64
*/