import { terminal } from 'terminal-kit';
import {
  ProjectCreator,
  ProjectCreatorBasicOptions,
  ProjectCreatorBasicState,
  ProjectStructure,
} from './ProjectCreator';
import {
  DependenciesKey, generateMochaRC,
  generatePackageInfo, generateSWCRC,
  generateTSConfig,
  installDeps,
  TypeScriptModule,
  TypeScriptTarget,
} from './utils';

export interface CreateTsNextProjectOptions extends ProjectCreatorBasicOptions {
  target: TypeScriptTarget,
  module: TypeScriptModule,
  importHelpers: boolean,
  libs: DependenciesKey[],
}

export interface CreateTsNextProjectState extends ProjectCreatorBasicState {
  mocha: boolean,
  tsnode: boolean,
  swc: boolean,
  eslint: boolean,
  prettier: boolean,
}

const json = (data: Record<string, unknown>): string => JSON.stringify(data, null, 2);

export class TsNextProjectCreator extends ProjectCreator<CreateTsNextProjectOptions, CreateTsNextProjectState> {

  constructor(opts: CreateTsNextProjectOptions) {
    super(opts, {
      mocha   : opts.libs.indexOf('mocha') > -1,
      tsnode  : opts.libs.indexOf('ts-node') > -1,
      swc     : opts.libs.indexOf('swc') > -1,
      eslint  : opts.libs.indexOf('eslint') > -1,
      prettier: opts.libs.indexOf('prettier') > -1,
    });
  }

  async startUp(): Promise<this> {
    await this.detectPackageCmd();
    const { name, target, module, importHelpers, libs } = this.options;
    terminal(`Create project `).cyan(name);
    terminal(', module: ').green(module);
    terminal(', target: ').green(target);
    if (importHelpers) {
      terminal(', import-helpers: ').green(importHelpers + '');
    }
    process.stdout.write('\n');

    terminal('With libs: \n');
    libs.forEach((lib) => {
      terminal(' - ').cyan(lib);
      process.stdout.write('\n');
    });

    if (this.packageCmd != null) {
      terminal('Packages manager used: ').cyan(this.packageCmd);
      process.stdout.write('\n');
    }

    process.stdout.write('\n');
    this.create(this.getStructure());
    process.stdout.write('\n');

    terminal('Project ').cyan(name);
    terminal(' created. ');

    let installed = false;

    if (this.packageCmd != null) {
      terminal('Install dependencies by ').cyan(this.packageCmd);
      terminal('... \n');
      try {
        await installDeps(this.projectRoot, this.packageCmd);
        installed = true;
      } catch (e) {
        //
      }
    }

    process.stdout.write('\n');
    terminal('You can try the follow commands:\n');
    terminal.blue(`cd ${name}`);
    process.stdout.write('\n');

    if (this.packageCmd == null || !installed) {
      terminal.blue(`npm install`);
      terminal.gray(` or `);
      terminal.blue(`yarn install`);
      terminal.gray(` or `);
      terminal.blue(`pnpm install`);
      process.stdout.write('\n');
    }

    terminal.blue(`ts-node src/index.ts`);
    process.stdout.write('\n');
    process.stdout.write('\n');

    terminal('Have fun!\n');
    return this;
  }

  getStructure(): ProjectStructure {
    return {
      name    : '',
      type    : 'dir',
      children: [
        {
          name    : 'src',
          type    : 'dir',
          children: [
            { name: 'index.ts' },
          ],
        },
        { name: '.gitignore' },
        { name: 'package.json', data: json(generatePackageInfo(this.options, this.state)) },
        { name: 'tsconfig.json', data: json(generateTSConfig(this.options, this.state)) },
        this.state.eslint ? { name: '.eslintrc.js' } : undefined,
        this.state.prettier ? { name: '.prettierrc' } : undefined,
        this.state.swc ? { name: '.swcrc', data: json(generateSWCRC(this.options)) } : undefined,
        this.state.mocha ? { name: '.mocharc.json', data: json(generateMochaRC()) } : undefined,
      ],
    };
  }
}
