import { expect } from 'chai';
import { DEFAULT_GIT_COMMIT_MESSAGE, Git } from './git';

describe('git', function () {
  it('detect', async () => {
    const ok = await Git.detect();
    expect(ok).to.be.eql(true);
  });

  it('default commit message', () => {
    expect(DEFAULT_GIT_COMMIT_MESSAGE).to.be.eql('feat: initial commit');
  });
});
