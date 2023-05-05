"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var library_management_system_1 = require("./library_management_system");
var library = new library_management_system_1.Library("My Local Library");
var books = [
    new library_management_system_1.Book("To Kill a Mockingbird", "Harper Lee", "9780060935467"),
    new library_management_system_1.Book("Pride and Prejudice", "Jane Austen", "9780141040349"),
    new library_management_system_1.Book("The Catcher in the Rye", "J.D. Salinger", "9780316769488"),
    new library_management_system_1.Book("1984", "George Orwell", "9780451524935"),
    new library_management_system_1.Book("Infinite Jest", "David Foster Wallace", "9780274994748"),
    new library_management_system_1.Book("Thinking, Fast and Slow", "Daniel Kahneman", "9780374533557"),
];
var members = [
    new library_management_system_1.Member("Alice", "M001"),
    new library_management_system_1.Member("Bob", "M002"),
    new library_management_system_1.Member("Charlie", "M003"),
];
books.forEach(function (book) { return library.addBook(book); });
members.forEach(function (member) { return library.addMember(member); });
var bookCount = books.length;
var memberCount = members.length;
for (var i = 0; i < 10; i++) {
    var bookIndex = Math.floor(Math.random() * bookCount);
    var memberIndex = Math.floor(Math.random() * memberCount);
    var book = books[bookIndex];
    var member = members[memberIndex];
    var operation = Math.random() < 0.5 ? "borrow" : "return";
    try {
        if (operation === "borrow") {
            console.log("".concat(member.name, " is borrowing ").concat(book.title, "."));
            member.borrowBook(book);
        }
        else {
            console.log("".concat(member.name, " is returning ").concat(book.title, "."));
            member.returnBook(book);
        }
    }
    catch (error) {
        console.error("An error occurred when trying to ".concat(operation, " Book \"").concat(book.title, "\" borrowed by Member \"").concat(member.name, "\": \"").concat(error, "\"\n"));
    }
}
