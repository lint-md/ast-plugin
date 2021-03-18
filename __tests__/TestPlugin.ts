import { Plugin } from '../src';

export class TestPlugin extends Plugin {

  do = jest.fn();

  doHeading = jest.fn();
  doDelete = jest.fn();

  pre = jest.fn();

  visitor = () => {
    return {
      text: ast => {
        this.do(ast);
        this.cfg.throwError({
          name: 'Hello, I threw an exception!'
        });
      },
      heading: ast => {
        this.doHeading(ast);
        // skip
        ast.skip();
      },
      delete: ast => {
        this.doDelete(ast);
      }
    };
  };

  post = jest.fn();
}
