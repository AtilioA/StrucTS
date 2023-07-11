# StrucTS: A Domain-Specific Language for Structural Modeling

**StrucTS** is a **domain-specific language** (DSL) built using Langium to define **structural models** in a concise syntax that can be transpiled into **TypeScript**.

It is designed to simplify the process of creating structural models and to generate TypeScript and Graphviz code that reflects these models.
With StrucTS, you can define classes, properties, methods, and other constructs in a concise and expressive syntax, and generate TypeScript code that is expressive and idiomatic.

## Features

- [x] Concise and expressive syntax for defining classes and their properties;
- [x] Implements common structural modeling concepts/abstractions (e.g. associations, compositions, cardinalities);
- [x] Support for imposing cardinality constraints on class attributes;
- [x] Built-in validation checks for semantic constraints such as unique class names, unique property names, valid cardinalities, TypeScript reserved names, etc;
- [x] Automatic design pattern generation (Factory, Builder);
- [x] Code generation for TypeScript;
- [x] Code generation for Graphviz.

## Getting Started

### Prerequisites

To use StrucTS, you'll need the following tools installed on your system:

#### As CLI tool

- [`npm`](https://www.npmjs.com/get-npm) (bundled with Node.js);
- [`langium`](https://langium.org/getting_started/installation/).

#### As extension

- [Visual Studio Code](https://code.visualstudio.com/download);
- StrucTS's extension, available on the [release page](https://github.com/AtilioA/StrucTS/releases).

### Installation (CLI tool)

To use StrucTS, first clone this repository to your local machine and navigate to the project directory:

```bash
git clone https://github.com/AtilioA/StrucTS
cd StrucTS
```

Next, install the required dependencies:

```bash
npm install
```

### Installation (VS Code extension)

Download the latest version from the [release page](https://github.com/AtilioA/StrucTS/releases) and install it in VS Code:

  1. Open VS Code;
  2. Go to the Extensions tab;
  3. Click on the *"..."* button;
  4. Click on *"Install from VSIX..."*;
  5. Select the downloaded file.
  6. Reload VS Code.

### Building the CLI and code related to the language

First, generate code for the grammar (AST, etc) with Langium and then build the validators and generators:

```bash
langium generate
npm run build
```

#### Using the CLI tool

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
```

##### Transpiling to TypeScript

After defining your model in a `.sts` file, you can use the CLI to generate TypeScript code from your StrucTS model:

```bash
bin/cli generate <file>
```

The CLI will inform you of any syntatic or semantic errors in your model.

If there are none, the generated TypeScript code will be placed in the `generated/` directory by default, and can already be used on its own.

The output is linted using ESLint and `xo`, and you can run `npm run lint` to check for any linting errors. However, note that ignored directories (such as `generated/`) cannot linted.

##### Transpiling to DOT (GraphViz visualization)

To visualize the model with GraphViz (.dot/.gv), execute the following command:

```bash
bin/cli generate-graphviz <file>
```

Again, the CLI will inform you of any errors in your model and the generated GraphViz code will be placed in the `generated/` directory by default.

### Usage as VS Code extension

To use it as a VS Code extension, either download the latest version from the [release page](https://github.com/AtilioA/StrucTS/releases) and [install it in VS Code](#installation-vs-code-extension), or follow the instructions under '[Using the CLI tool](#building-the-cli-and-code-related-to-the-language)', open the project in VS Code and press F5 to run the extension in debug mode.

Then, open a `.sts` file. You should have features such as syntax highlighting and error validation for your StrucTS files.

Instructions for building the extension itself are available in the [Langium documentation](https://langium.org/tutorials/building_an_extension/).

## Acknowledgments

- [Langium](https://github.com/langium/langium): for providing the tools to build and parse the StrucTS grammar, and for providing the framework for code validation and generation.
- [TypeScript](https://github.com/microsoft/TypeScript): for serving as the target system for code generation.
- [Visual Studio Code](https://github.com/microsoft/vscode): for providing support for the extension.

## License

StrucTS is licensed under the Unlicense. See [LICENSE](LICENSE) for more information.
