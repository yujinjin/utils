# utils

前端常用工具包

## 1.安装

```js
npm install --save @yujinjin/utils
```

## 2.导入

```js
import { guid, randomId, stringFormat, ... } from "@yujinjin/utils";
```

## 3.项目脚本命令

打包命令

```js
// vt：版本，默认值为：patch（值为：版本号、‘major’、‘minor’、‘patch’，可选）
npm run build --vt=1.0.1
```

发布命令

```js
// vt：版本，默认值为：patch（版本号、‘major’、‘minor’、‘patch’，可选）
npm run publish --vt=patch
```

单元测试 UI

```
npm run test
```

单元测试覆盖

```
npm run test:coverage
```

eslint

```
npm run lint
```

## 4.代码提交规范

1. 提交类型：["feat", "ui", "fix", "docs", "style", "refactor", "build", "ci", "perf", "chore", "revert", "test"]，且必须使用小写
2. header 内容的最大长度为 72
3. subject 内容不能为空，最小长度为 1

```
// 示例
feat: 增加其他常用工具类方法-number2text
```

## 5.utils 方法说明

### 5.1 extend

对象深复制，创建对象和继承

示例：

```js
// 深复制
extend(true, { a: 1 }, { b: 1 });

// 浅复制
extend({ a: 1 }, { b: 1 }, { c: 1 });
```

### 5.2 format

常用格式化方法

##### 5.2.1 dateFormat

日期格式化

示例：

```js
// 默认日期格式化 返回yyyy-MM-DD格式
dateFormat(new Date());

// 指定日期格式化
dateFormat("2023-07-10T09:35:06.000+0000", "yyyy-MM-DD HH:mm:ss");
```

##### 5.2.2 timeDifferenceFormat

日期时间段显示格式化，60 秒以内: 刚刚之前、1 小时以内：mm 分钟前、24 小时以内：hh 小时前、1-30 天：dd 天前、30 天以上：mm/dd、如果 30 天以上，并且跨年：yyyy/mm/dd

示例：

```js
timeDifferenceFormat(new Date().getTime() - 10 * 1000); // 返回：刚刚之前

timeDifferenceFormat(new Date().getTime() - 40 * 24 * 60 * 60 * 1000); // 返回：MM/DD
```

##### 5.2.3 numberFormat

将数值格式化，并四舍五入

示例：

```js
numberFormat("1,234,567.45"); // 返回：1,234,567

numberFormat(1234567.45, 1); // 返回：1,234,567.5
```

##### 5.2.4 stringFormat

字符串内容格式化

示例：

```js
stringFormat("我是{0}，今年{1}了", ["JACK", 12]); // 我是JACK，今年12了

numberFormat("我是{name}，今年{age}了", { name: "JACK", age: 12 }); // 我是JACK，今年12了
```

### 5.3 generate

动态生成数据

##### 5.3.1 guid

生成 32 的字符串，每一位都是随机的 16 进制数，重复的概率是 1/(16^32)

示例：

```js
guid(); // 返回长度为32的字符串，比如：948600CA-9357-4518-9AA7-649BC5DAD19C
```

##### 5.3.2 randomId

生成 id 随机数(年月日+8 位随机数)

示例：

```js
randomId(); // 返回随机数，比如：20230918df822cba
```

### 5.4 url

URL 常用方法

##### 5.4.1 changeUrlParameter

修改 url 中的参数值，如果参数名(name)在 URL 中不存在且有 value 值就表示增加该参数，如果 value 为 null 或者空字符串就表示删除该参数

示例：

```js
// 修改URL中的name参数值，当前没有name参数会自动添加
changeUrlParameter("http://wwww.xxx.com", "name", "test2"); // 返回：http://wwww.xxx.com?name=test2

// 删除URL中的name参数
changeUrlParameter("http://wwww.xxx.com?name=test1", "name"); // 返回：http://wwww.xxx.com
```

##### 5.4.2 parseUrl

解析 URL 的参数、域名、协议、端口等对象

示例：

```js
// 修改URL中的name参数值，当前没有name参数会自动添加
parseUrl("http://wwww.xxx.com"); // 返回：{ sources, query, params, file, hash, host, ... }
```

### 5.5 validation

常用验证类方法

##### 5.5.1 chinaPhoneNumberValidate

中国手机号码验证

示例：

```js
chinaPhoneNumberValidate("13743244312"); // 返回：true
```

##### 5.5.2 emailValidate

验证邮箱

示例：

```js
emailValidate("324243432@qq.com"); // 返回：true
```

##### 5.5.3 chinaIDCardValidate

中国身份证验证（支持香港、澳门、台湾）

示例：

```js
// 大陆身份证
chinaIDCardValidate("130701199310302288"); // 返回：true

// 香港身份证
chinaIDCardValidate("B123456(F)"); // 返回：true

// 台湾身份证
chinaIDCardValidate("C123456789"); // 返回：true

// 澳门身份证
chinaIDCardValidate("5123456(1)"); // 返回：true
```

##### 5.5.4 validateBankCard

验证银行卡，验证规则是：全数字，10 到 30 位, 覆盖对公/私账户, 参考[微信支付](https://pay.weixin.qq.com/wiki/doc/api/xiaowei.php?chapter=22_1)

示例：

```js
validateBankCard("321342131"); // 返回：true
```

##### 5.5.5 validateName

验证姓名，验证规则是：全中文，或者中文之间有（·），或者全英文

示例：

```js
validateName("测试"); // 返回：true

validateName("艾格里·买买提"); // 返回：true

validateName("jack yu"); // 返回：true

validateName("测 试"); // 返回：false

validateName("测试J"); // 返回：false

validateName("J"); // 返回：false
```

##### 5.5.6 validateChineseCharacter

全汉文验证，和 validateName 的区别就在于支持新加的汉字识别

示例：

```js
validateChineseCharacter("测试"); // 返回：true

validateChineseCharacter("测试䳸鿏"); // 返回：true

validateChineseCharacter("测？试"); // 返回：false

validateChineseCharacter("测𝒳试"); // 返回：false

validateChineseCharacter("测试jackyu"); // 返回：false
```

##### 5.5.7 validatePassword

验证密码格式，验证规则是：密码内容长度 8-20 位，且必须是数字、小写字母、大写字母、特殊字符这四种组合

示例：

```js
validatePassword("1W2D8^yu123edc"); // 返回：true
```

##### 5.5.8 validateSocialCreditCode

验证统一社会信用代码，验证规则是：统一代码由十八位的阿拉伯数字或大写英文字母(不使用 I、O、Z、S、V)组成；第 1 位登记管理部门代码；第 2 位机构类别代码；第 3 位~第 8 位登记管理机关行政区划码；第 9 位~第 17 位主体标识码(组织机构代码)；第 18 位校验码

示例：

```js
validateSocialCreditCode("91350100M000100Y43"); // 返回：true
```

##### 5.5.9 validateSimpleSocialCreditCode

统一社会信用代码(宽松匹配)(15 位/18 位/20 位数字/大小写字母)

示例：

```js
validateSimpleSocialCreditCode("91350100M000100"); // 返回：true
```

### 5.6 others

其他常用工具类方法

##### 5.6.1 loadScript

页面动态加载 JS 文件，如果超过 10S 文件还未加载表示超时

示例：

```js
await loadScript("https://res.wx.qq.com/open/js/jweixin-1.4.0.js", "jweixin"); // 返回true
```

##### 5.6.2 throttle

函数节流，提升性能,用于操作函数节流，节流就间隔时间段 时间内执行一次，也就是降低频率，将高频操作优化成低频操作。

示例：

```js
const cb = throttle(function (e) {
    console.info("eventListener", e);
}, 250);

window.addEventListener("scroll", cb, false);
```

##### 5.6.3 debounce

函数防抖

示例：

```js
const ajax = function (e) {
    console.info("debounce runner", e);
};

const cb = debounce(ajax, 1000);

input.addEventListener("keyup", function (e) {
    cb(e);
});
```

##### 5.6.4 number2text

数字转中文数码

示例：

```js
number2text(100000000); // 返回 "壹亿元整"
```

##### 5.6.5 setObjectProperty

设置 object 对象中对应 path 属性路径上的值，如果 path 不存在，则创建。 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。

示例：

```js
const obj = { a: 1, b: 2 };

setObjectProperty(obj, "c.0.f", 3); // obj 的值为：{a: 1, b: 2, c: [{f: 3}]}

setObjectProperty(obj, ["a", 0, "c"], 3); // obj 的值为：{a: [{c: 3}], b: 2}
```

##### 5.6.6 getObjectProperty

根据 object 对象的 path 路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。

示例：

```js
const obj = { a: [{ c: 1 }], b: 2 };

getObjectProperty(obj, "a[0].c", 3); // 返回：1

setObjectProperty(obj, ["a", 0, "f"], 3); // 返回：3
```
