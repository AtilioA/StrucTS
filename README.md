# StrucTS: A Domain-Specific Language for Structural Modeling

**StrucTS** is a *domain-specific language* (DSL) built using Langium for defining **structural models**, to be transpiled into **TypeScript**.

It is designed to simplify the process of creating structural models and generate TypeScript code that reflects these models. With StrucTS, you can define classes, properties, methods, and other constructs in a concise and expressive syntax, and generate TypeScript code that's idiomatic and maintainable.

## Features

- [x] Concise and expressive syntax for defining classes and their properties
- [x] Abstracts common structural modeling concepts (e.g. associations, compositions)
- [x] Support for property cardinalities
- [x] Built-in validation checks for semantic constraints such as unique class names, unique property names, valid cardinalities, etc.
- [ ] Customizable code generation using the Factory pattern
  - [x] Front-end (parsing)
  - [ ] Back-end (code generation)
- [ ] Generates TypeScript code
  - [ ] Idiomatic?

## Getting Started

### Prerequisites

To use StrucTS, you'll need the following tools installed on your system:

    [npm](https://www.npmjs.com/get-npm) (bundled with Node.js)
    Visual Studio Code

### Installation

To use StrucTS, first clone this repository to your local machine:

```bash
git clone https://github.com/AtilioA/StrucTS
cd StrucTS
```

### TODO

Next, install the required dependencies:

```bash
npm install
```

### Usage

To use StrucTS, create a .sts file with your desired class and property definitions. The file should follow the StrucTS syntax. For example, we could create a `library.sts` file:

```ts
class Library {
    attribute name: string;
    composed_of books: Book[1..*];
    composed_of members: Member[1..*];
}

class Book {
    attribute title: string;
    attribute author: string;
    attribute isbn: string;
}

class Member {
    attribute firstName: string;
    attribute lastName: string;
}
```

### TODO

After defining your model in a `.sts` file, you can run the validation process to check for any semantic constraints violations:

...

Run the following command to generate TypeScript code from your StrucTS model:

```bash
npm run generate
```

The generated TypeScript code will be placed in the `generated/` directory and can be used on its own.

## Acknowledgments

    [Langium](https://github.com/langium/langium): for providing the tools to build and parse the StrucTS grammar, and for providing the framework for code generation.
    [TypeScript](https://github.com/microsoft/TypeScript): for serving as the target system for code generation.
    ...

## License

StrucTS is licensed under the Unlicense. See [LICENSE](LICENSE) for more information.
