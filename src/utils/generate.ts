import { existsSync, readFileSync } from 'fs';
import { basename } from 'path';
import * as ejs from 'ejs';
import { ProjectCreatorBasicOptions, ProjectStructure } from '../ProjectCreator';
import { CreateTsNextProjectOptions, CreateTsNextProjectState } from '../TsNextProjectCreator';
import { dependenciesMerge, generateDependencies } from './lib-deps';
import { generateFrameworkDependencies } from './framework';
import { filterSWCModule, filterSWCTarget } from './ts-vars';

export const convertPackageName = (name: string): string => {
  return basename(name);
  // return name.replace(/^[\w]+:[\\\/]+/, '').replace(/[\\\/]+/gm, '-');
};

export const generatePackageInfo = (
  opts: CreateTsNextProjectOptions,
  { eslint, mocha, react }: CreateTsNextProjectState
): Record<string, unknown> => {
  const scripts: Record<string, string> = {};

  if (react) {
    scripts['dev'] = 'vite';
    scripts['build'] = 'tsc && vite build';
    scripts['preview'] = 'vite preview';
    if (eslint) {
      scripts['lint'] = 'eslint src --ext .ts,.tsx,.js,.jsx';
    }
  } else {
    scripts['dev:start'] = 'ts-node src/index.ts';
    if (mocha) {
      scripts['test'] = 'mocha';
    }
    if (eslint) {
      scripts['lint'] = 'eslint src --ext .ts,.tsx,.js,.jsx';
    }
    scripts['build'] = [
      eslint ? 'npm run lint' : null,
      eslint ? 'npm run test' : null,
      'tsc'
    ].filter(Boolean).join(' && ');
  }

  const deps = react
    ? dependenciesMerge(generateDependencies(opts), generateFrameworkDependencies(opts.framework))
    : generateDependencies(opts);

  return {
    'name'       : convertPackageName(opts.name),
    'version'    : '1.0.0',
    'description': '',
    'scripts'    : scripts,
    'engines'    : {
      'node': react ? '>= 18.0.0' : '>= 16.0.0'
    },
    'author'     : '',
    'license'    : 'UNLICENSED',
    ...deps,
  };
};

export const generateTSConfig = ({
  module,
  target,
  importHelpers,
}: CreateTsNextProjectOptions, { mocha, tsnode, swc, react }: CreateTsNextProjectState): Record<string, unknown> => {
  const types: string[] = [];
  if (!react) {
    types.push('node');
  }
  if (mocha) {
    types.push('mocha', 'chai');
  }

  const compilerOptions: Record<string, unknown> = {
    'target'                : react ? 'ES2020' : target,
    'module'                : react ? 'ESNext' : module,
    'strict'                : true,
    'esModuleInterop'       : true,
    'experimentalDecorators': true,
    'emitDecoratorMetadata' : true,
    'importHelpers'         : importHelpers,
    'pretty'                : true,
    'baseUrl'               : './',
    'types'                 : types,
  };

  if (react) {
    compilerOptions['jsx'] = 'react-jsx';
    compilerOptions['lib'] = ['DOM', 'DOM.Iterable', 'ESNext'];
    compilerOptions['moduleResolution'] = 'Bundler';
    compilerOptions['noEmit'] = true;
    compilerOptions['useDefineForClassFields'] = true;
    compilerOptions['skipLibCheck'] = true;
  } else {
    compilerOptions['declaration'] = true;
    compilerOptions['rootDir'] = 'src';
    compilerOptions['outDir'] = 'dist';
  }

  const config: Record<string, unknown> = {
    'compilerOptions': compilerOptions,
    'include'        : ['src/**/*'],
    'exclude'        : ['node_modules', 'src/**/*.spec.ts'],
  };
  if (tsnode) {
    if (swc) {
      config['ts-node'] = { swc: true };
    } else {
      // placeholder
      config['ts-node'] = {};
    }
  }
  return config;
};

export const generateSWCRC = ({ target, module, importHelpers }: CreateTsNextProjectOptions) => {
  return {
    'jsc'   : {
      'parser'         : {
        'syntax'       : 'typescript',
        'decorators'   : true,
        'dynamicImport': false
      },
      'baseUrl'        : './',
      'target'         : filterSWCTarget(target),
      'transform'      : null,
      'loose'          : true,
      'externalHelpers': importHelpers,
      'keepClassNames' : true
    },
    'module': {
      'type'      : filterSWCModule(module),
      'strict'    : false,
      'strictMode': true,
      'lazy'      : false,
      'noInterop' : false
    }
  };
};

export const generateMochaRC = (): Record<string, unknown> => {
  return {
    'require'   : 'ts-node/register',
    'extensions': [
      'ts'
    ],
    'spec'      : [
      'src/**/*.spec.ts'
    ]
  };
};

export const generateFileByTemplate = <Options extends ProjectCreatorBasicOptions>(
  item: ProjectStructure,
  tplPath: string,
  opts: Options
): string => {
  try {
    if (existsSync(tplPath)) {
      const tpl = readFileSync(tplPath);
      if (item.ignoreTpl) {
        return tpl.toString('utf8');
      }
      return ejs.render(tpl.toString('utf8'), opts);
    }
  } catch (err) {
    console.log(`generateFileByTemplate ${item.name} error: `, err);
  }
  return '';
};
