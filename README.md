# StrucTS: A Domain-Specific Language for Structural Modeling

**StrucTS** is a **domain-specific language** (DSL) built using Langium to define **structural models** in a concise syntax that can be transpiled into **TypeScript**.

It is designed to simplify the process of creating structural models and to generate TypeScript and Graphviz code that reflects these models.
With StrucTS, you can define classes, properties, methods, and other constructs in a concise and expressive syntax, and generate TypeScript code that is expressive and idiomatic.

## Features

- [x] Concise and expressive syntax for defining classes and their properties;
- [x] Common structural modeling concepts handling/abstraction (e.g. associations, compositions);
- [x] Support for imposing cardinality constraints on class attributes;
- [x] Built-in validation checks for semantic constraints such as unique class names, unique property names, valid cardinalities, etc;
- [x] Code generation for TypeScript;
- [x] Code generation for Graphviz.

## Getting Started

### Prerequisites

To use StrucTS, you'll need the following tools installed on your system:

- [`npm`](https://www.npmjs.com/get-npm) (bundled with Node.js)
- Visual Studio Code (to use it as an extension; not required to use it as a CLI tool)

### Installation

To use StrucTS, first clone this repository to your local machine and navigate to the project directory:

```bash
git clone https://github.com/AtilioA/StrucTS
cd StrucTS
```

Next, install the required dependencies:

```bash
npm install
```

### Usage

First, generate code for the grammar (AST, etc) with Langium and then build the validators and generators:

```bash
langium generate
npm run build
```

#### Usage as CLI tool

Then, to use StrucTS, create a .sts file with your desired class and property definitions. The file should follow the StrucTS syntax, available on `src/language-server/struc-ts.langium`.

For example, we could create a `hello_world.sts` file:

```ts
// This class abstracts the concept of a song, which has a title, a duration, and a reference to the artist who composed it.
class Song {
  attribute title: string;
  attribute duration: number;
}

// This class abstracts the concept of a playlist, which has a name, and a list of songs. A Playlist can have many songs.
class Playlist {
  attribute name: string;
  references songs: Song[*];
}

class

```

After defining your model in a `.sts` file, you can use the extension to check for any semantic constraints violations. Either get the extension from the VS Code Marketplace (`...`) or press F5 to run the extension in debug mode, then open the `.sts`.

Run the following command to generate TypeScript code from your StrucTS model:

```bash
bin/cli generate <file>
```

The CLI will inform you of any errors in your model.
<br/>
If there are none, the generated TypeScript code will be placed in the `generated/` directory by default, and can already be used on its own.
<br/>The output is linted using ESLint and `xo`, and you can run `npm run lint` to check for any linting errors. However, note that ignored directories (such as `generated/`) cannot linted.

To visualizate the model with GraphViz (.dot/.gv), execute the following command:

```bash
bin/cli generate-graphviz <file>
```

Again, the CLI will inform you of any errors in your model and the generated GraphViz code will be placed in the `generated/` directory by default.

#### Usage as VS Code extension

## Acknowledgments

- [Langium](https://github.com/langium/langium): for providing the tools to build and parse the StrucTS grammar, and for providing the framework for code generation.
- [TypeScript](https://github.com/microsoft/TypeScript): for serving as the target system for code generation.
- ...

## License

StrucTS is licensed under the Unlicense. See [LICENSE](LICENSE) for more information.
