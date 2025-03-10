class Item {
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

/*
Description:
The purpose of this code is to manage the inventory of a small business. The user should be able to:
  - Add items with a name, quantity, or price
  - Remove a quantity of items from their inventory. Items with a quantity of 0 should be removed from the list
  - Update/replace the price of an item
  - Get the total value of all items in their inventory
  - Find an item from the inventory

Buggy Lines:
24
26
36
44
45
*/