// The LMS code below uses the CustomCollection export class to enforce cardinality constraints for the Library, Book, and Member export classes. Each Library has a collection of Book and Member instances, while each Member has a collection of borrowed Book instances.
// The generic type (T) will be used to specify the type of item that can be added to the collection. Must not be exported.
class CustomCollection<T> {
	// The items in the collection are stored in an array.
	private readonly items: T[];

	// The constructor takes the minimum number of items and the maximum number of items as parameters.
	// The maxItems parameter is optional and can be null, meaning that there is no maximum number of items.
	constructor(private readonly minItems: number, private readonly maxItems: number | null) {
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
	add(item: T): boolean {
		// If the collection has no maximum number of items, or the number of items in the collection is less than the maxItems ('not full'),
		if (this.maxItems === null || this.items.length < this.maxItems) {
			// The item is added to the items array.
			this.items.push(item);
			// The method returns true to indicate that the item was added to the collection.
			return true;
			// If the maxItems is not null and the number of items in the collection is greater than or equal to the maxItems, the item cannot be added to the collection.
		} else {
			// An error is thrown to indicate that the item could not be added to the collection due to the cardinality constraint.
			throw new Error(
				`Adding this item would violate the cardinality constraint: Collection cannot have more than ${this.maxItems} items.`,
			);
		}
	}

	/**
   * Remove an item from the collection.
   *
   * @param item The item to remove
   * @returns true if the item was removed; false otherwise
   * @throws An error if the cardinality constraint is violated (i.e. the collection would have less than the minimum number of items)
   */
	remove(item: T): boolean {
		// Search for the item in the items array.
		const index = this.items.indexOf(item);
		// If the index is not -1, the item was found in the collection.
		if (index === -1) {
			// An error is thrown to indicate that the item could not be removed from the collection.
			throw new Error(
				'The item you are trying to remove does not exist in the collection, so it cannot be removed.',
			);
		} else {
			// The item is removed from this collection's items array.
			this.items.splice(index, 1);
			// If the number of items in the collection is less than the minItems, the item cannot be removed from the collection.
			if (this.items.length < this.minItems) {
				// An error is thrown to indicate that the item could not be removed from the collection, due to the cardinality constraint.
				throw new Error(
					`Removing this item would violate the cardinality constraint: Collection cannot have less than ${this.minItems} items.`,
				);
				// If the number of items in the collection is greater than or equal to the minItems, the item can be removed from the collection.
			} else {
				// The method returns true to indicate that the item was removed from the collection.
				return true;
			}
			// If the index is -1, the item was not even found in the collection.
		}
	}

	// This method returns the items in the collection.
	getItems(): T[] {
		return this.items;
	}
}

export class Library {
	public name: string;
	private readonly _books: CustomCollection<Book>;
	private readonly _members: CustomCollection<Member>;

	constructor(parameterName: string) {
		this.name = parameterName;
		this._books = new CustomCollection<Book>(1, null);
		this._members = new CustomCollection<Member>(1, null);
	}

	// The destroy method handles the destruction of objects that compose it, i.e. Book and Member instances
	destroy(): void {
		for (const book of this._books.getItems()) {
			book.destroy();
		}

		for (const member of this._members.getItems()) {
			member.destroy();
		}
	}

	addBook(book: Book): boolean {
		return this._books.add(book);
	}

	removeBook(book: Book): boolean {
		return this._books.remove(book);
	}

	getBooks(): Book[] {
		return this._books.getItems();
	}

	addMember(member: Member): boolean {
		return this._members.add(member);
	}

	removeMember(member: Member): boolean {
		return this._members.remove(member);
	}

	getMembers(): Member[] {
		return this._members.getItems();
	}
}

export class Book {
	title: string;
	author: string;
	isbn: string;
	borrowedBy: Member | null;

	constructor(parameterTitle: string, parameterAuthor: string, parameterIsbn: string, borrowedBy?: Member) {
		this.title = parameterTitle;
		this.author = parameterAuthor;
		this.isbn = parameterIsbn;
		this.borrowedBy = borrowedBy ?? null;
	}

	destroy(): void {
		// Add any cleanup logic specific to the Book class here
		console.log(`Book instance '${this.title}' (${this.isbn}) is being destroyed.`);
	}
}

export class Member {
	name: string;
	isActive: boolean;
	membershipId: string;
	private readonly _borrowedBooks: CustomCollection<Book>;

	constructor(parameterName: string, parameterMembershipID: string) {
		this.name = parameterName;
		this.isActive = true;
		this.membershipId = parameterMembershipID;
		this._borrowedBooks = new CustomCollection<Book>(0, 2);
	}

	destroy(): void {
		// Add any cleanup logic specific to the Member class here
		console.log(`Member instance '${this.name}' (${this.membershipId}) is being destroyed.`);
	}

	borrowBook(book: Book): boolean {
		if (book.borrowedBy === null) {
			book.borrowedBy = this;
			return this._borrowedBooks.add(book);
		}

		throw new Error('This book is already borrowed by another member.');
	}

	returnBook(book: Book): boolean {
		if (book.borrowedBy === this) {
			book.borrowedBy = null;
			return this._borrowedBooks.remove(book);
		}

		throw new Error('This book is not borrowed by this member.');
	}

	getBorrowedBooks(): Book[] {
		return this._borrowedBooks.getItems();
	}
}
