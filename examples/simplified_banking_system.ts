import { CustomCollection } from "./custom_collection";

class Bank {
  name: string;
  private _accounts: CustomCollection<Account>;
  private _customers: CustomCollection<Customer>;

  constructor(name: string) {
    this.name = name;
    this._accounts = new CustomCollection<Account>(1, null);
    this._customers = new CustomCollection<Customer>(1, null);
  }

  createCustomerAndAccount(name: string, ssn: string, accountNumber: string): Customer {
    const newCustomer = new Customer(name, ssn, null);
    const newAccount = new Account(accountNumber, newCustomer);
    newCustomer.setAccountOwned(newAccount);

    this.addCustomer(newCustomer);
    this.addAccount(newAccount);

    console.log(newCustomer)
    return newCustomer;
  }

  addAccount(account: Account): void {
    this._accounts.add(account);
  }

  addCustomer(customer: Customer): void {
    this._customers.add(customer);
  }
}

class Account {
  accountNumber: string;
  balance: number;
  private _ownedBy: Customer;
  private _transactions: CustomCollection<Transaction>;

  constructor(accountNumber: string, owner: Customer) {
    this.accountNumber = accountNumber;
    this.balance = 0;
    this._ownedBy = owner;
    this._transactions = new CustomCollection<Transaction>(0, null);
  }

  addTransaction(transaction: Transaction): void {
    if (transaction.type === "deposit") {
      this.balance += transaction.amount;
    } else if (transaction.type === "withdrawal") {
      this.balance -= transaction.amount;
    this._transactions.add(transaction);
    }
  }

  getTransactions(): CustomCollection<Transaction> {
    return this._transactions;
  }

  getOwnedBy(): Customer {
    return this._ownedBy;
  }

  setOwnedBy(customer: Customer) {
    this._ownedBy = customer;
  }
}

class Customer {
  name: string;
  ssn: string;
  private _accountOwned: Account | null;

  constructor(name: string, ssn: string, account: Account | null) {
    this.name = name;
    this.ssn = ssn;
    this._accountOwned = account;
  }

  getAccountOwned(): Account | null {
    return this._accountOwned;
  }

  setAccountOwned(account: Account) {
    this._accountOwned = account;
  }

}

class Transaction {
  transactionID: string;
  amount: number;
  type: "deposit" | "withdrawal";
  private _accountInvolved: Account;

  constructor(transactionID: string, amount: number, type: "deposit" | "withdrawal", account: Account) {
    this.transactionID = transactionID;
    this.amount = amount;
    this._accountInvolved = account;
    this.type = type;
  }
}

export { Bank, Account, Customer, Transaction };
