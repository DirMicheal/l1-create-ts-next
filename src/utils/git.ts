import { exec } from 'child_process';

const run = (command: string, cwd: string): Promise<{ stdout: string, stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

export const isGitInstalled = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    exec('git --version', (err) => {
      resolve(!err);
    });
  });
};

export const gitInit = async (cwd: string, branchName?: string): Promise<void> => {
  const args = branchName ? `init -b ${branchName}` : 'init';
  await run(`git ${args}`, cwd);
};

export const gitAddAll = async (cwd: string): Promise<void> => {
  await run('git add .', cwd);
};

export const gitCommit = async (cwd: string, message: string): Promise<void> => {
  await run(`git commit -m "${message}"`, cwd);
};

export const gitInitialCommit = async (cwd: string, message = 'feat: initial commit'): Promise<void> => {
  await gitAddAll(cwd);
  await gitCommit(cwd, message);
};
