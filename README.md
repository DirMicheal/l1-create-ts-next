# create-ts-next

[![version](https://img.shields.io/npm/v/create-ts-next?style=for-the-badge)](https://www.npmjs.com/package/create-ts-next) [![dt](https://img.shields.io/npm/dt/create-ts-next?style=for-the-badge)](https://www.npmjs.com/package/create-ts-next)

## 基本介绍

这是一个 node.js 的项目创建脚手架，用于创建次世代的 TypeScript 项目模板。

本项目主要针对 node.js 的后端项目环境或独立库开发，不针对前端创建项目，因为 vite webpack 已经有很多比较好的脚手架了）。

该项目将自动创建基础的 TypeScript 项目环境，并可通过参数增加部分相关库：

1. typescript
    - `typescript@^4.6.2`
    - `@types/node@^16` 该项目只保持对 node.js LTS 版本对齐，不考虑兼容更早的 node.js 版本。
2. eslint，可通过命令行参数 `--eslint|-e false` 控制，默认开启。推荐阅读：[https://typescript-eslint.io/](https://typescript-eslint.io/)
    - `eslint@^8`
    - `@typescript-eslint/parser@^5`
    - `@typescript-eslint/eslint-plugin@^5`
3. [ts-node](https://typestrong.org/ts-node/docs/) ，可通过命令行参数 `--lib ts-node` 添加。
    - `ts-node@^10.4.0`
4. [swc](https://swc.rs/) ，可通过命令行参数 `--lib swc` 添加。
    - `chokidar^@3.5.3` ，要以 watch 模式执行 swc 编译，需要增加这个库
    - `@swc/cli@^0.1.55`
    - `@swc/core@^1.2.151`
    - `regenerator-runtime@^0.13.9`
5. mocha ，可通过命令行参数 `--lib mocha` 添加，默认整合 mocha 和 chai。
    - `mocha@^9.2.1`
    - `@types/mocha@^9.1.1`
    - `chai@^4.3.6`
    - `@types/chai@^4.3.0`
6. jest ，可通过命令行参数 `--lib jest` 添加，基于 [ts-jest](https://kulshekhar.github.io/ts-jest/) 整合，原生兼容 TypeScript。
    - `jest@^29.0.0`
    - `@types/jest@^29.0.0`
    - `ts-jest@^29.0.0`

现阶段 `ts-node` x `swc` ，构成了完美的 TypeScript 的本地开发环境，而且开发时完全可以用 `ts-node` x `swc` 直接解释执行，而无需编译。

当通过参数添加了相关库以后，除了在创建项目时自动创建 `package.json` 文件，相关的 `tsconfig.json` `.swcrc` `.mocharc.json` `jest.config.js` `.gitignore` `.eslintrc.js`
也会根据参数自动添加。

## 命令行使用

```shell
npx create-ts-next <name>

# 使用帮助和查看版本号
npx create-ts-next --help
npx create-ts-next --version

# 更新新版本
# 如果之前通过 npx 指令使用过
npx create-ts-next@latest --help

# typescript, eslint, ts-node, swc 
npx create-ts-next <name> -l all -p pnpm -i
# typescript, ts-node, swc, mocha
npx create-ts-next <name> --eslint false -l all -M
```

### --module|-m

指定 module 模式，默认 `commonjs` 。

### --target|-t

TS 编译目标，默认 `ES2019` [nodejs@16.0.0](https://node.green/#ES2019)

### --eslint|-E

是否开启 eslint ，默认**开启**。

如果开启，则自动添加相关依赖库，并在新建项目中添加基础 `.eslintrc.js` 文件。

### --lib|-l

附加库，可选值 `ts-node|swc|mocha|jest|prettier|all` ，可多项。

如果添加相关库，则会在新建的项目中添加相关的文件：

- **ts-node** - 无文件创建，`tsconfig.json` 文件，会增加 `"ts-node": {}` 字段。
- **swc** - 添加 `.swcrc` 文件。
    - 如果同时包含 `ts-node` 则在 `tsconfig.json` 文件，增加 `"ts-node": { "swc": true }` 字段。
- **mocha** - 添加 `.mocharc.json` 文件
- **jest** - 添加 `jest.config.js` 文件（基于 ts-jest，兼容 TypeScript），并在 `package.json` 的 `scripts` 中添加 `test`（`jest`）。可直接通过 `npm test` 运行测试。
- **prettier** - 添加 `.prettierrc` 文件

### --mock|-M

启用 mock 模式，该模式不会检查是否存在重名目录，也不会创建任何目录和文件，只是模拟正常执行的流程。

### --import-helpers|-H

是否开启 [引用 helpers 模式](https://www.typescriptlang.org/tsconfig#importHelpers) ，默认开启。

- 当开启了 `--import-helpers` ，将自动添加 `tslib`
- 如果同时添加 `swc` ，也会添加 `@swc/helper`

### --package-manager|-p

默认为 `npm`，可选 `npm` `yarn` `pnpm`，选择本地 node 包管理器。

### --install|-i

默认为 `true`

是否自动安装依赖包，根据指定的 `--package-manager|-p` 安装项目依赖。

## API 说明

`create-ts-next`
亦可作为一个编程库而被使用，如：[create-webpack-next](https://gitee.com/janpoem/create-webpack-next/blob/master/src/WebpackNextProjectCreator.ts)

### ProjectCreator

ProjectCreator 提供了创建 node.js 模板项目的抽象类。

1. 继承类应该声明泛型 `Options` 和 `State`，`class YourCreator extends ProjectCreator<YourOptions, YourState>`
    - `Options` 为藉由外部环境（如
      CLI）传入的配置选项，要求限定继承自 [ProjectCreatorBasicOptions](https://gitee.com/janpoem/create-ts-next/blob/master/src/ProjectCreator.ts#L7)
    - `State` 藉由配置选项，生成的运行时状态，如果无，可指定一个任意的结构。
2. 继承类应该实现抽象方法 `getStructure(): ProjectStructure` 和 `startUp(): Promise<this>`
    - `getStructure(): ProjectStructure` 获取需要创建的项目的目录结构
    - `startUp(): Promise<this>` 启动执行创建项目
3. 重载 `getTemplatePath(relative: string): string` 方法，根据相对路径返回对应的模板所在路径。
    - 因为不同的 package ，实际存放 template 的位置有所不同，所以每个 Creator 都应重载此方法。
    - `relative` 为相对于项目根目录的相对路径，如：
        - 项目根目录为 `/my-app`，处理创建文件 `/my-app/src/index.ts` ，则此时的 `relative` 为 `src/index.ts`
4. 项目创建实际执行流程：
    1. **[可选]** `await this.detectPackageCmd();` 检查本地可使用的 package manager 指令，如果你需要 install 的话
    2. **[必要]** `this.create(this.getStructure());` 传入创建项目的结构，并创建项目
    3. **[可选]** `await installDeps(this.projectRoot, this.packageCmd);` 安装依赖，如果你需要 install 的话

> installDeps 同样由 create-ts-next 提供，`import { installDeps } from 'create-ts-next'`

#### ProjectCreatorBasicOptions

用于描述创建项目的基本配置选项。

```ts
interface ProjectCreatorBasicOptions {
  // 创建的项目名称
  name: string,
  // 是否要 install
  install: boolean,
  // 指定的包管理器
  packageManager: 'npm' | 'yarn' | 'pnpm',
  // 是否启用调试
  debug?: boolean,
  // 是否启用模拟模式
  mock?: boolean,
}
```

#### ProjectStructure

用于描述项目的目录结构，可以将一个 ProjectStructure 数据实体，理解为对应的一个目录或文件的描述，其结构声明如下：

```ts
type ProjectStructure = {
  // 文件或目录名称
  name: string,
  // 是一个文件还是目录，undeinfed 时默认为 file
  type?: 'dir' | 'file',
  // 仅对 type = file 有效，文件的数据内容文本格式
  data?: string,
  // 忽略 ejs 模板处理
  // ignoreTpl = true 时，仍旧会尝试去加载模板内容，但不会进行 ejs 模板处理
  ignoreTpl?: boolean,
  // 目录下的内容，仅对 type = dir 有效
  children?: (ProjectStructure | undefined)[]
}
```

### 其他辅助工具

#### DependenciesDef

描述了一个库所依赖的包及其版本号。其结构声明如下：

```ts
type DependenciesItem = Record<string, string>

export type DependenciesDef = {
  dependencies?: DependenciesItem,
  devDependencies?: DependenciesItem,
}

// 举个🌰：声明 TypeScript 所依赖的包
const TypeScriptDeps: DependenciesDef = {
  dependencies   : {
    'tslib': '^2.3.1'
  },
  devDependencies: {
    '@types/node': '^16',
    'typescript' : '^4.6.2',
  }
}
```

这里库是一个抽象名词，比如我们需要在项目中添加 TypeScript ：

1. 那么我们往往不仅仅是需要 `typescript` 这个依赖包，
2. 同时还需要 `@types/node` 这个辅助库，以及 `tslib` 这个运行时依赖包。
3. 其次根据不同的项目环境，比如 webpack ，我们在描述 TypeScript 的时候，可能还会附加上 `ts-loader` / `babel-loader` / `swc-loader` 等等，基于此，可能还有更多的依赖包，诸如 `@babel/preset-env` / `@babel/preset-typescript` 等等。



#### dependenciesMerge

合并两个依赖声明，仅对 `dependencies` 和 `devDependencies` 字段进行合并。

`dependenciesMerge(deps1: DependenciesDef = {}, deps2: DependenciesDef = {}): DependenciesDef | undefined`

#### installDeps

根据 package.json 安装依赖包。

`installDeps(dir: string, cmd: PackageCmd): Promise<void>`

- `dir`: 执行安装的目录，最好为绝对路径。
- `cmd`: 执行的包管理器命令。

根据执行指令的返回代码（child process exit code）来判定执行状态。

- 0 为正常完成
- 非0 表示执行指令返回任何异常

#### TypeScript 相关

[ts-vars.ts](https://gitee.com/janpoem/create-ts-next/blob/master/src/utils/ts-vars.ts) 提供 TypeScript Module 和 Target
的枚举与 alias，如果有需要，请按需引用。

#### 更好的使用 nodemon with ts-node

`package.json` 添加 script

```json
{
   "scripts": {
      "dev:nodemon": "nodemon"
   }
}
```

项目根目录添加 `nodemon.json`

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node ./src/index.ts"
}
```

## 更新日志

### 1.0.12

- 增加 `jest` 测试框架支持，可通过 `--lib jest` 添加（`jest@^29` / `@types/jest@^29` / `ts-jest@^29`）。
    - 新建项目会生成兼容 TypeScript 的 `jest.config.js`（基于 ts-jest preset），并在 `package.json` 添加 `test` 脚本，可直接 `npm test`。
    - 当同时添加 `mocha` 和 `jest`（如 `-l all`），`test` 脚本以 `jest` 为准。

### 1.0.9

- 更新开发所需库版本 `ejs^3`, `mocha^10`
- 更新依赖库版本，`typescript^5`, 及其他

### 1.0.8 

- 增加 `prettier`
- 更新依赖库版本
- 转用 gitee workflow

### 1.0.7

- 更新依赖库版本
- 使用 `nodemon` 替换 `chokidar` 库

### 1.0.6

- 增加 `ProjectCreator.generateFileContent` 方法，使继承类可使用自定义的模板处理器。

### 1.0.5

- 增加 `ProjectCreator.getTemplatePath` 方法

### 1.0.4

- 增加参数 `--package-manager|-p` 选择本地 node 包管理器，默认为 `npm`；
- 调整匹配本地包管理器状态，从过去检查 3 个，改为只检查用户指定的包管理器；
- 调整目录结构，`src/index.ts` （对应 `dist/index.js`）导出全部代码，增加 `src/cli.ts` 作为脚本启动环境（便于可复用代码）；
- 分离 `ProjectCreator` 和 `TsNextProjectCreator`。

### 1.0.3

- 增加参数 `--install|-i` 控制创建项目后，是否自动安装依赖包；
- 修正生成的 package.json 的项目名称，只使用创建项目的目录名（不包含父路径）；
- 添加项目的可执行 `scripts` ，增加 `dev:start` `build` `lint`（如果包含 eslint） `test` （如果包含 mocha）。
