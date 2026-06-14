import { join, basename, isAbsolute } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { terminal } from 'terminal-kit';
import { DependenciesDef, generateFileByTemplate } from './utils';
import { PackageCmd, selectCmd } from './utils';

export interface ProjectCreatorBasicOptions {
  name: string,
  install: boolean,
  packageManager: PackageCmd,
  debug?: boolean,
  mock?: boolean,
}

export type ProjectStructure = {
  name: string,
  type?: 'dir' | 'file',
  data?: string | null,
  ignoreTpl?: boolean,
  children?: (ProjectStructure | undefined)[]
}

export interface ProjectCreatorBasicState {
  [key: string]: unknown;
}


export type PathContext = {
  dir: string,
  path: string,
}

export abstract class ProjectCreator<Options extends ProjectCreatorBasicOptions, State extends ProjectCreatorBasicState> {

  deps: DependenciesDef | undefined;

  basePath: string;

  packageCmd?: PackageCmd;

  onConstructor?(): void;

  constructor(public readonly options: Options, public readonly state: State) {
    this.basePath = process.cwd();
    Object.freeze(this.options);
    Object.freeze(this.state);
    typeof this.onConstructor === 'function' && this.onConstructor();
  }

  async detectPackageCmd(): Promise<this> {
    if (!this.options.mock && this.options.install) {
      this.packageCmd = await selectCmd(this.options.packageManager);
    }
    return this;
  }

  abstract startUp(): Promise<this>;

  abstract getStructure(): ProjectStructure;

  get projectRoot(): string {
    return isAbsolute(this.options.name) ? this.options.name : join(this.basePath, this.options.name);
  }

  create(item: ProjectStructure, ctx?: PathContext): this {
    ctx = ctx || { dir: '', path: this.projectRoot };
    if (item.type === 'dir') {
      this.createDir(item, ctx);
    } else {
      this.createFile(item, ctx);
    }
    return this;
  }

  createDir({ type, name, children }: ProjectStructure, { dir, path }: PathContext): this {
    if (type !== 'dir') return this;
    const relative = dir ? join(dir, name) : name;
    const fullPath = join(path, relative);
    if (!this.options.mock) {
      if (existsSync(fullPath)) {
        throw new Error(`directory ${basename(fullPath)} is exists`);
      }
    }
    !this.options.mock && mkdirSync(fullPath, { recursive: true });
    terminal('create dir: ').green(name || this.options.name);
    process.stdout.write('\n');
    if (Array.isArray(children) && children.length > 0) {
      children.forEach((item) => {
        if (item != null) {
          this.create(item, { dir: relative, path });
        }
      });
    }
    return this;
  }

  createFile(item: ProjectStructure, { dir, path }: PathContext): this {
    const { type = 'file', name, data } = item;
    if (type !== 'file') return this;
    const relative = dir ? join(dir, name) : name;
    if (!this.options.mock) {
      writeFileSync(join(path, relative), typeof data === 'string' ? data : this.generateFileContent(item, relative));
    }
    terminal('write file: ').yellow(relative);
    process.stdout.write('\n');
    return this;
  }

  generateFileContent(item: ProjectStructure, relative: string): string {
    return generateFileByTemplate(
      item,
      this.getTemplatePath(relative),
      this.options
    );
  }

  getTemplatePath(relative: string): string {
    return join(__dirname, `../template/${relative}.ejs`);
  }
}
