import { CustomCollection } from '../../src/core/custom_collection';

class Bank {
	name: string;
	private readonly _accounts: CustomCollection<Account>;
	private readonly _customers: CustomCollection<Customer>;

	constructor(parameterName: string) {
		this.name = parameterName;
		this._accounts = new CustomCollection<Account>(1, null);
		this._customers = new CustomCollection<Customer>(1, null);
	}

	createCustomerAndAccount(name: string, ssn: string, accountNumber: string): Customer {
		const newCustomer = new Customer(name, ssn, null);
		const newAccount = new Account(accountNumber, newCustomer);
		newCustomer.setAccountOwned(newAccount);

		this.addCustomer(newCustomer);
		this.addAccount(newAccount);

		console.log(newCustomer);
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
	private readonly _transactions: CustomCollection<Transaction>;

	constructor(parameterAccountNumber: string, owner: Customer) {
		this.accountNumber = parameterAccountNumber;
		this.balance = 0;
		this._ownedBy = owner;
		this._transactions = new CustomCollection<Transaction>(0, null);
	}

	addTransaction(transaction: Transaction): void {
		if (transaction.type === 'deposit') {
			this.balance += transaction.amount;
		} else if (transaction.type === 'withdrawal') {
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

	constructor(parameterName: string, parameterSsn: string, parameterAccount: Account | null) {
		this.name = parameterName;
		this.ssn = parameterSsn;
		this._accountOwned = parameterAccount;
	}

	getAccountOwned(): Account | null {
		return this._accountOwned;
	}

	setAccountOwned(account: Account) {
		this._accountOwned = account;
	}
}

class Transaction {
	transactionId: string;
	amount: number;
	type: 'deposit' | 'withdrawal';
	private readonly _accountInvolved: Account;

	constructor(parameterTransactionId: string, parameterAmount: number, parameterType: 'deposit' | 'withdrawal', account: Account) {
		this.transactionId = parameterTransactionId;
		this.amount = parameterAmount;
		this.type = parameterType;
		this._accountInvolved = account;
	}
}

export { Bank, Account, Customer, Transaction };
