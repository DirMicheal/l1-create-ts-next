export enum TypeScriptModule {
  commonjs = 'CommonJS',
  amd = 'AMD',
  system = 'System',
  umd = 'UMD',
  es6 = 'ES6',
  es2015 = 'ES2015',
  es2020 = 'ES2020',
  esnext = 'ESNext',
  none = 'None',
  es2022 = 'es2022',
  node12 = 'node12',
  nodenext = 'nodenext'
}

export enum TypeScriptTarget {
  es3 = 'ES3',
  es5 = 'ES5',
  es6 = 'ES6',
  es2015 = 'ES2015',
  es2016 = 'ES2016',
  es2017 = 'ES2017',
  es2018 = 'ES2018',
  es2019 = 'ES2019',
  es2020 = 'ES2020',
  es2021 = 'ES2021',
  esnext = 'ESNext'
}

export const TypeScriptTargetShortcuts = {
  '3'   : TypeScriptTarget.es3,
  '5'   : TypeScriptTarget.es5,
  '6'   : TypeScriptTarget.es6,
  '2015': TypeScriptTarget.es2015,
  '2016': TypeScriptTarget.es2016,
  '2017': TypeScriptTarget.es2017,
  '2018': TypeScriptTarget.es2018,
  '2019': TypeScriptTarget.es2019,
  '2020': TypeScriptTarget.es2020,
  '2021': TypeScriptTarget.es2021,
  'next': TypeScriptTarget.esnext,
} as const;

type TypeScriptTargetShortcutsType = typeof TypeScriptTargetShortcuts;

export const defaultTypeScriptTarget = 'es2019';
export const defaultTypeScriptModule = 'commonjs';

export const defaultTypeScriptTargetValue = TypeScriptTarget[defaultTypeScriptTarget];
export const defaultTypeScriptModuleValue = TypeScriptModule[defaultTypeScriptModule];

export const choicesTypeScriptModules = (): string[] => Object.keys(TypeScriptModule);
export const choicesTypeScriptTargets = (): string[] => Object.keys(TypeScriptTarget).concat(Object.keys(
  TypeScriptTargetShortcuts));

const inTypeScriptTargetEnum = (target: string): target is keyof typeof TypeScriptTarget => target in TypeScriptTarget;
const inTypeScriptTargetShortcuts = (target: string): target is keyof TypeScriptTargetShortcutsType => target in TypeScriptTargetShortcuts;

export const filterTypeScriptTarget = (target?: string | null | number): TypeScriptTarget => {
  if (target != null) {
    target = (target + '').toLowerCase();
    if (inTypeScriptTargetEnum(target)) {
      return TypeScriptTarget[target];
    } else if (inTypeScriptTargetShortcuts(target)) {
      return TypeScriptTargetShortcuts[target];
    }
  }
  return defaultTypeScriptTargetValue;
};

const inTypeScriptModuleEnum = (target: string): target is keyof typeof TypeScriptModule => target in TypeScriptModule;

export const filterTypeScriptModule = (module?: string | null): TypeScriptModule => {
  if (module != null) {
    if (inTypeScriptModuleEnum(module)) {
      return TypeScriptModule[module];
    }
  }
  return defaultTypeScriptModuleValue;
};

type SWCModuleType = 'commonjs' | 'es6' | 'amd' | 'umd';

export const filterSWCModule = (module: TypeScriptModule): SWCModuleType => {
  switch (module) {
    case TypeScriptModule.commonjs :
      return 'commonjs';
    case TypeScriptModule.amd :
      return 'amd';
    case TypeScriptModule.umd :
      return 'commonjs';
  }

  return 'es6';
};

// "es3" | "es5" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022"

export const filterSWCTarget = (target: TypeScriptTarget): string => {
  if (target === TypeScriptTarget.esnext) {
    return 'es2022';
  }
  return target.toLowerCase();
};
