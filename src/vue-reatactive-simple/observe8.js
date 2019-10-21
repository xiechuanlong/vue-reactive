// 处理重复收集依赖的情况

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
let depUid = 0;
let watchUid = 0;
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
        this.id = ++depUid
        this.subs = []
    }
    depend() {
        // this.subs.push(Target)
        Target.addDep(this)
    }
    notify() {
        this.subs.forEach((watcher) => {
            watcher.update()
        })
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
}
class Watcher {
    constructor(fn, cb) {
        this.id = ++watchUid
        this.fn = fn;
        this.cb = cb;

        this.newDeps = [];
        this.newDepIds = new Set();

        this.deps = [];
        this.depIds = new Set();
        this.get()
    }
    get() {
        Target = this
        this.fn() // 求值
        Target = null
        this.cleanupDeps()
    }
    update() {
        this.cb()
    }
    addDep(dep) {
        let id = dep.id;
        if(!this.newDepIds.has(id)) {
            this.newDeps.push(dep);
            this.newDepIds.add(id)
            if (!this.depIds.has(id)) { // 这个是用来避免多次求值时依赖的重复搜集的
                dep.addSub(this)
              }
        }
    }
    cleanupDeps() {
        let i = this.deps.length
        while (i--) {
          const dep = this.deps[i]
          if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this)
          }
        }
        
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
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
    console.log('age render')
    data.age // 执行取值操作
    data.age
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
data.age = 19
