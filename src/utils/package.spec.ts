import { expect } from 'chai';
import { detectCmd, selectCmd } from './package';

describe('package', function () {
  it('detectCmd', async () => {
    const { status } = await detectCmd('npm');
    expect(status).to.be.eql(true);
  });

  it('selectCmd', async () => {
    const cmd = await selectCmd('npm');
    expect(cmd).to.be.eql('npm');
  });
});
