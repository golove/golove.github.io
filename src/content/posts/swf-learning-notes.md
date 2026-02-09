---
title: "SWF 文件格式学习笔记"
published: 2026-02-09
description: "SWF (Shockwave Flash) 文件格式的详细学习笔记，包含文件结构、文件头、标签机制等核心概念"
tags: [SWF, Flash, 文件格式, 二进制, 逆向工程]
category: 技术
draft: false
lang: zh
---

# SWF 文件格式详解

SWF (Small Web Format) 是一种由 Macromedia/Adobe 开发的矢量图形文件格式，曾广泛用于网页动画和交互内容。

## 文件结构概述

```
SWF 文件结构
├── 文件头 (Header)
├── 标签序列 (Tag List)
│   ├── 标签 1
│   ├── 标签 2
│   └── ...
└── 结束标签 (End Tag)
```

## 文件头详解

```c
// SWF 文件头结构
struct SWFHeader {
    uint8_t  signature[3];     // "FWS" (未压缩) 或 "CWS" (压缩)
    uint8_t  version;          // 版本号
    uint32_t fileLength;       // 文件总长度
    // 可选：压缩区域开始
    RECT     frameSize;        // 影片尺寸
    fixed16  frameRate;        // 帧率
    uint16   frameCount;       // 总帧数
};
```

## 标签机制

SWF 使用**标签 (Tag)** 来组织数据，每个标签包含特定类型的信息。

### 常见标签类型

| 标签 ID | 名称 | 描述 |
|---------|------|------|
| 0 | End | 文件结束标记 |
| 1 | ShowFrame | 显示当前帧 |
| 9 | SetBackgroundColor | 设置背景色 |
| 10 | DefineFont | 定义字体 |
| 11 | DefineText | 定义文本 |
| 12 | DoAction | 执行动作 |
| 21 | DefineVideoStream | 定义视频流 |
| 24 | Protect | 文件保护 |
| 36 | DefineBitsJPEG2 | JPEG 图片 |
| 37 | JPEGTables | JPEG 表格 |
| 46 | DefineSprite | 定义影片剪辑 |

### 标签结构

```c
struct SWFTag {
    uint16  tagCode;      // 标签类型 (高10位)
    uint32  tagLength;     // 标签长度 (低22位)
    byte    tagData[];    // 标签数据
};
```

## 常用标签详解

### SetBackgroundColor (标签 9)

设置 SWF 文件的背景颜色：

```c
// 背景色标签结构
struct SetBackgroundColor {
    uint8  red;    // 0-255
    uint8  green;  // 0-255
    uint8  blue;   // 0-255
};
```

### DefineText (标签 11)

定义文本对象：

```c
struct DefineText {
    uint16     characterId;    // 字符 ID
    RECT       bounds;         // 文本边界
    MATRIX     matrix;         // 变换矩阵
    uint8      glyphBits;      // 字形位数
    uint8      advanceBits;    // 前进位数
    TextRecord records[];      // 文本记录
};
```

### DoAction (标签 12)

执行 ActionScript 代码：

```c
struct DoAction {
    uint8 actionCode;   // 动作码
    // ... 动作数据
    uint8 0x00;        // 结束标志
};
```

## ActionScript 基础

ActionScript 是 SWF 中使用的脚本语言：

```actionscript
// 变量定义
var message:String = "Hello, SWF!";
var count:Number = 0;

// 函数定义
function onLoad():Void {
    trace("影片加载完成");
}

// 事件处理
button.onRelease = function() {
    count++;
    trace("点击次数: " + count);
};
```

## 工具推荐

### 1. FFDec

Java 编写的 SWF 反编译器，支持：

- 反编译 ActionScript
- 导出资源文件
- 编辑 SWF 标签

```bash
# 安装 FFDec
java -jar ffdec.jar
```

### 2. SWFTools

命令行工具集：

```bash
# 提取图片资源
swfextract input.swf -I

# 提取音频
swfextract input.swf -a

# 转换为 SVG
swfrender input.swf -o output.svg
```

### 3. As3Sorcerer

专业的 ActionScript 反编译器

## 实用技巧

### 1. 解析 SWF 文件头

```python
def parse_swf_header(f):
    signature = f.read(3)
    version = f.read_byte()
    file_length = struct.unpack('<I', f.read(4))[0]
    print(f"Signature: {signature}")
    print(f"Version: {version}")
    print(f"File Length: {file_length}")
```

### 2. 提取所有标签

```python
def parse_tags(f):
    while True:
        header = f.read(2)
        if len(header) < 2:
            break
        tag_and_len = struct.unpack('<H', header)[0]
        tag_code = tag_and_len >> 6
        tag_len = tag_and_len & 0x3F
        # 处理长标签
        if tag_len == 0x3F:
            tag_len = struct.unpack('<I', f.read(4))[0]
        # 读取标签数据
        data = f.read(tag_len)
```

### 3. 解压压缩的 SWF

```python
import zlib

def decompress_swf(data):
    if data[:3] == b'CWS':
        # CWS = ZLIB 压缩
        decompressed = zlib.decompress(data[8:])
        return b'FWS' + data[3:8] + decompressed
    return data
```

## SWF 安全相关

### 1. 安全沙箱

Flash Player 的安全沙箱限制：

```actionscript
// 检查是否在安全沙箱内
Security.sandboxType;

// 允许跨域访问
Security.allowDomain("*");
```

### 2. 防止反编译

- 使用代码混淆
- 设置文件保护标签
- 加密关键数据

## 总结

SWF 格式虽然已被 HTML5 淘汰，但了解其结构对于：

- Legacy 系统维护
- 数字取证分析
- 逆向工程学习

仍有重要价值。掌握标签机制和 ActionScript 是深入理解 SWF 的关键。

## 参考资源

- [SWF 格式规范 (Adobe)](https://www.adobe.com/devnet/swf.html)
- [SWFTools 工具集](https://www.swftools.org/)
- [FFDec 反编译器](https://github.com/jindrapetrik/jpexs-decompiler)
