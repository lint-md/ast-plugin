import { toPath } from './helper';
import { getGlobalConfig } from './global';
import * as Unist from 'unist';
import { Plugin } from './Plugin';

export class Ast {
  node: Unist.Node;
  parent: Ast;
  text: string;
  skipped: boolean;

  constructor(node: Unist.Node, parent?: Ast, text?: string) {
    this.node = node;
    this.parent = parent;
    // 文本、代码
    this.text = text;

    this.skipped = false;
  }

  get(path: string | any[]) {
    const arr = toPath(path);
    return arr.reduce((value, key) => {
      if (value === undefined) return undefined;

      const node = value.node[key];

      return node === undefined ? undefined : new Ast(node, value, this.text);
    }, this);
  }

  // 处理 plugin
  visit(plugins: Plugin[]) {
    const { typeKey, childrenKey } = getGlobalConfig();
    const node = this.node;

    plugins.forEach(plugin => {
      // visitor 函数返回的 object
      const visitor = plugin.visitor();

      const keys = Object.keys(visitor);

      keys.forEach(key => {
        const v = visitor[key];

        // 匹配的时候才处理
        if (node[typeKey] === key) v(this);
      });
    });
  }

  process(plugins: Plugin[]) {
    const { typeKey, childrenKey } = getGlobalConfig();

    const children = this.node[childrenKey];

    // 处理当前
    this.visit(plugins);

    // 处理子元素
    if (Array.isArray(children) && !this.skipped) {
      children.forEach(child => new Ast(child, this, this.text).process(plugins));
    }
  }

  traverse(plugins: Plugin[]) {
    // 前置处理
    plugins.forEach(plugin => plugin.pre());

    // 遍历
    this.process(plugins);

    // 后置处理
    plugins.forEach(plugin => plugin.post());

    return this;
  }

  skip() {
    this.skipped = true;
  }

  /**
   * 获得当前 ast 的文本内容片段
   *
   * @returns {string}
   */
  segment() {
    const lines = this.text.split('\n');

    const { start, end } = this.node.position;

    const r: string[] = [];
    for (let i = start.line; i <= end.line; i++) {
      let line = lines[i - 1];

      if (i === end.line) {
        line = line.substring(0, end.column - 1);
      }

      if (i === start.line) {
        line = line.substring(start.column - 1);
      }

      r.push(line);
    }

    return r.join('\n');
  }
}
