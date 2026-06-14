import { exec, spawn } from 'child_process';

export const DEFAULT_GIT_COMMIT_MESSAGE = 'feat: initial commit';

export type GitInitOptions = {
  branch?: string,
  commit?: boolean,
  message?: string,
};

/**
 * Thin wrapper around the `git` CLI used to bootstrap a freshly scaffolded
 * project. Commands run through `spawn` without a shell, so arguments such as
 * the commit message are passed verbatim and never require escaping. Whether a
 * command succeeded is decided solely by its exit code, mirroring `installDeps`.
 */
export class Git {

  constructor(public readonly cwd: string) {}

  /**
   * Resolve whether the `git` executable is available on the current PATH.
   */
  static detect(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      exec('git --version', (err, stdout) => resolve(!err && !!stdout));
    });
  }

  run(args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const ps = spawn('git', args, { stdio: 'inherit', cwd: this.cwd });
      ps.on('error', reject);
      ps.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`git ${args.join(' ')} exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Initialize a repository, optionally naming the initial branch (`git init`
   * or `git init -b <branch>`).
   */
  async init(branch?: string): Promise<this> {
    await this.run(branch ? ['init', '-b', branch] : ['init']);
    return this;
  }

  async add(pathspec = '.'): Promise<this> {
    await this.run(['add', pathspec]);
    return this;
  }

  async commit(message = DEFAULT_GIT_COMMIT_MESSAGE): Promise<this> {
    await this.run(['commit', '-m', message]);
    return this;
  }

  /**
   * Stage every file and create a commit — i.e. `git add . && git commit -m ...`.
   */
  async commitAll(message = DEFAULT_GIT_COMMIT_MESSAGE): Promise<this> {
    await this.add('.');
    await this.commit(message);
    return this;
  }

  /**
   * Initialize a repository and, unless disabled, create the initial commit so
   * that the new project's history is immediately visible through `git log`.
   */
  async setup({ branch, commit = true, message }: GitInitOptions = {}): Promise<this> {
    await this.init(branch);
    if (commit) {
      await this.commitAll(message);
    }
    return this;
  }
}
