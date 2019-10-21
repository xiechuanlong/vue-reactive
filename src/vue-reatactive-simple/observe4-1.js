// data避免重复观察
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

function render() {
    console.log('update view');
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
function defineReactive(target, key, value) {
    observer(value) // 递归进行观测深度观测， 对性能不太好 （1）
    Object.defineProperty(target, key, {
        get() {
            // 
            return value
        },
        set(newValue) {
            if(newValue != value) {
                console.log('set新值',key, newValue)
                observer(newValue)
                value = newValue;
                render() //
            }
        }
    })
}

const data = { name: {firstName: '张三'}, }
observer(data)
// {
//     name: {
//             firstName: '张三', 
//             __ob__: Observer
//         }
//     __ob__: Observer
// }
