// Observer 改写
// 工具函数
const is = {
    object: (target) => {
        return typeof target=='object' && typeof target!== 'null';
    }
}
function render() {
    console.log('update view');
}

function observer(target) {
    // 对象属性进行拦截
    if(!is.object(target)) {
        return;
    }
    return ob = new Observer(target)
}

class Observer {
    constructor(target) {
        for(let key in target) {
            defineReactive(target, key, target[key])
        }
    }
}
function defineReactive(target, key, value) {
    observer(value) // 递归进行观测深度观测， 对性能不太好 （1）
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if(newValue != value) {
                console.log('set新值',key, newValue)
                observer(newValue)
                value = newValue;
                render()
            }
        }
    })
}

const data = { name: {firstName: '张三'}, }
observer(data)
// data.name.firstName  = '李四'
data.name = {lastName: 'hehe'}
data.name.lastName = 'haha'