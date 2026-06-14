import { existsSync, readFileSync } from 'fs';
import { basename } from 'path';
import * as ejs from 'ejs';
import { ProjectCreatorBasicOptions, ProjectStructure } from '../ProjectCreator';
import { CreateTsNextProjectOptions, CreateTsNextProjectState } from '../TsNextProjectCreator';
import { generateDependencies } from './lib-deps';
import { filterSWCModule, filterSWCTarget } from './ts-vars';

export const convertPackageName = (name: string): string => {
  return basename(name);
  // return name.replace(/^[\w]+:[\\\/]+/, '').replace(/[\\\/]+/gm, '-');
};

export const generatePackageInfo = (
  opts: CreateTsNextProjectOptions,
  { eslint, mocha }: CreateTsNextProjectState
): Record<string, unknown> => {
  const scripts: Record<string, string> = {
    'dev:start': 'ts-node src/index.ts'
  };
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

  return {
    'name'       : convertPackageName(opts.name),
    'version'    : '1.0.0',
    'description': '',
    'scripts'    : scripts,
    'engines'    : {
      'node': '>= 16.0.0'
    },
    'author'     : '',
    'license'    : 'UNLICENSED',
    ...generateDependencies(opts),
  };
};

export const generateTSConfig = ({
  module,
  target,
  importHelpers,
}: CreateTsNextProjectOptions, { mocha, tsnode, swc }: CreateTsNextProjectState): Record<string, unknown> => {
  const types = ['node'];
  if (mocha) {
    types.push('mocha', 'chai');
  }
  const config: Record<string, unknown> = {
    'compilerOptions': {
      'target'                : target,
      'module'                : module,
      'strict'                : true,
      'declaration'           : true,
      'esModuleInterop'       : true,
      'experimentalDecorators': true,
      'emitDecoratorMetadata' : true,
      'importHelpers'         : importHelpers,
      'pretty'                : true,
      'rootDir'               : 'src',
      'outDir'                : 'dist',
      'baseUrl'               : './',
      'types'                 : types
    },
    'include'        : ['src/**/*'],
    'exclude'        : ['node_modules', 'src/**/*.spec.ts']
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
