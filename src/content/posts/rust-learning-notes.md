# Rust 学习笔记

## 1. 为什么选择 Rust?
- **内存安全**：通过所有权系统在编译期防止空指针和数据竞争。
- **零成本抽象**：高级抽象不会带来运行时开销，性能可媲美 C/C++。
- **现代生态**：Cargo 包管理器、rustup 多工具链、丰富的 crates.io 库。

## 2. 基础语法
### 变量与可变性
```rust
let x = 5;          // 不可变绑定
let mut y = 10;     // 可变绑定
```
### 数据类型
- 标量：`i32`, `u64`, `f64`, `bool`, `char`
- 复合：元组 `let tup: (i32, f64) = (1, 2.0);`、数组 `let arr = [1, 2, 3];`
### 函数
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```
### 控制流
- `if`, `match`, 循环 `loop`, `while`, `for`。

## 3. 所有权、借用与生命周期
### 所有权规则
1. 每个值都有唯一的所有者。
2. 同一时间只能有一个所有者。
3. 当所有者离开作用域，值会被丢弃（`drop`）。
### 借用
- **不可变借用**：`let r = &s;`（可有多个）。
- **可变借用**：`let r_mut = &mut s;`（同一时间只能有一个）。
### 生命周期
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```
`'a` 表示返回的引用的生命周期至少和输入引用一样长。

## 4. 常用标准库
- `std::io`：输入输出。
- `std::collections`：`HashMap`, `HashSet` 等集合。
- `std::thread` 与 `std::sync`：并发原语（`Arc`, `Mutex`）。

## 5. Cargo 与 Crates.io
```bash
# 创建新项目
cargo new my_project
cd my_project
# 编译并运行
cargo run
# 添加依赖
cargo add serde serde_json
```
`Cargo.toml` 示例：
```toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

## 6. 实战小例子：读取 JSON 并打印
```rust
use std::fs;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Config {
    name: String,
    debug: bool,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = fs::read_to_string("config.json")?;
    let cfg: Config = serde_json::from_str(&data)?;
    println!("Config: {:?}", cfg);
    Ok(())
}
```

## 7. 学习资源
- 官方文档： https://doc.rust-lang.org/book/
- Rust By Example： https://doc.rust-lang.org/rust-by-example/
- 社区： Reddit r/rust, Discord #rust-lang
- 视频教程：YouTube 上 "Let's Get Rusty" 系列。

---
**Tips**
- 多写小程序练手，熟悉 `Result<T, E>` 错误处理。
- 使用 `rust-analyzer` 插件提升编辑器体验。
- 阅读和模仿优秀的开源项目，例如 `tokio`, `actix-web`。
