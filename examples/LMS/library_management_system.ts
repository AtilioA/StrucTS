// The LMS code below uses the CustomCollection export class to enforce cardinality constraints for the Library, Book, and Member export classes. Each Library has a collection of Book and Member instances, while each Member has a collection of borrowed Book instances.

import { CustomCollection } from '../../generated/strucTS_core/custom_collection';

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
