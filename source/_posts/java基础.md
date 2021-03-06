---
title: java基础
date: 2020-04-10 19:22:47
tags: java
categories： java
---



* 基础语法

* 面向对象

* 继承与多态

* 常用的api

  <!-- more -->

#### 基本数据类型

* 整数型 byte short int long

* 浮点型 float double
* 字符型 char
* 布尔型 boolean

==注意事项：==

​    1.字符串不是基本类型，而是引用类型。

​    2.浮点型可能只是一个近似指而非精确的值。

​    3.数据范围与字节数不一定相关，例如float数据范围比long更加广泛，但是float是4字节，long是8字节。

​    4.浮点数中默认是double类型，如果要指定为float类型，需要加后缀F，整数默认是int类型，如果要指定为long类型需要家后缀L。

###### 数据类型转换

* 自动转换（隐式）

  特点：代码不需要进行特殊处理，自动完成

  规则：数据范围从小到大

* 强制转换（显式）

  特点：代码需要进行特殊格式处理，不能自动完成

  格式：范围小的类型 变量名 = （范围小的类型）原本范围大的数据 

  例如：` int num = (int) 300L;`

  注意：强制类型转换一般不推荐使用，因为有可能发生精度损失，数据溢出

  ​            byte/short/char这三种类型进行数学运算时会先被提升为int类型，然后在计算

#### 引用数据类型

* 字符串

* 数组

* 类

* 接口

* Lambda

  

#### switch语句使用注意事项：

* switch后面小括号中只能是下列数据类型

  基本数据类型：byte/short/char/int

  引用数据类型：String（字符串）/enum（枚举）

  

## Java的内存需要划分成为5个部分

1. 栈 （Stack) :存放的都是方法中的局部变量。方法的运行一定要在栈当中运行。

   局部变量：方法的参数，或者是方法{}内部的变量

   作用域：一旦超出作用域，立即从栈内存中消失。

2. 堆（Heap) :凡是new出来的东西，都在堆当中。

   堆内存里面的东西都有一个地址值：16进制。

   堆内存里面的数据都有默认值：

   | 数据类型 | 默认值   |
   | :------- | -------- |
   | 整数     | 0        |
   | 浮点数   | 0.0      |
   | 字符     | ‘\u0000' |
   | 布尔     | false    |
   | 引用     | null     |

3. 方法区（Method Area) : 存储.class相关信息，包含方法的信息。

4. 本地方法栈 (Native Method Stack) :与操作系统相关。

5. 寄存器 （PC Register) : 与CPU相关。



## 类的定义

现实世界的一类事物：

* 属性：事物的状态信息
* 行为：事物能够做什么

`java`中类的定义：

```java
public class ClassName{
    // 成员变量
    // 成员方法
}
```



#### 局部变量和成员变量：

1. 定义的位置不一样
   * 局部变量：在方法内部
   * 成员变量：在方法外部，，写在类当中

2. 作用范围不一样
   * 局部变量：只有方法当中才可以使用，出了方法就不能在用了 
   * 成员变量：在整个类中都可以使用

3. 默认值不一样
   * 局部变量：没有默认值，必须要手动赋值
   * 成员变量：如果没有赋值，会有默认值，规则和数组一样

4. 内存的位置不一样
   * 局部变量：位于栈内存中
   * 成员变量：位于堆内存中

5. 生命周期不一样
   * 局部变量：随着方法进栈而诞生，随着方法出栈而消失
   * 成员变量：随着对象创建而诞生，随着对象被垃圾回收而消失

## 面向对象三大特征：封装，继承，多态

#### 封装在java中的体现











## ArrayList<E>

ArrayList当中常用的方法：

```java
public boolean add(E e) //向集合当中添加元素，参数类型和泛型一致。
public E get(int index) //从集合当中获取元素，参数是索引，返回值就是对应位置的元素。
public E remove(int index) //从集合当中移除一个元素，参数是索引，返回值是被移除的元素。
public int size() // 获取集合的长度，返回值是集合中包含元素的个数。
```



#### 如果希望往集合ArrayList当中储存基本类型数据，必须使用基本类型对应的包装类

| 基本类型 | 包装类（引用类型，包装类都位于`java.lang`包 下） |
| -------- | ------------------------------------------------ |
| byte     | Byte                                             |
| short    | Short                                            |
| int      | Integer                                          |
| long     | Long                                             |
| floot    | Floot                                            |
| double   | Double                                           |
| char     | Character                                        |
| boolean  | Boolean                                          |

