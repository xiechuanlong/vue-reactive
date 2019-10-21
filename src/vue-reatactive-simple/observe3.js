
// 初步响应式实现完善
// 数据是对象
// 1. 深层对象观测
// 2. 赋值一个新对象
// 3. 新增一个不存在的属性， 属性不是响应式的

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
    for(let key in target) {
        defineReactive(target, key, target[key])
    }
}

function defineReactive(target, key, value) {
    observer(value) // 递归进行观测， 对性能不太好
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

// 1. 深层对象观测
// const data = { name: {firstName: '张三', lastName: '李四'}, }
// observer(data)
// data.name.firstName  = '王五'

// 2. 赋值一个新对象
// const data = { name: {firstName: '张三', lastName: '李四'}, }
// observer(data)
// data.name  =  {newName: '王五'}
// data.name.newName = 'r'

// 问题 observe重复观察
// observer(data)
// observer(data)