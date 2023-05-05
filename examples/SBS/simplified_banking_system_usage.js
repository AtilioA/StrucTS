"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simplified_banking_system_1 = require("./simplified_banking_system");
var bank = new simplified_banking_system_1.Bank("SBS Bank");
var customerData = [
    { name: "John Doe", ssn: "123-45-6789", accountNumber: "M0001" },
    { name: "Jane Smith", ssn: "987-65-4321", accountNumber: "M0002" },
    { name: "Alice Brown", ssn: "555-55-5555", accountNumber: "M0003" }
];
var customers = [];
var accounts = [];
customerData.forEach(function (data) {
    var customer = bank.createCustomerAndAccount(data.name, data.ssn, data.accountNumber);
    // Add customer to customers array, and add account to accounts array (if it exists, but it should)
    customers.push(customer);
    var currentAccount = customer.getAccountOwned();
    if (currentAccount) {
        accounts.push(currentAccount);
    }
});
// Create transactions for each account
var transactions = [
    new simplified_banking_system_1.Transaction("T0001", 500, "deposit", accounts[0]),
    new simplified_banking_system_1.Transaction("T0002", 1000, "deposit", accounts[1]),
    new simplified_banking_system_1.Transaction("T0003", 250, "deposit", accounts[2]),
    new simplified_banking_system_1.Transaction("T0004", 300, "withdrawal", accounts[0]),
    new simplified_banking_system_1.Transaction("T0005", 200, "withdrawal", accounts[1]),
    new simplified_banking_system_1.Transaction("T0006", 100, "withdrawal", accounts[2])
];
// Add transactions to accounts randomly
transactions.forEach(function (transaction) {
    var accountIndex = Math.floor(Math.random() * accounts.length);
    var account = accounts[accountIndex];
    account.addTransaction(transaction);
});
// Log bank details
console.log("Bank: ".concat(bank.name));
console.log("Customers:");
customers.forEach(function (customer) {
    var _a;
    console.log("  ".concat(customer.name, " (").concat(customer.ssn, ") - Account: ").concat((_a = customer.getAccountOwned()) === null || _a === void 0 ? void 0 : _a.accountNumber));
});
console.log("Accounts:");
accounts.forEach(function (account) {
    console.log("  ".concat(account.accountNumber, " - Owner: ").concat(account.getOwnedBy().name, " - Balance: $").concat(account.balance.toFixed(2)));
    console.log("  Transactions:");
    account.getTransactions().getItems().forEach(function (transaction) {
        console.log("    ".concat(transaction.transactionID, " - Type: ").concat(transaction.type, " - Amount: $").concat(transaction.amount.toFixed(2)));
    });
});
