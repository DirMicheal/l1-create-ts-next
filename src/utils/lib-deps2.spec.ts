import { expect } from 'chai';
import { generateDependencies } from './lib-deps';

describe('generateDependencies', function () {
  it('typescript + ts-node', () => {
    const deps = generateDependencies({ libs: ['typescript', 'ts-node'], importHelpers: false });
    expect(deps).to.have.property('devDependencies');
    expect(deps).to.have.nested.property('devDependencies.typescript');
    expect(deps).to.have.nested.property('devDependencies.@types/node');
    expect(deps).to.have.nested.property('devDependencies.ts-node');
  });

  it('typescript + ts-node / helpers', () => {
    const deps = generateDependencies({ libs: ['typescript', 'ts-node'], importHelpers: true });
    expect(deps).to.have.property('devDependencies');
    expect(deps).to.have.nested.property('devDependencies.typescript');
    expect(deps).to.have.nested.property('devDependencies.@types/node');
    expect(deps).to.have.nested.property('devDependencies.ts-node');
    expect(deps).to.have.property('dependencies');
    expect(deps).to.have.nested.property('dependencies.tslib');
  });

  it('typescript + eslint + swc + ts-node', () => {
    const deps = generateDependencies({ libs: ['typescript', 'eslint', 'swc', 'ts-node'], importHelpers: true });

    // ts
    expect(deps).to.have.nested.property('devDependencies.typescript');
    expect(deps).to.have.nested.property('devDependencies.@types/node');

    // swc
    // expect(deps).to.have.nested.property('devDependencies.chokidar');
    expect(deps).to.have.nested.property('devDependencies.@swc/cli');
    expect(deps).to.have.nested.property('devDependencies.@swc/core');
    expect(deps).to.have.nested.property('devDependencies.regenerator-runtime');

    // eslint
    expect(deps).to.have.nested.property('devDependencies.eslint');
    expect(deps).to.have.nested.property('devDependencies.@typescript-eslint/eslint-plugin');
    expect(deps).to.have.nested.property('devDependencies.@typescript-eslint/parser');

    // ts-node
    expect(deps).to.have.nested.property('devDependencies.ts-node');

    // ts
    expect(deps).to.have.nested.property('dependencies.tslib');

    // swc
    expect(deps).to.have.nested.property('dependencies.@swc/helpers');
  });
});
