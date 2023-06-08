## 1. 数组方法
    array.map(item => {
        // item是数组中的每个元素
    })
    array.reduce((pre, item)=>{
        
    }, [])

## 2. 路由组件
    由于路由组件匹配时是逐层匹配的，所以前缀若和前面的相同则匹配到被前面的路径对应的组件
    所以引入exact={true} 时，精确匹配，只有路径完全一致时才会匹配
    <Switch>
        <Route path='/xxx' component={} exact/>
        <Route path='/xxx' component={} />
        ...
        <Redirect to='/xxx' />
    </Switch>

    <LinkButton onClick={()=> this.props.history.push('/product/detail', {product})}>详情</LinkButton>
    这里的product是通过路由组件的方法push(url, [state])传递给子组件，作为state的属性传递过去
    可以在页面中查询组件属性，productDetail中就会有属性state：一个product对象
## 
    <span dangerouslySetInnerHTML={{__html:detail}}></span>
    detail 是一个标签格式的字符串,将detail按照标签格式形式进行解析
## 父子组件调用对方的方法
    1. 子组件调用父组件方法：将父组件的方法以函数属性的形式传递给子组件，子组件可以调用
    2. 父组件调用子组件方法：在父组件中通过ref得到子组件标签对象（组件对象）
## 对象的属性
    obj.attribute 形式只能添加 名为attribute的属性
    let a = 'attribute1'
    obj[a] = '1111'    使用中括号时，内部可以用变量，相当于obj[attribute1] = '1111'
    // api: index.jsx 中reqSearchProducts() : searchType是变量, 
        所以将变量作为属性名使用时，用[searchType]=searchName

    - Object()
        myObj = Object()
        obj[myObj] = '这是个特殊属性，属性名为 Object()'

    - typeof 
        console.log(typeof obj)  // 输出Object
    - in 
        console.log('name' in obj)      // 检查obj中是否有name属性： 有则输出true
    - for...in 遍历对象的属性
        语法： 
            循环次数等于可以枚举的属性个数（有的属性，比如用符号添加的属性就不能枚举：[Object()]:'特殊的属性'）
            for(let prop in obj){
                // obj[prop] 访问每个属性
            }
    - window对象
        - 浏览器中，浏览器为我们提供了一个window对象，可以直接访问
        - window对象代表的是浏览器窗口，通过该对象可以直接对浏览器窗口进行各种操作
            除此之外，window对象还负责存储JS中的内置对象和浏览器的宿主对象
        - window对象的属性可以通过window对象访问，也可以直接访问
        - 函数就可以认为是window对象的方法
        - window.a = 10 // 向window对象中添加的属性会自动成为全局变量
    - var
        - 用来声明变量，作用和let相同，但是var不具有块作用域
        - 在全局中使用var声明的变量，都会作为window对象的属性保存
        - 使用function声明的函数，都会作为window的方法保存

    - 变量的提升
        - 使用var声明的变量，会在所有代码执行前被声明，但不会被赋值。
        - 使用let声明的变量，实际也会提升，但是在赋值之前解释器禁止对该变量的访问
    - 函数的提升
        - 使用函数声明的函数，会在其他代码执行前被创建
        - 必须使用 function fn(){}  // 即以function开头的函数声明
## 面向对象
    - 类的属性（方法）
        （类的代码块，默认是严格模式）
        - 实例属性（方法）
            直接在类的代码块内声明的属性值，可以通过类创建的实例进行访问
            实例方法中的this就是当前实例
        - 静态属性（方法）
            属性前加 static 关键字后，变为静态属性，只能通过 类名.属性名 的方式访问
            静态方法中的this是当前类
        - 构造函数 constructor()
            - 在创建实例时会被调用，其中的this指向当前创建的实例
            - 可以在构造函数中，为实例属性进行声明/赋值
    - 封装
        - 实现封装的方法
            - 属性私有化，在属性前加 #
            - 通过getter和setter方法操作属性
                get 属性名(){ return this.#属性 }
                set 属性名(参数){ this.#属性 = 参数 }
    - 多态
    - 继承
        - 扩展性
        - 子类重写父类的构造方法时，首先必须调用super()
            子类也可通过super.父类方法() 调用父类方法       
## 对象和原型对象
    - 对象自身
        - 直接通过对象所添加的属性，位于对象自身
        - 在类中通过 属性=值 的形式添加的属性，位于对象自身在中
    - 原型对象
        -- 原型对象有一个constructor属性
        -- 获取原型对象的方法
            --- Object.getProtoType(对象实例) 
            --- 对象.__propto__
        -- 所有同类型对象的原型对象是同一个 ---> 同类型对象的原型链是一样的
            --- 每个对象中都有一个属性 __proto__
            --- 原型对象也负责存储对象中的属性，访问对象中的属性时，先从对象自身查找，
            找不到就到原型对象中找
        -- 添加到原型对象的情况：
            --- 在类中通过 xxx(){} 会位于原型对象上
            --- 主动向原型中添加的属性或方法
        -- 原型的作用
            --- 原型相当于一个公共区域，可以被所有该类的实例访问
            --- 继承就是通过原型实现的。子类的原型就是父类的实例
            ================================================
        -- 修改原型
            --- 通过 实例对象.__proto__ 能访问对象的原型
            --- 通过 类名.prototype 访问实例对象的原型
            --- 修改最好通过类去修改
            ================================================

    - instanceof、in、hasOwnProperty()、hasOwn()
        -- 实例对象 instanceof 类名
            返回boolean 值，判断该对象是否是该类的实例
        -- 属性名 in 对象
            返回boolean值，判断该对象及其原型链上是否有该属性
        -- 对象.hasOwnProperty(属性名)   --->  不推荐使用
            返回Boolean值，判断该对象本身是否有该属性（不包括原型链上）
        -- Object.hasOwn(对象, 属性名)
            返回Boolean值，检查对象自身是否有某个属性（不包括原型链上）

    - new运算符
        -- 使用new调用函数时，将会发生这些事：
            1. 创建一个普通的JS对象（Object对象 {}）, 为了方便，称其为新对象
            2. 将构造函数的prototype属性设置为新对象的原型
            3. 使用实参来执行构造函数，并且将新对象设置为函数中的this
            4. 如果构造函数返回的是一个非原始值，则该值会作为new运算的返回值返回（千万不要这么做）
                如果构造函数的返回值是一个原始值或者没有指定返回值，则新的对象将会作为返回值返回
                通常不会为构造函数指定返回值
## 对象的复制
    - 浅拷贝
        -- 通常对对象的拷贝都是浅拷贝
        -- 浅拷贝只是对对象的浅层进行复制
        -- 如果对象中存储的数据是原始值，那么拷贝的深浅无所谓
        -- 浅拷贝只是对对象本身进行复制，不会复制对象中的属性

        -- Object.assign(目标对象， 被复制的对象)
            将被复制对象中的属性复制到目标对象中，并将目标对象返回
        -- 也可以使用展开运算符对对象进行复制
            const obj = {name:"孙悟空", age:18}
            const obj2 = {address:"石头", ...obj}

            const arr = [1, 2, 3]
            function sum(a, b, c)
            console.log(sum(...arr))     // 输出6
    - 深拷贝
        -- 深拷贝不仅复制对象本身，还复制对象中的属性和元素
        -- 一般不使用深拷贝
        -- structuredClone() 专门用于深拷贝的函数
            const arr2 = structureedClone(arr)
    - 
## 对象的解构
    const obj = { name: "孙悟空", age: 18, gender: "男" }
   ### 对象的解构
    解构的变量名需要与属性名保持一致，若不一致，可以通过以下方式对变量起别名
        let {name:a, age:b, gender:c, address:d="花果山"} = obj
   ### 声明变量的同时解构
    let { name, age, gender } = obj // 声明变量同时解构对象
   ### 先声明后解构
    let name, age, gender
    ;({ name, age, gender } = obj)      // JS解析器可能会把分号加错位置
   ### 通过解构赋值快速交换两个变量的值
    let a1 = 10; let a2 = 20;
    [a1, a2] = [a2, a1]



## 数组
   ### - 创建数组方法
        -- arr = new Array()
        -- arr = []
   ### - 数组的方法/属性
        非破坏性方法==============================
        -- arr.isArray() 
            检查一个对象是否是数组
        -- arr.at()
            根据参数索引获取数组中的指定元素
            可以接收负数索引，是数组倒数第几个元素
        -- arr.concat()
            连接两个或多个数组
            不会影响原数组，而是返回一个新的数组
        -- arr.indexOf(''(, num))   返回从第num个位置起的匹配的字符串的起始位置
        -- arr.lastIndexOf()
        -- arr.join()
            将一个数组中的元素连接为一个字符串
            参数：
                指定一个字符串作为连接符
        -- arr.slice(a, b)
            截取区间为 [a, b) 的数组，生成一个新的数组，不破坏原数组
            如果不传参数，则对数组进行浅拷贝 --->
                将原数组进行切片，产生一个新的数组；不会影响原数组
        -- arr.filter()
            - 将数组中符合条件的元素保存到一个新数组中返回
            - 需要一个回调函数作为参数，会为每一个元素去调用回调函数，并根据返回值来决定是否将元素添加到新数组中
            - 非破坏性方法，不会影响原数组
            let result = arr.filter((ele) => ele > 5)
            
        -- arr.map()
            - 根据当前数组生成一个新数组
            - 需要一个回调函数作为参数，
                回调函数的返回值会成为新数组中的元素
            - 非破坏性方法不会影响原数组
            let result = arr.map((ele) => ele * 2)

        -- arr.reduce()
            - 可以用来将一个数组中的所有元素整合为一个值
            - 参数：
                1. 回调函数，通过回调函数来指定合并的规则
                2. 可选参数，初始值
            result = arr.reduce((a, b) => a + b, 10)
    
        破坏性方法==============================
        -- push('') 
        -- pop()
        -- shift()
            删除并返回第一个元素
        -- unshift()
            向数组开头添加一个/多个元素，返回新的长度
        -- splice()
            - 可以删除、插入、替换数组中的元素
            - 参数：
                1. 删除的起始位置
                2. 删除的数量
                3~n. 要插入的元素
        -- reverse()
            - 反转数组
        
        -- sort()
            - sort用来对数组进行排序（会对改变原数组）
            - sort默认会将数组升序排列
                注意：sort默认会按照Unicode编码进行排序，所以如果直接通过sort对数字进行排序
                    可能会得到一个不正确的结果
            - 参数：
                - 可以传递一个回调函数作为参数，通过回调函数来指定排序规则
                    (a, b) => a - b 升序排列
                    (a, b) => b - a 降序排列
        -- forEach()
            - 用来遍历数组
            - 它需要一个回调函数作为参数，这个回调函数会被调用多次
                数组中有几个元素，回调函数就会调用几次
                每次调用，都会将数组中的数据作为参数传递
            - 回调函数中有三个参数：
                element 当前的元素
                index 当前元素的索引
                array 被遍历的数组      
   ### - 数组中的元素
        -- 任何类型都可以成为数组中的元素
   ### - 数组遍历
        -- for循环
        -- for(let value of arr){}  //可以用来遍历可迭代对象：数组中有几个元素就会执行几次
   ### - 数组去重
        -- 借助 indexOf()
            const arr = [1,2,1,3,2,2,4,5,5,6,7]
            for(int i=0; i<arr.length; i++){
                const index = arr.indexOf(arr[i], i+1)
                if(index !== -1){           // 有一个重复元素
                    arr.splice(index, 1)    // 删除该位置的重复元素
                    i--                     // 下一个元素移到原位置上，避免遗漏比较
                }
            }

        -- 借助 for( of )
            const arr = [1,2,1,3,2,2,4,5,5,6,7]
            const newArr = []
            for(let ele of arr){
                if(newArr.indexOf(ele) === -1){
                    newArr.push(ele)
                }
            }
        
        -- 

## 函数
   ### 词法作用域
    - 定义：
        函数的作用域，在函数创建时就已确定，和调用位置无关
    - 举例：
        function fn3(){
            let a = "fn3中的a"
            function fn4(){
                console.log(a)      // 访问的变量，找最近的外层作用域中的变量。
            }
            return fn4      
        }
        // 和函数被调用的位置无关，只找函数被定义时的作用域。
        let fn = fn3()         // 将fn3()的返回值fn4()赋值给fn
        // 调用fn()时，由于内部的fn4是在fn3内部定义的，所以访问的变量仍是fn3内的a
        fn()                   // 输出 "fn3中的a"

   ### 高阶函数
    - 定义：
        一个函数的参数或返回值是函数，则这个函数就称为高阶函数
        可以直接return ()=>{}
   ### 闭包
    - 定义： 
        闭包就是能访问到外部函数作用域中变量的函数
    - 使用场景：
        当我们需要隐藏一些不希望被别人访问的内容时就可以使用闭包
    - 构成闭包的要件：
        1. 函数的嵌套
        2. 内部函数要引用外部函数中的变量
        3. 内部函数要作为返回值返回
    - 生命周期：
        1. 闭包在外部函数调用时产生，外部函数每次调用都会产生一个全新的闭包
        2. 在内部函数丢失时销毁（内部函数被垃圾回收了，闭包才会消失）
    - 注意事项：
        相较于类来说，闭包比较浪费内存空间（类可以使用原型而闭包不能），
            需要执行次数较少时，使用闭包
            需要大量创建实例时，使用类
   ### 可变参数
    - 函数的隐含参数：
        - arguments 是函数中的一个隐含参数，本质时一个类数组对象（伪数组）
        - 伪数组：和数组结构相似，有一个length属性，可以通过索引读取元素，也可以通过for循环变量，但是它不是一个数组对象，不能调用数组的方法
        - arguments用来存储函数的实参，
            无论用户是否定义形参，实参都会存储到arguments对象中
            可以通过该对象直接访问实参
    - 可变参数：
        - 在定义函数时可以将参数指定为可变参数
        - 可变参数可以接受任意数量的实参，并将他们统一存储到一个数组中返回
        - 和arguments区别：
            1. 可变参数的名字可以自己指定
            2. 可变参数就是一个数组，可以直接使用数组的方法
            3. 可变参数可以配合其他参数一起使用
        function fn(...args)
        function fn2(a, b, ...args)
   ### this
    - 函数调用方式决定this的值
        1. 以函数形式调用，this是window
        2. 以方法形式调用，this是调用方法的对象
        3. 构造函数中，this是新建的对象
        4. 箭头函数没有自己的this，由外层作用域决定
        5. 通过call和apply调用的函数，它们的第一个参数就是函数的this
        6. 通过bind返回的函数，this由bind第一个参数决定（无法修改）
    - call()和apply()
        函数.call()
        函数.apply()
        - call 和 apply除了可以调用函数，还可以用来指定函数中的this
        - call和apply的第一个参数，将会成为函数的this
        - 通过call方法调用函数，函数的实参直接在第一个参数后一个一个的列出来
        - 通过apply方法调用函数，函数的实参需要通过一个数组传递
    - bind()
        bind() 是函数的方法，可以用来创建一个新的函数
            - bind可以为新函数绑定this
            - bind可以为新函数绑定参数
        箭头函数没有自身的this，它的this由外层作用域决定，
            也无法通过call apply 和 bind修改它的this 
            箭头函数中没有arguments


## DOM简介
    - 简介
        - D: document文档，即整个网页
        - O：object对象，所有元素都以对象呈现
        - M：model 模型，元素之间的关系：父子、兄弟、祖先...
    - document对象
        - 对象是原型链
            HTMLDocument -> Document -> Node -> EventTarget -> Object.protoType  -> null
        - 部分属性：
            document.docuemntElement   --> html根元素
            document.head        --> head元素
            document.title       --> title元素
            document.links       --> 页面中的所有超链接
            ...
    - element 元素节点
        - 通过document获取已有的元素节点
            document.getElementById()
                - 根据id获取一个元素节点对象
            document.getElementsByClassName()
                - 根据元素的class属性值获取一组元素节点对象
                - 返回的是一个类数组对象：  可以查长度，可以用下标访问元素，但不能调用其他数组方法
                - 该方法返回的结果是一个实时更新的集合
                    当网页中新添加元素时，集合也会实时的刷新
            document.getElementsByTagName()
                - 根据标签名获取一组元素节点对象
                - 该方法返回的结果是一个实时更新的集合
                - document.getElementsByTagName('*') 获取页面中的所有元素
            document.getElementsByName()
                - 根据name属性获取一组元素节点对象
                - 返回一个实时更新的集合
                - 主要用于表单项
            document.querySelectorAll()
                - 根据选择器去页面中查询元素
                - 会返回一个类数组（不会实时更新）
            document.querySelector()
                - 根据选择器去页面中查询第一个符合条件的元素

        - 创建一个元素节点
            document.createElement()
                - 根据标签名创建一个元素节点对象
        
        - div元素的原型链
                HTMLDivElement -> HTMLElement -> Element -> Node -> ...

            通过元素节点对象获取其他节点的方法
                element.childNodes 获取当前元素的子节点（会包含空白的子节点）
                element.children 获取当前元素的子元素
                element.firstElementChild 获取当前元素的第一个子元素
                element.lastElementChild 获取当前元素的最后一个子元素
                element.nextElementSibling 获取当前元素的下一个兄弟元素
                element.previousElementSibling 获取当前元素的前一个兄弟元素
                element.parentNode 获取当前元素的父节点
                element.tagName 获取当前元素的标签名

    - 文本节点
        在DOM中，网页中所有的文本内容都是文本节点对象,
            可以通过元素来获取其中的文本节点对象，但是我们通常不会这么做

            我们可以直接通过元素去修改其中的文本
            修改文本的三个属性
                element.textContent 获取或修改元素中的文本内容
                    - 获取的是标签中的内容，不会考虑css样式

                element.innerText 获取或修改元素中的文本内容
                    - innerText获取内容时，会考虑css样式
                    - 通过innerText去读取CSS样式，会触发网页的重排（计算CSS样式）
                    - 当字符串中有标签时，会自动对标签进行转义
                    - <li> --> &lt;li&gt;

                element.innerHTML 获取或修改元素中的html代码
                    - 可以直接向元素中添加html代码
                    - innerHTML插入内容时，有被xss注入的风险

    - 属性节点（Attr）
        - 在DOM也是一个对象，通常不需要获取对象而是直接通过元素即可完成对其的各种操作
        - 如何操作属性节点：
            方式一：
                读取：元素.属性名（注意，class属性需要使用className来读取）
                        读取一个布尔值时，会返回true或false

                修改：元素.属性名 = 属性值

            方式二：
                读取：元素.getAttribute(属性名)

                修改：元素.setAttribute(属性名, 属性值)

                删除：元素.removeAttribute(属性名)

    - 事件（event）
        - 事件就是用户和页面之间发生的交互行为
            比如：点击按钮、鼠标移动、双击按钮、敲击键盘、松开按键...  
        - 可以通过为事件绑定响应函数（回调函数），来完成和用户之间的交互
        - 绑定响应函数的方式：
            1.可以直接在元素的属性中设置
            2.可以通过为元素的指定属性设置回调函数的形式来绑定事件（一个事件只能绑定一个响应函数）
            3.可以通过元素addEventListener()方法来绑定事件
                例：
                    1.  <button id="btn" onmouseenter="alert('你点我干嘛~')">点我一下</button>
                    2.  const btn = document.getElementById("btn")          // 先获取到对象
                        btn.onclick = function(){                           // 为对象的事件属性设置响应函数
                            alert("我又被点了一下~~")
                        }
                    3.  btn.addEventListener("click", function(){
                            alert("哈哈哈")
                        })
        - 事件对象
            - 事件对象是有浏览器在事件触发时所创建的对象，这个对象中封装了事件相关的各种信息
            - 通过事件对象可以获取到事件的详细信息
                比如：鼠标的坐标、键盘的按键..
            - 浏览器在创建事件对象后，会将事件对象作为响应函数的参数传递，
                所以我们可以在事件的回调函数中定义一个形参来接收事件对象
            - 多种事件对象有一个共同的祖先 Event
                - event.target 触发事件的对象
                - event.currentTarget 绑定事件的对象（同this）
                - event.stopPropagation() 停止事件的传导
                - event.preventDefault() 取消默认行为
        - 事件的冒泡（bubble）
            - 事件的冒泡就是指事件的向上传导
            - 当元素上的某个事件被触发后，其祖先元素上的相同事件也会同时被触发
            - 冒泡的存在大大的简化了代码的编写，但是在一些场景下我们并不希望冒泡存在
                不希望事件冒泡时，可以通过事件对象来取消冒泡
        - 事件的委派
            - 只绑定一次事件，包括当前的和未来 都会有对象被触发
                可以将事件统一绑定给document, 无论触发document的哪个后代元素，由于事件的冒泡，都会导致document上的事件被触发
        - 事件的传播阶段
            - 1 捕获阶段（从外到内：document --> 目标元素）
            - 2 目标阶段（触发事件的对象）
            - 3 冒泡阶段（从内到外：目标元素 --> 祖先元素）
            如果希望在捕获阶段触发事件，可以将addEventListener()的第三个参数设为true
                box1.addEventListener("click", event=>{}, true)


    - 文档的加载（script标签的位置）
        网页是自上向下加载的，如果将js代码编写到网页的上边，
            js代码在执行时，网页还没有加载完毕，这时会出现无法获取到DOM对象的情况

            window.onload 事件会在窗口中的内容加载完毕之后才触发
            document的DOMContentLoaded事件会在当前文档加载完毕之后触发

            如何解决这个问题：
                1. 将script标签编写到body的最后（*****）
                2. 将代码编写到window.onload的回调函数中
                3. 将代码编写到document对象的DOMContentLoaded的回调函数中（执行时机更早）
                4. 将代码编写到外部的js文件中，然后以defer的形式进行引入（执行时机更早，早于DOMContentLoaded）（*****）

    - 修改元素样式
        除了直接修改样式外，也可以通过修改class属性来间接的修改样式
                通过class修改样式的好处：
                    1. 可以一次性修改多个样式
                    2. 对JS和CSS进行解耦

        元素.classList 是一个对象，对象中提供了对当前元素的类的各种操作方法
            元素.classList.add() 向元素中添加一个或多个class
            元素.classList.remove() 移除元素中的一个或多个class
            元素.classList.toggle() 切换元素中的class
            元素.classList.replace() 替换class
            元素.classList.contains() 检查class
        
## BOM简介
     - 浏览器对象模型
        - BOM为我们提供了一组对象，通过这组对象可以完成对浏览器的各种操作
        - BOM对象：
            - Window —— 代表浏览器窗口（全局对象）
            - Navigator —— 浏览器的对象（可以用来识别浏览器）
            - Location —— 浏览器的地址栏信息
            - History —— 浏览器的历史记录（控制浏览器前进后退）
            - Screen —— 屏幕的信息

        - BOM对象都是作为window对象的属性保存的，所以可以直接在JS中访问这些对象

        - Navigator
            - 浏览器的对象（用来识别浏览器）
                - userAgent返回一个用来描述浏览器信息的字符串
                            // 判断是否是Firefox浏览器
                    - 例： const sUserAgent = navigator.userAgent
                           if(sUserAgent.indexOf("Firefox")>-1){}
        - location
            - 浏览器地址栏的信息
                - location.assign() 跳转到一个新的地址
                - location.replace() 跳转到一个新的地址（无法通过回退按钮回退）
                - location.reload() 刷新页面，可以传递一个true来强制清缓存刷新
                - location.href 获取当前地址
        - history
            - 浏览器历史信息
                - history.back() 回退到上一级
                - history.forward() 前进
                - history.go(x) 向前跳转/向后回退



## 定时器
    - setTimeout()  在使代码在指定时间后执行
    - setInterval()  使代码每隔一段时间执行一次
        - 参数：1.回调函数  2.间隔的时间(ms)
            setTimeout(()=>{}, 2000)
            setInterval(()=>{}, 3000)
        - 返回值：一个唯一的ID值
        - 关闭定时器：clearTimeout(ID)
                     clearInterval(ID)

## 调用栈和宏任务队列和微任务队列
    - 调用栈：所有同步任务：按代码书写顺序执行（进一个执行一个）
    - 微任务队列：promise的.then和.catch回调函数 / async 内部的位于await之前的所有代码
            - 按照先进先出的原则依次调入调用栈中执行（按找队列中先进先出的顺序执行）
    - 宏任务队列：setTimeout() / setInterval() / ...
            - 所有微任务队列中的任务被执行完后开始按先进先出的顺序执行红任务队列中的任务


## setState()
   ### setState()更新状态是 同步 or 异步
    - 异步： react相关回调中--->  生命周期钩子函数 / react 事件监听回调
    - 同步： 其他异步回调中 --->  定时器回调 / 原生事件监听回调 / promise回调 
   ### 异步回调中
    - 1.一个回调中多次调用setState()更新状态：
        setState({}) --->  合并更新最后一次状态，调用一次render()更新界面
            (1)都用对象形式： 以最后一次的有效，前面的均被覆盖
        setState(()=>{}) ---> 更新多次状态，调用一次render()更新界面
            (1)都用该形式：  所有都被执行，状态被多次更新，且每次更新都取最新的状态值
            (2)函数---对象（结尾）： 对象形式会覆盖前方的所有
            (3)对象（最后一个生效）---函数： 最后一个对象和函数 生效

