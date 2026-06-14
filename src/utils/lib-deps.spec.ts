import { expect } from 'chai';
import { dependenciesMerge, filterCliLibs, getDependencies } from './lib-deps';

describe('dependencies', function () {

  describe('filterCliLibs', function () {
    it('contain eslint', () => {
      const libs = filterCliLibs(true);
      expect(libs).to.contain('typescript');
      expect(libs).to.contain('eslint');
    });

    it('not contain eslint', () => {
      const libs = filterCliLibs(false);
      expect(libs).to.contain('typescript');
      expect(libs).to.not.contain('eslint');
    });

    it('contain swc', () => {
      const libs = filterCliLibs(false, ['swc']);
      expect(libs).to.contain('swc');
      expect(libs).to.not.contain('eslint');
    });

    it('contain ts-node', () => {
      const libs = filterCliLibs(true, ['ts-node']);
      expect(libs).to.contain('ts-node');
    });

    it('all', () => {
      const libs = filterCliLibs(true, ['ts-node', 'swc']);
      expect(libs).to.contain('typescript');
      expect(libs).to.contain('eslint');
      expect(libs).to.contain('ts-node');
      expect(libs).to.contain('swc');
    });

    it('add undefined lib', () => {
      const libs = filterCliLibs(true, ['test']);
      expect(libs).to.contain('typescript');
      expect(libs).to.not.contain('test');
    });
  });

  describe('getDependencies', function () {
    it('typescript', () => {
      const deps = getDependencies('typescript', false);
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.typescript');
      expect(deps).to.have.nested.property('devDependencies.@types/node');
    });

    it('typescript with helpers', () => {
      const deps = getDependencies('typescript', true);
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.typescript');
      expect(deps).to.have.nested.property('devDependencies.@types/node');
      expect(deps).to.have.property('dependencies');
      expect(deps).to.have.nested.property('dependencies.tslib');
    });

    it('eslint', () => {
      const deps = getDependencies('eslint', false);
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.eslint');
      expect(deps).to.have.nested.property('devDependencies.@typescript-eslint/eslint-plugin');
      expect(deps).to.have.nested.property('devDependencies.@typescript-eslint/parser');
    });

    it('swc', () => {
      const deps = getDependencies('swc', false);
      expect(deps).to.have.property('devDependencies');
      // expect(deps).to.have.nested.property('devDependencies.chokidar');
      expect(deps).to.have.nested.property('devDependencies.@swc/cli');
      expect(deps).to.have.nested.property('devDependencies.@swc/core');
      expect(deps).to.have.nested.property('devDependencies.regenerator-runtime');
    });

    it('swc with helpers', () => {
      const deps = getDependencies('swc', true);
      expect(deps).to.have.property('devDependencies');
      // expect(deps).to.have.nested.property('devDependencies.chokidar');
      expect(deps).to.have.nested.property('devDependencies.@swc/cli');
      expect(deps).to.have.nested.property('devDependencies.@swc/core');
      expect(deps).to.have.nested.property('devDependencies.regenerator-runtime');
      expect(deps).to.have.property('dependencies');
      expect(deps).to.have.nested.property('dependencies.@swc/helpers');
    });

    it('ts-node', () => {
      const deps = getDependencies('ts-node', true);
      expect(deps).to.have.property('devDependencies');
      expect(deps).to.have.nested.property('devDependencies.ts-node');
    });

    it('undefined', () => {
      const deps = getDependencies('abc', true);
      expect(deps).to.eql(undefined);
    });
  });

  describe('dependenciesMerge', () => {
    it('test 1', () => {
      const deps = dependenciesMerge(
        {
          dependencies: {
            a: 'a1',
            b: 'b1',
          }
        },
        {
          dependencies: {
            a: 'a2',
            // no b
            c: 'c2'
          }
        }
      );
      expect(deps).to.have.nested.property('dependencies.a', 'a2');
      expect(deps).to.have.nested.property('dependencies.b', 'b1');
      expect(deps).to.have.nested.property('dependencies.c', 'c2');
    });

    it('test 2', () => {
      const deps = dependenciesMerge(
        {
          dependencies: {
            a: 'a1',
            b: 'b1',
          }
        },
        {
          dependencies   : {
            c: 'c2'
          },
          devDependencies: {
            x: 'x2',
            // no b
            y: 'y2'
          }
        }
      );
      expect(deps).to.have.nested.property('dependencies.a', 'a1');
      expect(deps).to.have.nested.property('dependencies.b', 'b1');
      expect(deps).to.have.nested.property('dependencies.c', 'c2');
      expect(deps).to.have.nested.property('devDependencies.x', 'x2');
      expect(deps).to.have.nested.property('devDependencies.y', 'y2');
    });
  });
});
