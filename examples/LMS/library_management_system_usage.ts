import { Library, Book, Member } from "./library_management_system";

const library = new Library("My Local Library");

const books = [
  new Book("To Kill a Mockingbird", "Harper Lee", "9780060935467"),
  new Book("Pride and Prejudice", "Jane Austen", "9780141040349"),
  new Book("The Catcher in the Rye", "J.D. Salinger", "9780316769488"),
  new Book("1984", "George Orwell", "9780451524935"),
  new Book("Infinite Jest", "David Foster Wallace", "9780274994748"),
  new Book("Thinking, Fast and Slow", "Daniel Kahneman", "9780374533557"),
];

const members = [
  new Member("Alice", "M001"),
  new Member("Bob", "M002"),
  new Member("Charlie", "M003"),
];

books.forEach(book => library.addBook(book));
members.forEach(member => library.addMember(member));

const bookCount = books.length;
const memberCount = members.length;

for (let i = 0; i < 12; i++) {
  const bookIndex = Math.floor(Math.random() * bookCount);
  const memberIndex = Math.floor(Math.random() * memberCount);

  const book = books[bookIndex];
  const member = members[memberIndex];

  const operation = Math.random() < 0.5 ? "borrow" : "return";

  try {
    if (operation === "borrow") {
      console.log(`${member.name} is borrowing ${book.title}.`);
      member.borrowBook(book);
    } else {
      console.log(`${member.name} is returning ${book.title}.`);
      member.returnBook(book);
    }
  } catch (error) {
    console.error(`An error occurred when trying to ${operation} Book "${book.title}" borrowed by Member "${member.name}": "${error}"\n`);
  }
}
