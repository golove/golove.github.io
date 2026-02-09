---
title: "Swift 编程语言学习笔记"
published: 2026-02-09
description: "Swift 编程语言的系统性学习笔记，包含基础语法、面向对象、函数式编程、错误处理等核心概念"
tags: [Swift, iOS, macOS, 编程语言, Apple]
category: 技术
draft: false
lang: zh
---

# Swift 编程语言学习笔记

Swift 是 Apple 于 2014 年推出的现代编程语言，用于开发 iOS、macOS、watchOS 和 tvOS 应用。

## 基础语法

### 变量与常量

```swift
// 使用 let 声明常量
let maxLoginAttempts = 10
let welcomeMessage: String = "Hello, Swift!"

// 使用 var 声明变量
var currentLoginAttempt = 0
var x = 0.0, y = 0.0, z = 0.0

// 类型推断
let meaningOfLife = 42        // Int
let pi = 3.14159              // Double
let anotherPi = 3 + 0.14159   // Double
```

### 数据类型

```swift
// 整数类型
let minValue = UInt8.min    // 0
let maxValue = UInt8.max    // 255

// 浮点数
let floatValue: Float = 3.14
let doubleValue = 3.14159265359

// 字符串
let name = "Swift"
let greeting = "Hello, \(name)!"  // 字符串插值

// 数组
var skills = ["Python", "JavaScript"]
skills.append("Swift")
let immutableArray = [1, 2, 3]

// 字典
var userInfo: [String: Any] = [
    "name": "John",
    "age": 25,
    "isDeveloper": true
]
userInfo["city"] = "Beijing"

// 集合
var favoriteGenres: Set<String> = ["Rock", "Classical", "Hip hop"]
favoriteGenres.insert("Jazz")
```

## 控制流

### 条件语句

```swift
// if 语句
let temperature = 22
if temperature <= 18 {
    print("天气较凉")
} else if temperature >= 30 {
    print("天气炎热")
} else {
    print("天气舒适")
}

// 三元运算符
let status = temperature >= 25 ? "温暖" : "凉爽"

// switch 语句
let fruit = "Apple"
switch fruit {
case "Apple":
    print("这是一个苹果")
case "Banana":
    print("这是一根香蕉")
case "Orange", "Mango":      // 多个值匹配
    print("这是橙子或芒果")
default:
    print("未知水果")
}

// 范围匹配
let score = 85
switch score {
case 0..<60:
    print("不及格")
case 60..<80:
    print("及格")
case 80..<90:
    print("良好")
case 90...100:
    print("优秀")
default:
    print("超出范围")
}
```

### 循环语句

```swift
// for-in 循环
for i in 1...5 {
    print(i)  // 1, 2, 3, 4, 5
}

for fruit in ["Apple", "Banana", "Orange"] {
    print(fruit)
}

for (index, item) in ["A", "B", "C"].enumerated() {
    print("Index: \(index), Value: \(item)")
}

// while 循环
var counter = 0
while counter < 5 {
    counter += 1
    print(counter)
}

// repeat-while (do-while)
repeat {
    print("至少执行一次")
} while false
```

## 函数

### 基本函数

```swift
// 无参数无返回值
func sayHello() {
    print("Hello!")
}

// 有参数
func greet(name: String) -> String {
    return "Hello, \(name)!"
}

// 多参数
func calculateArea(width: Double, height: Double) -> Double {
    return width * height
}

// 无标签参数
func sum(_ a: Int, _ b: Int) -> Int {
    return a + b
}

// 参数标签
func introduce(person name: String, from city: String) {
    print("\(name) 来自 \(city)")
}

introduce(person: "张三", from: "北京")

// 默认参数
func log(message: String, level: String = "INFO") {
    print("[\(level)] \(message)")
}

log(message: "程序启动")           // [INFO] 程序启动
log(message: "发生错误", level: "ERROR")
```

### 函数类型

```swift
// 函数类型作为参数
func operation(a: Int, b: Int, function: (Int, Int) -> Int) -> Int {
    return function(a, b)
}

let add: (Int, Int) -> Int = { $0 + $1 }
let multiply: (Int, Int) -> Int = { $0 * $1 }

print(operation(a: 5, b: 3, function: add))       // 8
print(operation(a: 5, b: 3, function: multiply))  // 15

// 函数类型作为返回值
func chooseOperation(operator op: String) -> (Int, Int) -> Int {
    switch op {
    case "+":
        return { $0 + $1 }
    case "*":
        return { $0 * $1 }
    default:
        return { $0 - $1 }
    }
}

let chooseAdd = chooseOperation(operator: "+")
print(chooseAdd(10, 20))  // 30
```

## 闭包

```swift
// 基本语法
let greetClosure = { (name: String) in
    return "Hello, \(name)"
}

// 尾随闭包
numbers.map { $0 * 2 }

// 捕获值
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

let incrementByTwo = makeIncrementer(forIncrement: 2)
print(incrementByTwo())  // 2
print(incrementByTwo())  // 4
print(incrementByTwo())  // 6
```

## 面向对象

### 类与结构体

```swift
// 结构体 - 值类型
struct Point {
    var x: Double
    var y: Double
    
    init(x: Double, y: Double) {
        self.x = x
        self.y = y
    }
    
    func distance(to other: Point) -> Double {
        let dx = other.x - x
        let dy = other.y - y
        return sqrt(dx * dx + dy * dy)
    }
}

// 类 - 引用类型
class Vehicle {
    var currentSpeed = 0.0
    let maxSpeed: Double
    
    init(maxSpeed: Double) {
        self.maxSpeed = maxSpeed
    }
    
    func description() -> String {
        return "当前速度: \(currentSpeed) km/h"
    }
    
    // 子类可重写
    func makeSound() {
        // 默认实现
    }
}

class Car: Vehicle {
    var brand: String
    
    init(brand: String, maxSpeed: Double) {
        self.brand = brand
        super.init(maxSpeed: maxSpeed)
    }
    
    override func makeSound() {
        print("嘟嘟嘟~")
    }
    
    // 属性观察者
    var speedInKmh: Double {
        get {
            return currentSpeed
        }
        set {
            currentSpeed = newValue
        }
    }
}
```

### 继承与多态

```swift
class Shape {
    var area: Double { return 0 }
    
    func describe() {
        print("这是一个图形")
    }
}

class Rectangle: Shape {
    var width: Double
    var height: Double
    
    init(width: Double, height: Double) {
        self.width = width
        self.height = height
    }
    
    override var area: Double {
        return width * height
    }
    
    override func describe() {
        print("这是一个矩形, 面积: \(area)")
    }
}

class Circle: Shape {
    var radius: Double
    
    init(radius: Double) {
        self.radius = radius
    }
    
    override var area: Double {
        return .pi * radius * radius
    }
}

// 多态
let shapes: [Shape] = [
    Rectangle(width: 5, height: 3),
    Circle(radius: 2)
]

for shape in shapes {
    shape.describe()
}
```

## 协议

```swift
// 定义协议
protocol Drawable {
    func draw()
    var lineColor: String { get set }
}

protocol Movable {
    func move(to point: Point)
}

// 协议继承
protocol ShapeProtocol: Drawable, Movable {
    var area: Double { get }
}

// 类遵守协议
class CircleShape: ShapeProtocol {
    var center: Point
    var radius: Double
    var lineColor: String
    
    init(center: Point, radius: Double, lineColor: String) {
        self.center = center
        self.radius = radius
        self.lineColor = lineColor
    }
    
    func draw() {
        print("画圆, 圆心: (\(center.x), \(center.y)), 半径: \(radius)")
    }
    
    func move(to point: Point) {
        center = point
        print("圆移动到: (\(point.x), \(point.y))")
    }
    
    var area: Double {
        return .pi * radius * radius
    }
}

// 协议扩展
extension Drawable {
    func drawWithBorder() {
        print("边框颜色: \(lineColor)")
        draw()
    }
}
```

## 泛型

```swift
// 泛型函数
func swapValues<T>(_ a: inout T, _ b: inout T) {
    let temp = a
    a = b
    b = temp
}

var a = 1, b = 2
swapValues(&a, &b)
print("a = \(a), b = \(b)")  // a = 2, b = 1

// 泛型类型
struct Stack<Element> {
    private var items: [Element] = []
    
    mutating func push(_ item: Element) {
        items.append(item)
    }
    
    mutating func pop() -> Element? {
        return items.popLast()
    }
    
    var isEmpty: Bool {
        return items.isEmpty
    }
}

var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
print(intStack.pop())  // 2

// 泛型协议
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

## 错误处理

```swift
// 定义错误类型
enum DataError: Error {
    case notFound
    case unauthorized
    case invalidData(String)
    case networkError(Int)
}

// 抛出错误
func fetchData(from url: String) throws -> Data {
    guard url.hasPrefix("https://") else {
        throw DataError.invalidData("URL 必须以 https:// 开头")
    }
    
    // 模拟网络请求
    throw DataError.notFound
}

// 处理错误
do {
    let data = try fetchData(from: "http://example.com")
} catch DataError.notFound {
    print("数据未找到")
} catch DataError.unauthorized {
    print("未授权访问")
} catch let DataError.invalidData(message) {
    print("无效数据: \(message)")
} catch {
    print("发生未知错误: \(error)")
}

// try? - 将错误转换为可选值
let result = try? fetchData(from: "https://example.com")
// 如果出错, result 为 nil

// try! - 断言不会出错 (慎用!)
let forcedResult = try! fetchData(from: "https://example.com")

// defer - 延迟执行
func processFile() throws {
    let file = openFile()
    defer {
        closeFile(file)  // 无论是否出错,都会执行
    }
    
    try writeData(to: file)
    try anotherOperation()
}
```

## 可选链与空合运算符

```swift
// 可选链
class Person {
    var residence: Residence?
}

class Residence {
    var address: Address?
}

class Address {
    var street: String = ""
    var city: String = ""
    var zipCode: String?
}

let john = Person()
let street = john.residence?.address?.street  // 如果任何环节为 nil, 返回 nil

// 空合运算符 ??
let defaultCity = "北京"
let city = john.residence?.address?.city ?? defaultCity

// 可选绑定
if let street = john.residence?.address?.street {
    print("街道: \(street)")
} else {
    print("地址信息不完整")
}

// 隐式展开可选
var assumedString: String! = nil
// 直接使用,无需解包
let implicitString: String = assumedString
```

## 内存管理

```swift
// 强引用循环
class Person {
    var name: String
    var apartment: Apartment?
    
    init(name: String) {
        self.name = name
    }
    
    deinit {
        print("\(name) 被释放")
    }
}

class Apartment {
    var tenant: Person?
    
    deinit {
        print("公寓被释放")
    }
}

// 解决: 使用 weak 或 unowned
class Person2 {
    var name: String
    weak var apartment: Apartment2?  // weak
    
    init(name: String) {
        self.name = name
    }
}

class Apartment2 {
    var tenant: Person2?
    unowned let building: Building   // unowned
    
    init(building: Building) {
        self.building = building
    }
}
```

## 访问控制

```swift
// open - 最高权限,可跨模块访问和继承
open class OpenClass {}

// public - 跨模块访问,不可继承
public class PublicClass {}

// internal - 默认,模块内访问
class InternalClass {}

// fileprivate - 文件内访问
fileprivate class FilePrivateClass {}

// private - 当前作用域内访问
private class PrivateClass {
    private var secret: String = "机密"
    
    func access() {
        let secret2 = secret  // 可以访问
    }
}
```

## 总结

Swift 是一门现代、安全、高效的编程语言：

- **安全性**: 强类型系统、可选类型、自动内存管理
- **现代性**: 语法简洁、支持泛型、函数式编程特性
- **高性能**: 编译型语言,性能接近 C++
- **易用性**: 丰富的标准库、优秀的错误处理机制

掌握 Swift 的核心概念是开发 Apple 平台应用的基础。

## 参考资源

- [Swift 官方文档](https://docs.swift.org/swift-book/)
- [Swift Programming Language (Apple)](https://developer.apple.com/swift/)
- [Swift 进阶指南](https://swiftgg.gitbook.io/swift/)
