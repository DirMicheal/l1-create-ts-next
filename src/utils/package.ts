import { platform } from 'os';
import { exec, spawn, ExecException } from 'child_process';

type DetectResult = {
  status: boolean,
  err?: ExecException | null,
  stdout?: string,
  stderr?: string
}

const detectCommand = (command: string): Promise<DetectResult> => {
  return new Promise<DetectResult>((resolve) => {
    exec(command, (err, stdout, stderr) => {
      resolve({ status: !err && !stderr && !!stdout, err, stderr, stdout });
    });
  });
};

export type PackageCmd = 'npm' | 'yarn' | 'pnpm';

const knownPackageManagers: PackageCmd[] = ['yarn', 'npm', 'pnpm'];

export const filterPackageManager = (pm?: string): PackageCmd => {
  if (pm != null && (knownPackageManagers as string[]).indexOf(pm) > -1) {
    return pm as PackageCmd;
  }
  return knownPackageManagers[0];
};

export const choicesPackageManages = () => knownPackageManagers.slice();

export const convertPackageManagerCommand = (cmd: PackageCmd): string => `${cmd}${platform() === 'win32' ? '.cmd' : ''}`;

export const detectCmd = (cmd: PackageCmd): Promise<DetectResult> => {
  return new Promise<DetectResult>((resolve) => {
    detectCommand(`${convertPackageManagerCommand(cmd)} -v`).then(resolve);
  });
};

export const selectCmd = async (pm: PackageCmd): Promise<PackageCmd | undefined> => {
  const cli = await detectCmd(pm);
  if (cli.status) {
    return pm;
  }
  return undefined;
};

export const installDeps = (dir: string, cmd: PackageCmd): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    process.chdir(dir);
    const _cmd = `${cmd}${platform() === 'win32' ? '.cmd' : ''}`;
    const ps = spawn(_cmd, ['install'], { stdio: 'inherit', cwd: dir });
    ps.on('close', (code) => {
      if (code !== 0) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

