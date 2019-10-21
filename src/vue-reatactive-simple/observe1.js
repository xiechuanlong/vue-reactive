function render() {
    console.log('update view');
}

function observer(target) {
    // 对象属性进行拦截
}

const data = { name: '张三'}

observer(data)

data.name = '李四'