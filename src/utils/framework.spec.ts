import { expect } from 'chai';
import { filterFramework, generateFrameworkDependencies } from './framework';

describe('framework', function () {
  it('filterFramework', () => {
    expect(filterFramework('react')).to.be.eql('react');
    expect(filterFramework('node')).to.be.eql('node');
    expect(filterFramework(undefined)).to.be.eql('node');
    expect(filterFramework('bogus')).to.be.eql('node');
  });

  it('generateFrameworkDependencies react', () => {
    const deps = generateFrameworkDependencies('react');
    expect(deps).to.not.be.eql(undefined);
    expect(deps?.dependencies).to.have.property('react');
    expect(deps?.dependencies).to.have.property('react-dom');
    expect(deps?.devDependencies).to.have.property('@types/react');
    expect(deps?.devDependencies).to.have.property('@types/react-dom');
    expect(deps?.devDependencies).to.have.property('vite');
    expect(deps?.devDependencies).to.have.property('@vitejs/plugin-react');
  });

  it('generateFrameworkDependencies node', () => {
    expect(generateFrameworkDependencies('node')).to.be.eql(undefined);
  });
});
