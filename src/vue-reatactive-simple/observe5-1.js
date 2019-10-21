// 依赖收集, Observer稍微改写
// 对象依赖收集， Dep

// 对象依赖收集完善（重复观测， 添加对象属性和删除对象属性时如何去触发依赖）

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
            watcher()
        })
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
    Target = render;
    console.log('update view')
    data.name // 执行取值操作
    Target = null
}
function set(data, key, value) {
    if(!data[key]) {
        data.__ob__.dep.notify()
        data[key] = value
    }
}
const data = { age: 18, name: {firstName: '张', lastNaem: '三'} }
observer(data)
render()
set(data.name, 'age', 11)

