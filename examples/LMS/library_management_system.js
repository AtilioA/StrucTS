"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = exports.Book = exports.Library = void 0;
// The LMS code below uses the CustomCollection export class to enforce cardinality constraints for the Library, Book, and Member export classes. Each Library has a collection of Book and Member instances, while each Member has a collection of borrowed Book instances.
// The generic type (T) will be used to specify the type of item that can be added to the collection. Must not be exported.
var CustomCollection = /** @class */ (function () {
    // The constructor takes the minimum number of items and the maximum number of items as parameters.
    // The maxItems parameter is optional and can be null, meaning that there is no maximum number of items.
    function CustomCollection(minItems, maxItems) {
        this.minItems = minItems;
        this.maxItems = maxItems;
        // The items array is initialized to an empty array.
        this.items = [];
    }
    /**
     * Add an item to the collection.
     *
     * @param item The item to add
     * @return true if the item was added; false otherwise
     * @throws An error if the cardinality constraint is violated (i.e. the collection would have more than the maximum number of items)
     */
    CustomCollection.prototype.add = function (item) {
        // If the collection has no maximum number of items, or the number of items in the collection is less than the maxItems ('not full'),
        if (this.maxItems === null || this.items.length < this.maxItems) {
            // The item is added to the items array.
            this.items.push(item);
            // The method returns true to indicate that the item was added to the collection.
            return true;
            // If the maxItems is not null and the number of items in the collection is greater than or equal to the maxItems, the item cannot be added to the collection.
        }
        else {
            // An error is thrown to indicate that the item could not be added to the collection due to the cardinality constraint.
            throw new Error("Adding this item would violate the cardinality constraint: Collection cannot have more than ".concat(this.maxItems, " items."));
        }
    };
    /**
     * Remove an item from the collection.
     *
     * @param item The item to remove
     * @returns true if the item was removed; false otherwise
     * @throws An error if the cardinality constraint is violated (i.e. the collection would have less than the minimum number of items)
     */
    CustomCollection.prototype.remove = function (item) {
        // Search for the item in the items array.
        var index = this.items.indexOf(item);
        // If the index is not -1, the item was found in the collection.
        if (index !== -1) {
            // The item is removed from this collection's items array.
            this.items.splice(index, 1);
            // If the number of items in the collection is less than the minItems, the item cannot be removed from the collection.
            if (this.items.length < this.minItems) {
                // An error is thrown to indicate that the item could not be removed from the collection, due to the cardinality constraint.
                throw new Error("Removing this item would violate the cardinality constraint: Collection cannot have less than ".concat(this.minItems, " items."));
                // If the number of items in the collection is greater than or equal to the minItems, the item can be removed from the collection.
            }
            else {
                // The method returns true to indicate that the item was removed from the collection.
                return true;
            }
            // If the index is -1, the item was not even found in the collection.
        }
        else {
            // An error is thrown to indicate that the item could not be removed from the collection.
            throw new Error("The item you are trying to remove does not exist in the collection, so it cannot be removed.");
        }
    };
    // This method returns the items in the collection.
    CustomCollection.prototype.getItems = function () {
        return this.items;
    };
    return CustomCollection;
}());
var Library = /** @class */ (function () {
    function Library(name) {
        this.name = name;
        this._books = new CustomCollection(1, null);
        this._members = new CustomCollection(1, null);
    }
    Library.prototype.addBook = function (book) {
        return this._books.add(book);
    };
    Library.prototype.removeBook = function (book) {
        return this._books.remove(book);
    };
    Library.prototype.getBooks = function () {
        return this._books.getItems();
    };
    Library.prototype.addMember = function (member) {
        return this._members.add(member);
    };
    Library.prototype.removeMember = function (member) {
        return this._members.remove(member);
    };
    Library.prototype.getMembers = function () {
        return this._members.getItems();
    };
    return Library;
}());
exports.Library = Library;
var Book = /** @class */ (function () {
    function Book(title, author, isbn, borrowedBy) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.borrowedBy = borrowedBy || null;
    }
    return Book;
}());
exports.Book = Book;
var Member = /** @class */ (function () {
    function Member(name, membershipID) {
        this.name = name;
        this.membershipID = membershipID;
        this._borrowedBooks = new CustomCollection(0, 2);
    }
    Member.prototype.borrowBook = function (book) {
        if (book.borrowedBy === null) {
            book.borrowedBy = this;
            return this._borrowedBooks.add(book);
        }
        else {
            throw new Error("This book is already borrowed by another member.");
        }
    };
    Member.prototype.returnBook = function (book) {
        if (book.borrowedBy === this) {
            book.borrowedBy = null;
            return this._borrowedBooks.remove(book);
        }
        else {
            throw new Error("This book is not borrowed by this member.");
        }
    };
    Member.prototype.getBorrowedBooks = function () {
        return this._borrowedBooks.getItems();
    };
    return Member;
}());
exports.Member = Member;
