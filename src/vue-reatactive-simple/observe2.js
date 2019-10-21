
// 初步响应式实现
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
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if(newValue != value) {
                console.log('set新值', key, newValue)
                value = newValue;
                // 更新view render()
                render()
            }
        }
    })
}

const data = { name: '张三'}
observer(data)
data.name  = '李四'

// 问题
// 1. 深层对象观测
// const data = { name: {firstName: '张三', lastName: '李四'}, }
// observer(data)
// data.name.firstName  = '王五'

// 2. 赋值一个新对象， 新对象也为进行观察
// const data = { name: {firstName: '张三', lastName: '李四'}, }
// observer(data)
// data.name  =  {newName: '王五'}
// data.name.newName = 'r'

// 3. 新增一个不存在的属性， 属性不是响应式的
// const data = { name: {firstName: '张三', lastName: '李四'}, }
// observer(data)
// data.age = 12
