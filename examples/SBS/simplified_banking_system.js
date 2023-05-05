"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Customer = exports.Account = exports.Bank = void 0;
var custom_collection_1 = require("./custom_collection");
var Bank = /** @class */ (function () {
    function Bank(name) {
        this.name = name;
        this._accounts = new custom_collection_1.CustomCollection(1, null);
        this._customers = new custom_collection_1.CustomCollection(1, null);
    }
    Bank.prototype.createCustomerAndAccount = function (name, ssn, accountNumber) {
        var newCustomer = new Customer(name, ssn, null);
        var newAccount = new Account(accountNumber, newCustomer);
        newCustomer.setAccountOwned(newAccount);
        this.addCustomer(newCustomer);
        this.addAccount(newAccount);
        console.log(newCustomer);
        return newCustomer;
    };
    Bank.prototype.addAccount = function (account) {
        this._accounts.add(account);
    };
    Bank.prototype.addCustomer = function (customer) {
        this._customers.add(customer);
    };
    return Bank;
}());
exports.Bank = Bank;
var Account = /** @class */ (function () {
    function Account(accountNumber, owner) {
        this.accountNumber = accountNumber;
        this.balance = 0;
        this._ownedBy = owner;
        this._transactions = new custom_collection_1.CustomCollection(0, 2);
    }
    Account.prototype.addTransaction = function (transaction) {
        if (transaction.type === "deposit") {
            this.balance += transaction.amount;
        }
        else if (transaction.type === "withdrawal") {
            this.balance -= transaction.amount;
        }
        this._transactions.add(transaction);
    };
    Account.prototype.getTransactions = function () {
        return this._transactions;
    };
    Account.prototype.getOwnedBy = function () {
        return this._ownedBy;
    };
    Account.prototype.setOwnedBy = function (customer) {
        this._ownedBy = customer;
    };
    return Account;
}());
exports.Account = Account;
var Customer = /** @class */ (function () {
    function Customer(name, ssn, account) {
        this.name = name;
        this.ssn = ssn;
        this._accountOwned = account;
    }
    Customer.prototype.getAccountOwned = function () {
        return this._accountOwned;
    };
    Customer.prototype.setAccountOwned = function (account) {
        this._accountOwned = account;
    };
    return Customer;
}());
exports.Customer = Customer;
var Transaction = /** @class */ (function () {
    function Transaction(transactionID, amount, type, account) {
        this.transactionID = transactionID;
        this.amount = amount;
        this._accountInvolved = account;
        this.type = type;
    }
    return Transaction;
}());
exports.Transaction = Transaction;
