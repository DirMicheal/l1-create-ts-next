import { DependenciesDef } from './lib-deps';

export type Framework = 'node' | 'react';

const knownFrameworks: Framework[] = ['node', 'react'];

export const defaultFramework: Framework = 'node';

export const choicesFrameworks = (): string[] => knownFrameworks.slice();

export const filterFramework = (fw?: string | null): Framework => {
  if (fw != null && (knownFrameworks as string[]).indexOf(fw) > -1) {
    return fw as Framework;
  }
  return defaultFramework;
};

const FrameworkDependencies: Record<Framework, DependenciesDef | undefined> = {
  node : undefined,
  react: {
    dependencies   : {
      'react'    : '^18.0.0',
      'react-dom': '^18.0.0',
    },
    devDependencies: {
      '@types/react'        : '^18.0.0',
      '@types/react-dom'    : '^18.0.0',
      'vite'                : '^5.0.0',
      '@vitejs/plugin-react': '^4.2.0',
    },
  },
};

export const generateFrameworkDependencies = (fw: Framework): DependenciesDef | undefined => {
  return FrameworkDependencies[fw];
};
