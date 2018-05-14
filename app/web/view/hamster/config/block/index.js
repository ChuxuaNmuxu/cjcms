import props from './props';
import propsbar from './propsbar';

/**
 * 默认block配置
 */
const block = {
    name: 'default', // 名称
    title: '默认', // 标题
    icon: 'iconfont icon-link', // 图标
    description: '这是默认元素', // 描述
    onClick: function (block, hamster) {
        console.log(9, '默认点击事件', block.toJS());
        hamster.addBlock(block);
    },
    /**
     * @config content 配置
     *  {ReactComponent}: block组件，默认带container
     *  {Object}: 配置对象
    */
    content: {
        container: true,
            /**
             * @config container 配置
             * {bool} 带所有功能的container | 关闭container
             * {object} {
                    editable: true, // 可编辑
                    rotatable: true, // 可旋转的
                    resizable: true, // 可变尺寸
                        @config resizable 配置
                        {bool} 开启 | 关闭
                        {array} [n, e, s, w, ne, nw, se, sw]
                    animationEnable: true, // 可以附加动画
                    questionEnable: true, // 可以转成习题
                    groupEnable: true, // 可以组合
                    contextMenu: {}, // 右键菜单
                }
            */
        component: null
    }, // 组件，必需
    toolbar: null, // 自定义工具栏
    propsbar, // 自定义属性栏
    props, // 属性，支持简单编排和自定义组件
}

export default block;
