import { Bank, type Account, type Customer, Transaction } from './simplified_banking_system';

const bank = new Bank('SBS Bank');

const customerData = [
	{ name: 'John Doe', ssn: '123-45-6789', accountNumber: 'M0001' },
	{ name: 'Jane Smith', ssn: '987-65-4321', accountNumber: 'M0002' },
	{ name: 'Alice Brown', ssn: '555-55-5555', accountNumber: 'M0003' },
];

const customers: Customer[] = [];
const accounts: Account[] = [];

for (const data of customerData) {
	const customer = bank.createCustomerAndAccount(data.name, data.ssn, data.accountNumber);

	// Add customer to customers array, and add account to accounts array (if it exists, but it should)
	customers.push(customer);
	const currentAccount = customer.getAccountOwned();
	if (currentAccount) {
		accounts.push(currentAccount);
	}
}

// Create transactions for each account
const transactions = [
	new Transaction('T0001', 500, 'deposit', accounts[0]),
	new Transaction('T0002', 1000, 'deposit', accounts[1]),
	new Transaction('T0003', 250, 'deposit', accounts[2]),
	new Transaction('T0004', 300, 'withdrawal', accounts[0]),
	new Transaction('T0005', 200, 'withdrawal', accounts[1]),
	new Transaction('T0006', 100, 'withdrawal', accounts[2]),
];

// Add transactions to accounts randomly
for (const transaction of transactions) {
	const accountIndex = Math.floor(Math.random() * accounts.length);
	const account = accounts[accountIndex];
	account.addTransaction(transaction);
}

// Log bank details
console.log(`Bank: ${bank.name}`);
console.log('Customers:');
for (const customer of customers) {
	console.log(`  ${customer.name} (${customer.ssn}) - Account: ${customer.getAccountOwned()?.accountNumber}`);
}

console.log('Accounts:');
for (const account of accounts) {
	console.log(`  ${account.accountNumber} - Owner: ${account.getOwnedBy().name} - Balance: $${account.balance.toFixed(2)}`);
	console.log('  Transactions:');
	for (const transaction of account.getTransactions().getItems()) {
		console.log(`    ${transaction.transactionId} - Type: ${transaction.type} - Amount: $${transaction.amount.toFixed(2)}`);
	}
}
