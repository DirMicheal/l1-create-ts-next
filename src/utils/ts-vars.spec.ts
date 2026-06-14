import { expect } from 'chai';
import {
  defaultTypeScriptModuleValue,
  defaultTypeScriptTargetValue,
  filterTypeScriptModule,
  filterTypeScriptTarget,
  TypeScriptModule,
  TypeScriptTarget
} from './ts-vars';

describe('ts-vars', function () {
  it('filterTypeScriptTarget', () => {
    const values = [
      { value: '3', actual: TypeScriptTarget.es3 },
      { value: 'next', actual: TypeScriptTarget.esnext },
      { value: '2018', actual: TypeScriptTarget.es2018 },
      { value: 'not exists', actual: defaultTypeScriptTargetValue },
      { value: undefined, actual: defaultTypeScriptTargetValue },
      { value: null, actual: defaultTypeScriptTargetValue },
      { value: 'es2015', actual: TypeScriptTarget.es2015 },
      { value: 6, actual: TypeScriptTarget.es6 },
      { value: 2020, actual: TypeScriptTarget.es2020 },
    ];
    values.forEach(({ value, actual }) => {
      expect(filterTypeScriptTarget(value)).to.eql(actual);
    });
  });

  it('filterTypeScriptModule', () => {
    const values = [
      { value: 'commonjs', actual: TypeScriptModule.commonjs },
      { value: 'umd', actual: TypeScriptModule.umd },
      { value: 'not exists', actual: defaultTypeScriptModuleValue },
      { value: undefined, actual: defaultTypeScriptModuleValue },
      { value: null, actual: defaultTypeScriptModuleValue },
    ];
    values.forEach(({ value, actual }) => {
      expect(filterTypeScriptModule(value)).to.eql(actual);
    });
  });
});