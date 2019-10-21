// 依赖收集
// 转变为Watcher类

// 工具函数
const is = {
    object: (target) => {
        return typeof target=='object' && typeof target!== 'null';
    },
    observer: (target) => {
        return target instanceof Observer
    }
}

function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
  }

let Target = null 

function observer(target) {
    // 对象属性进行拦截
    if(!is.object(target)) {
        return;
    };
    let ob;
    if(target.__ob__) {
        ob = target.__ob__;
    } else {
        ob = new Observer(target);
    }
    return ob;
}

class Observer {
    constructor(target) {
        def(target, '__ob__', this) // 定义不可枚举的__ob__属性, 防止被观测
        this.dep = new Dep();
        this.value = target;
        if(Array.isArray(target)) {
            target.__proto__ = proto
            target.forEach((val) => {
                observer(val)
            })
        }
        for(let key in target) {
            defineReactive(target, key, target[key])
        }
    }
}

class Dep {
    constructor() {
        this.subs = []
    }
    depend() {
        this.subs.push(Target)
    }
    notify() {
        this.subs.forEach((watcher) => {
            watcher.update()
        })
    }
}

class Watcher {
    constructor(fn, cb) {
        this.fn = fn;
        this.cb = cb;
        this.get()
    }
    get() {
        Target = this
        this.fn() // 求值
        Target = null
    }
    update() {
        this.cb()
    }
}

function defineReactive(target, key, value) {
    let dep = new Dep()
   let childOb = observer(value) // 递归进行深度观测 （内层对象改了也应该触发外层对象的依赖）
   Object.defineProperty(target, key, {
        get() {
            // 搜集依赖
            if(Target) {
                dep.depend()
                if(childOb) {
                    childOb.dep.depend()
                }
            }
            return value
        },
        set(newValue) {
            if(newValue != value) {
                observer(newValue)
                value = newValue;
                // 触发依赖
                dep.notify()
                // render()
            }
        }
    })
}

function render() {
    console.log('update view')
    data.name // 执行取值操作
}

function set(data, key, value) {
    if(!data[key]) {
        data.__ob__.dep.notify()
        data[key] = value
    }
}
const data = { age: 18, name: {firstName: '张', lastNaem: '三'} }
observer(data)
new Watcher(render, render)
set(data.name, 'age', 11)

// 同一次render中， 重复收集依赖的情况
