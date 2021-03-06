# @lint-md/ast-plugin

> The simplest abstract syntax tree walker.

[![Build Status](https://github.com/lint-md/ast-plugin/actions/workflows/build.yml/badge.svg)](https://github.com/lint-md/ast-plugin/actions/workflows/build.yml)

## Install

> npm i --save ast-plugin

## Usage

- Traverse Ast plugins

```js
import { Ast, Plugin } from 'ast-plugin';

new Ast(ast).traverse([
  new TestPlugin(cfg),
  // ...
]);
```

- Write an ast plugin

```js
import { Ast, Plugin } from 'ast-plugin';

class TestPlugin extends Plugin {

  pre = () => {
  };

  visitor = () => {
    return {
      // process node with type = 'text'
      text: ast => {
        console.log(ast.node);
        ast.segment();
      },
    };
  };

  post = () => {
  };
}
```

## Used by

- [lint-md](https://github.com/lint-md/lint-md) Cli tool to lint your markdown file for Chinese.

## License

MIT@[hustcc](https://github.com/hustcc).
