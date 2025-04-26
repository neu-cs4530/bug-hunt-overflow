class Transaction {
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


/*
Description:

The purpose of this program is to manage a simple banking system. Each member of this bank should have a unique account number. Additionally, users should be able to deposit money into and withdraw money from their account.


Buggly Lines:
24
17
18
25
23
45
*/
