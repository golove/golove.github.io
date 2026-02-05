---
title: javaScript继承多态闭包
published: 2020-04-10 01:50:53
description: 'javaScript 继承 多态 闭包'
image: '../images/javascript.png'
tags: [javaScript,继承,多态,闭包]
category: 'javaScript'
draft: false 
lang: ''
---

## 构造函数继承

构造函数继承的关键：在child构造函数中执行`Parent.call(this)`


```js
function Parent(name){
    this.name=name;
    this.hobby=[];
    this.speak=function(){
        console.log("Parent spea");
    }// 缺点1：new多个child时Parent构造函数中的方法会在每个child中拷贝一份，浪费内存
}
Parent.prototype.say = function(){
    console.log("Parent say")
} // 缺点2：Parent原型对象上的方法不会被Child继承

function Child(name,type){
    Parent.call(this,name);
    this.type = type;
}
```
<!-- more -->


## 原型继承

原型继承的关键：设置Child的原型指向Parent, `Child.prototype=new Parent()`

```js
function Parent(name){
    this.name = name;
    this.hobby=[]; // 缺点：Parent的引用属性会被所有Child实列共享，互相干扰
}
Parent.prototype.say = function(){
    console.log("Parent say");
}
function Child(type){
    this.type =type;
}
Child.prototype = new Parent();
```

## 组合继承

#### 组合继承的关键：

* 属性使用构造函数继承，避免了原型继承中`Parent`引用属性被所有`Child`实例共享的缺陷
* 方法使用原型继承，避免了构造函数继承中方法重复拷贝，浪费内存的缺陷

```js 
function Parent(name){
    this.name = name;
    this.hobby = []; //属性放在构造函数中
}
Parent.ptototype.say = function(){
    console.log('Parent say');
}
function Child(name,type){
    Parent.call(this,name); // Child 继承Parent属性（构造函数继承）
    this.type = type; // Child 扩展属性
}
Child.prototype = Object.create(Parent.prototype);//Child继承Parent方法（原型继承）
Child.prototype.speak=function(){ //Child扩展方法
    console.logd("Child speak")
}
Child.prototype.constructor = Child; // 修复Child的constructor指向，否则Child的constructor会指向Parent
```

#### 补充：

对于组合继承中的 ` Child.prototype = Object.create(Parent.prototype)`还有两种常见的写法

* `Child.prototype  = Parent.prototype` 修改`Child.prototype`就等于修改`Parent.prototype`,会干扰所有的Parent实例

* `Child.prototype = New Parent()` Parent构造函数重复调用的两次，浪费效率，且如果Parent构造函数有副作用，重复调用可能造成不良后果



## js中的多态

多态的实际含义是同一操作作用于不同的对象可以产生不同的解散和不同的执行结果。  

多态"的思想把不变的部分隔离出来，把可变的部分封装起来，这给予我们扩展程序的能力，相对于修改代码，仅仅增加代码就能完成相同的功能，这样就优雅和安全的多。

```js 
let MakeAction = function(animale){
	animale.action()
}

let Cat = function(){}
Cat.prototype.sound = function(){
    console.log('miao miao')
}

let Dog = function(){}
Dog.prototype.sound = function(){
    console.log('wang wang wang')
}
MakeAction(new Cat());
MakeAction(new Dog());


```



## js 闭包

闭包指能够访问另一个函数作用域的变量的函数，

闭包就是一个函数，这个函数能够访问其他函数的作用域中的变量。

```js	
let add = (function () {
let counter = 0;
return function () {return counter += 1}
})();

add();
add();
add();
```

add 变量可以作为一个函数使用，它可以访问函数上一层作用域的 它使得函数拥有私有变量变成可能

#### js 闭包实现递归

```js 
let inify = function f(num){
    if(num<1){return 1}
    else{
      return num * f(num-=1)
    }
}
```

