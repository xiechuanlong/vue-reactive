// 依赖收集
// 对象依赖收集， Dep

// 工具函数
const is = {
    object: (target) => {
        return typeof target=='object' && typeof target!== 'null';
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

function observer(target) {
    // 对象属性进行拦截
    if(!is.object(target)) {
        return;
    }
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

let Target = null;
function defineReactive(target, key, value) {
    let dep = new Dep()
    observer(value) // 递归进行深度观测 （内层对象改了也应该触发外层对象的依赖）
    Object.defineProperty(target, key, {
        get() {
            // 搜集依赖
            if(Target) {
                dep.depend()
            }
            return value
        },
        set(newValue) {
            if(newValue != value) {
                observer(newValue)
                value = newValue;
                // 触发依赖
                dep.notify()
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
const data = { name:'张三', age: 11 }
observer(data)
// data = {
//     name: '张三',
//     age: 11,
//     __ob__: Observer
// }
render()
data.name  = '李四'



// 问题： 对象添加属性和删除属性时怎么去触发依赖
// const data = { name: {firstName: '张', lastName:'四'}, age: 11  }
// observer(data)
// render()
// data.name = 'change'
