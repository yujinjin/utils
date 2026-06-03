# utils

前端常用工具包，提供对象复制、日期格式化、数据生成、URL 处理、数据验证等常用方法。

## 项目架构

```
utils/
├── src/                        # 源代码目录
│   ├── extend.ts               # 对象深复制/浅复制
│   ├── format.ts               # 日期、数值、字符串格式化
│   ├── generate.ts             # 随机数据生成
│   ├── url.ts                  # URL 参数操作与解析
│   ├── validation.ts           # 常用数据验证
│   ├── others.ts               # 其他工具方法（节流、防抖、中文金额等）
│   ├── index.ts                # 统一导出入口
│   └── __tests__/              # 测试用例目录
│       ├── extend.test.ts
│       ├── format.test.ts
│       ├── generate.test.ts
│       ├── url.test.ts
│       ├── validation.test.ts
│       └── others.test.ts
├── scripts/                    # 构建与发布脚本
│   ├── build.ts                # 打包脚本（基于 gulp + rollup）
│   ├── publish.ts              # 发布脚本
│   └── utils/                  # 脚本工具函数
├── tsconfig.json               # TypeScript 编译配置
├── vitest.config.ts            # 测试框架配置
├── .eslintrc.js                # 代码检查规则
└── package.json                # 项目配置
```

**模块划分原则**：按功能职责分组，每个文件对应一类功能，高内聚低耦合。所有公开方法通过 `src/index.ts` 统一导出。

## 安装依赖

**环境要求**：Node.js >= 16

```bash
# 安装项目依赖
npm install
```

## 使用方式

### 作为依赖安装

```bash
npm install --save @yujinjin/utils
```

### 导入使用

```js
import { guid, randomId, stringFormat, dateFormat, ... } from "@yujinjin/utils";
```

## 项目脚本

| 命令 | 说明 |
|------|------|
| `npm run build --vt=版本号` | 打包构建。`vt` 为版本号，默认 `patch`，可选 `major`、`minor`、`patch` 或具体版本号 |
| `npm run publish --vt=版本号` | 发布到 npm。`vt` 含义同上 |
| `npm run test` | 运行单元测试（可视化界面） |
| `npm run test:coverage` | 运行单元测试并生成覆盖率报告 |
| `npm run lint` | 代码检查，不允许任何警告 |
| `npm run lint:fix` | 代码检查并自动修复 |

### 打包示例

```bash
# 使用 patch 版本（1.0.0 → 1.0.1）
npm run build

# 指定具体版本号
npm run build --vt=2.0.0
```

## 代码规范

### TypeScript 规范

- **严格模式**：开启了 `strict` 模式，包含 `noImplicitAny`、`strictNullChecks` 等所有严格检查
- **类型注解**：所有函数参数和返回值必须有明确的类型注解
- **禁止 var**：只允许使用 `const` 和 `let`
- **模块系统**：使用 ESNext 模块格式

### ESLint 规则

- 使用双引号，语句末尾必须有分号
- 变量和函数使用驼峰命名（camelCase）
- 必须使用 `===` 和 `!==` 进行比较
- 禁止使用 `eval`、`alert`、`debugger`
- 最大嵌套深度 4 层
- 使用 `@typescript-eslint/consistent-type-imports` 约束类型导入方式

### Prettier 格式化

- 缩进：4 个空格
- 行宽：200 字符
- 尾逗号：无
- 箭头函数参数：省略括号

### 代码提交规范

使用 `commitlint` + `husky` 约束提交信息格式：

```
<类型>: <描述>
```

**允许的提交类型**（必须小写）：

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| ui | 界面相关 |
| fix | 修复问题 |
| docs | 文档变更 |
| style | 代码格式（不影响逻辑） |
| refactor | 重构（不是新功能也不是修复） |
| build | 构建相关 |
| ci | 持续集成相关 |
| perf | 性能优化 |
| chore | 其他杂项 |
| revert | 回退提交 |
| test | 测试相关 |

**其他规则**：
- 提交描述（header）最大长度 100 字符
- 提交描述（subject）不能为空

```bash
# 示例
feat: 增加其他常用工具类方法-number2text
fix: 修复 dateFormat 小写格式解析错误
```

## 方法说明

### extend — 对象复制

对象深复制、浅复制，创建对象和继承。

```js
// 深复制：嵌套对象递归合并
extend(true, { a: { x: 1 } }, { a: { y: 2 } }); // => { a: { x: 1, y: 2 } }

// 浅复制：嵌套对象整体替换
extend({ a: { x: 1 } }, { a: { y: 2 } }); // => { a: { y: 2 } }

// 多个对象合并
extend({}, { a: 1 }, { b: 2 }, { c: 3 }); // => { a: 1, b: 2, c: 3 }
```

### format — 格式化

#### dateFormat(date, format)

日期格式化。`date` 支持 Date 对象、时间戳或日期字符串。

```js
dateFormat(new Date());                                        // => "2023-03-28"（默认格式）
dateFormat(1679986245414, "YYYY-MM-DD HH:mm:ss.SSS");         // => "2023-03-28 14:50:45.414"
dateFormat("2023-01-01", "YYYY年MM月DD日");                    // => "2023年01月01日"
```

支持的格式占位符：`YYYY`(年) `MM`(月) `DD`(日) `HH`(24小时) `hh`(12小时) `mm`(分) `ss`(秒) `SSS`(毫秒) `q+`(季度)

#### timeDifferenceFormat(date, separator)

日期时间段显示格式化。

```js
timeDifferenceFormat(Date.now() - 10 * 1000);           // => "刚刚之前"
timeDifferenceFormat(Date.now() - 5 * 60 * 1000);       // => "5分钟前"
timeDifferenceFormat(Date.now() - 3 * 24 * 3600 * 1000); // => "3天前"
```

#### numberFormat(value, digit)

数值格式化（千分位 + 四舍五入）。

```js
numberFormat(1234567.55);        // => "1,234,568"
numberFormat(200, 2);            // => "200.00"
numberFormat("1,234.56", 2);     // => "1,234.56"
```

#### stringFormat(contents, parameters)

字符串占位符替换。

```js
stringFormat("我是{0}，今年{1}岁了", ["JACK", 12]);         // => "我是JACK，今年12岁了"
stringFormat("我是{name}，今年{age}岁了", { name: "JACK", age: 12 }); // => "我是JACK，今年12岁了"
```

### generate — 数据生成

#### guid()

生成符合 UUID v4 规范的32位随机标识符。

```js
guid(); // => "A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D"
```

#### randomId()

生成基于日期的随机ID（年月日 + 8位随机数）。

```js
randomId(); // => "20230603A1B2C3D4"
```

### url — URL 处理

#### changeUrlParameter(url, name, value, isAdd)

修改 URL 中的查询参数，支持添加、修改、删除操作。

```js
changeUrlParameter("https://example.com", "name", "test");              // => 添加参数
changeUrlParameter("https://example.com?name=1", "name", "test");       // => 修改参数
changeUrlParameter("https://example.com?name=1", "name");               // => 删除参数
changeUrlParameter("https://example.com", "name", "test", false);       // => 不添加（参数不存在时）
```

#### parseUrl(url)

解析 URL 的协议、域名、端口、参数、路径等信息。

```js
parseUrl("https://example.com:9090/test?name=hello");
// => { protocol: "https", host: "example.com", port: "9090", params: { name: "hello" }, ... }
```

### validation — 数据验证

#### chinaPhoneNumberValidate(phoneNumber)

中国手机号码验证（11位，首位为1）。

```js
chinaPhoneNumberValidate("13643564144"); // => true
```

#### emailValidate(email)

邮箱格式验证。

```js
emailValidate("test@126.com"); // => true
```

#### chinaIDCardValidate(IDCard)

中国身份证验证，支持大陆（18位）、香港、澳门、台湾格式。

```js
chinaIDCardValidate("130701199310302288"); // => true（大陆）
chinaIDCardValidate("B165432(8)");         // => true（香港）
```

#### validateBankCard(bankCard)

银行卡号验证（10-30位数字，首位不为0）。

```js
validateBankCard("6222021234567890123"); // => true
```

#### validateName(name)

中国姓名验证，支持全中文、中文含间隔号（·）、全英文。

```js
validateName("张三");          // => true
validateName("艾格里·买买提");  // => true
validateName("jack yu");       // => true
validateName("测 试");         // => false（中文含空格）
```

#### validateChineseCharacter(word)

全汉文验证，支持扩展汉字（如 䳸、鿏）。

```js
validateChineseCharacter("测试");     // => true
validateChineseCharacter("测试䳸鿏"); // => true
```

#### validatePassword(password)

密码格式验证（8-20位，必须同时包含数字、小写字母、大写字母、特殊字符）。

```js
validatePassword("1W2D8^yu123edc"); // => true
validatePassword("0123456789");      // => false（只有数字）
```

#### validateSocialCreditCode(code)

统一社会信用代码验证（严格模式，18位，含校验位计算）。

```js
validateSocialCreditCode("91350100M000100Y43"); // => true
```

#### validateSimpleSocialCreditCode(code)

统一社会信用代码验证（宽松模式，支持15/18/20位）。

```js
validateSimpleSocialCreditCode("91350100M000100"); // => true
```

### others — 其他工具

#### loadScript(url, id)

页面动态加载 JS 文件，超过10秒视为超时。

```js
const success = await loadScript("https://cdn.example.com/lib.js", "lib-script");
```

#### throttle(fn, wait, options)

函数节流，降低高频操作的执行频率。

```js
const cb = throttle(handleScroll, 250);
window.addEventListener("scroll", cb, false);
```

`options`：`{ leading: true, trailing: true }`，`leading` 是否立即执行，`trailing` 是否在冷却后执行。

#### debounce(callback, wait)

函数防抖，在连续触发停止后才执行。

```js
const cb = debounce(searchAPI, 300);
input.addEventListener("input", cb);
```

#### number2text(number, type)

数字转中文金额，`type` 可选 `"upper"`（大写）或 `"lower"`（小写）。

```js
number2text(100000000);           // => "壹亿元整"
number2text("1234234211.12");     // => "壹拾贰亿叁仟肆佰贰拾叁万肆仟贰佰壹拾壹元壹角贰分"
number2text(100000000, "lower");  // => "一亿元整"
```

#### setObjectProperty(object, path, value)

沿属性路径设置值，路径不存在时自动创建中间对象或数组。

```js
const obj = {};
setObjectProperty(obj, "a.b.c", 10);   // obj => { a: { b: { c: 10 } } }
setObjectProperty(obj, "list.0.name", "test"); // obj.list => [{ name: "test" }]
```

#### getObjectProperty(object, path, defaultValue)

沿属性路径获取值，路径不存在时返回默认值。

```js
const obj = { a: { b: { c: 12 } } };
getObjectProperty(obj, "a.b.c");           // => 12
getObjectProperty(obj, "a.x.y", "none");   // => "none"
```

## 贡献代码

1. **Fork** 本仓库到你的账号下
2. 从 `main` 分支创建新的功能分支：`git checkout -b feat/your-feature`
3. 安装依赖：`npm install`
4. 进行开发，确保：
   - 新增方法有完整的类型注解和注释
   - 新增方法有对应的测试用例
   - 运行 `npm run lint` 无报错
   - 运行 `npm run test:coverage` 测试通过
5. 提交代码，遵循提交规范（见上方"代码提交规范"）
6. 推送到远程分支并创建 Pull Request

## 问题反馈

如有问题或建议，请提交 [Issue](https://github.com/yujinjin/utils/issues) 或发送邮件至 yujinjin9@126.com。
