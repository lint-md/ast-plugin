import * as unified from 'unified';
import * as markdown from 'remark-parse';
import { Ast, Plugin } from '../src/';
import { setGlobalConfig, getGlobalConfig } from '../src/global';
import { TestPlugin } from './TestPlugin';

describe('index', () => {

  test('exports', () => {
    expect(Ast).not.toBe(undefined);
    expect(Plugin).not.toBe(undefined);
  });

  test('Ast', () => {
    let throwErrFn = jest.fn();
    const plugin1 = new TestPlugin({
      throwError: throwErrFn,
      config: {
        name: 'p1'
      }
    });

    const plugin2 = new TestPlugin({
      throwError: throwErrFn,
      config: {
        name: 'p2'
      }
    });
    expect(plugin1.cfg).toStrictEqual({
      'config': {
        'name': 'p1'
      },
      'throwError': throwErrFn
    });
    expect(plugin2.cfg).toStrictEqual({
      'config': {
        'name': 'p2'
      },
      'throwError': throwErrFn
    });

    const ast = unified()
      .use(markdown)
      .parse('> Hello **world**!\n\n# ~~hustcc~~');

    const plugins = [
      plugin1,
      plugin2
    ];

    new Ast(ast).traverse(plugins);

    expect(plugin1.pre).toHaveBeenCalledTimes(1);
    expect(plugin1.do).toHaveBeenCalledTimes(3);
    expect(plugin1.post).toHaveBeenCalledTimes(1);

    expect(plugin1.doHeading).toHaveBeenCalledTimes(1);
    expect(plugin1.doDelete).toHaveBeenCalledTimes(0);

    expect(plugin2.pre).toHaveBeenCalledTimes(1);
    expect(plugin2.do).toHaveBeenCalledTimes(3);
    expect(plugin2.post).toHaveBeenCalledTimes(1);

    expect(plugin2.doHeading).toHaveBeenCalledTimes(1);
    expect(plugin2.doDelete).toHaveBeenCalledTimes(0);
  });

  test('get', () => {
    const ast = unified()
      .use(markdown)
      .parse('> Hello **world**!');

    expect(new Ast(ast).node.type).toBe('root');
    expect(new Ast(ast).get(['children', 0]).node.type).toBe('blockquote');
    expect(new Ast(ast).get('children[0].children[0]').node.type).toBe('paragraph');
    expect(new Ast(ast).get('children[0].children[0].children[0]').node.type).toBe('text');
    expect(new Ast(ast).get('aaa.bbb')).toBe(undefined);
  });

  test('segment', () => {
    let md = `\`\`\`js
cont a = 1;
const b = 2;
\`\`\``;

    let mdAst = unified()
      .use(markdown)
      .parse(md);

    let ast = new Ast(mdAst, undefined, md);

    const code = ast.get('children.0');

    expect(code.segment()).toBe(md);

    md = '> Hello **world**!';
    mdAst = unified()
      .use(markdown)
      .parse(md);

    ast = new Ast(mdAst, undefined, md);

    expect(ast.get('children.0.children.0').segment()).toBe('Hello **world**!');
  });

  test('throwError call', () => {
    const throwErrFn = jest.fn();
    const testErrorPlugin = new TestPlugin({
      throwError: throwErrFn
    });
    const md = 'bad content that break some rules...';
    let mdAst = unified()
      .use(markdown)
      .parse(md);

    const ast = new Ast(mdAst, undefined, md);
    ast.traverse([testErrorPlugin, testErrorPlugin]);
    expect(throwErrFn).toBeCalledTimes(2);
    expect(throwErrFn).toBeCalledWith({
      'name': 'Hello, I threw an exception!'
    });
  });

  test('global configure', () => {
    expect(getGlobalConfig()).toEqual({ typeKey: 'type', childrenKey: 'children' });

    setGlobalConfig({ typeKey: 'type' });

    expect(getGlobalConfig()).toEqual({ typeKey: 'type' });
  });
});
