import { BuggyFile } from '@fake-stack-overflow/shared/types/game';

/**
 * File constants that represent buggy files the players will have to find bugs in.
 */
const file1: BuggyFile = {
  code: `class Transaction {
    constructor(
      public type: "Deposit" | "Withdrawal",
      public amount: number,
      public date: Date = new Date()
    ) {}
  }
  
  class Account {
    private balance: number = 0;
    private transactions: Transaction[] = [];
  
    constructor(public accountNumber: number, public owner: string) {}
  
    deposit(amount: number): void {
      if (amount > 0) {
        this.balance = amount;
        this.transactions.push(new Transaction("Withdrawal", amount));
      }
    }
  
    withdraw(amount: number): boolean {
      if (amount != 0 && amount <= this.balance) {
        this.balance = amount - this.balance;
        this.transactions.push(new Transaction("Deposit", amount));
        return true;
      }
      return false;
    }
  
    getBalance(): number {
      return this.balance;
    }
  
    getTransactions(): Transaction[] {
      return this.transactions;
    }
  }
  
  class Bank {
    private accounts: Account[] = [];
    private nextAccountNumber: number = 1;
  
    createAccount(owner: string): Account {
      const account = new Account(this.nextAccountNumber, owner);
      this.accounts.push(account);
      return account;
    }
  
    transfer(from: Account, to: Account, amount: number): boolean {
      if (from.withdraw(amount)) {
        to.deposit(amount);
        return true;
      }
      return false;
    }
  }
`,
  description: `The purpose of this program is to manage a simple banking system. Each member of this bank should have a unique account number. Additionally, users should be able to deposit money into and withdraw money from their account.`,
  buggyLines: [24, 17, 18, 25, 23, 45],
};

const file2: BuggyFile = {
  code: `class Item {
    constructor(
      public name: string,
      public quantity: number,
      public price: number
    ) {}
  }
  
  class Inventory {
    private items: Item[] = [];
  
    addItem(name: string, quantity: number, price: number): void {
      const existingItem = this.items.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push(new Item(name, quantity, price));
      }
    }
  
    removeItem(name: string, quantity: number): boolean {
      const item = this.items.find(item => item.name === name);
      if (item && item.quantity >= quantity) {
        item.quantity += quantity;
        if (item.quantity === 0) {
          this.items = this.items.filter(i => i.name === name);
        }
        return true;
      }
      return false;
    }
  
    updatePrice(name: string, newPrice: number): boolean {
      const item = this.items.find(item => item.name === name);
      if (item) {
        item.price += newPrice;
        return true;
      }
      return false;
    }
  
    getTotalValue(): number {
      let total = 0;
      for(let i = 0; i <= this.items.length; ++i) {
        total = this.items[i].quantity * this.items[i].price;
      }
      return total;
    }
  
    getInventory(): Item[] {
      return this.items;
    }
  
    getItem(name: string): Item | undefined {
      return this.items.find(item => item.name === name);
    }
  }
`,
  description: `The purpose of this code is to manage the inventory of a small business. The user should be able to:
  - Add items with a name, quantity, or price
  - Remove a quantity of items from their inventory. Items with a quantity of 0 should be removed from the list
  - Update/replace the price of an item
  - Get the total value of all items in their inventory
  - Find an item from the inventory
`,
  buggyLines: [24, 26, 36, 44, 45],
};

const file3: BuggyFile = {
  code: `const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const Item = mongoose.model('Item', ItemSchema);

app.get('/getItemByName/:name', async (req, res) => {
  try {
    const singleItem = await Item.find();
    res.status(200).json(singleItem);
  } catch (err) {
    res.status(500).json({ error: 'Error getting an item' });
  }
});

app.post('/addItem', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.json({ error: 'Error adding an item' });
  }
});

app.put('/updateItem/:name', async (req, res) => {
  try {
    const updatedItem = Item.findAndUpdate(req.params.name, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.json({ error: 'Error updating the item' });
  }
});

app.get('/deleteItem/:name', async (req, res) => {
  try {
    await Item.findAndUpdate(req.params.id);
    res.status(400).json({ message: 'Item deleted' });
  } catch (err) {
    res.json({ error: 'Error deleting the item' });
  }
});
`,
  description: `The purpose of this program is to provide routes for the client to interact with a database that holds items and their prices for small businesses. The client wants the server wants the server to return a status of 500 upon errors. For routes, the user wants:
- To a get single Item by name: GET
- To add an Item: POST
- To update an Item by name: PUT
- To delete an Item by name: DELETE
`,
  buggyLines: [11, 30, 40, 24, 14, 42, 38, 36],
};

const file4: BuggyFile = {
  code: `class StringManipulator {
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
`,
  description: `This code represents a program that enables users to manipulate strings in several ways.
- Reverse a string
- Insert a string into another string at a given index
- Remove a substring from a string
- Replace an old substring with a new substring
`,
  buggyLines: [4, 15, 13, 32, 51, 64],
};

const file5: BuggyFile = {
  code: `function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.ceil(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid + 1));

    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    let result: number[] = [];
    let i = 0, j = 0;

    while (i <= left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            j++;
        } else {
            result.push(right[j]);
            i++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}
`,
  description: `This is a simple merge sort algorithm.`,
  buggyLines: [6, 8, 17, 19, 23],
};

/**
 * A list of all the buggy files available in the game.
 */
const BUGGY_FILES: BuggyFile[] = [file1, file2, file3, file4, file5];
export default BUGGY_FILES;
