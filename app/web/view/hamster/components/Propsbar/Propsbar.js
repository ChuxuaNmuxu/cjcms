import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Tabs } from 'antd';
import {clone} from 'lodash'

import styles from './Propsbar.scss';
import configHelper from '../../config/configHelper';
import propsbarArrange from '../../config/block/propsbar'
import PropsPane from './PropsPane';
const TabPane = Tabs.TabPane;

let arrange = clone(propsbarArrange).reverse();
/**
 * 需要block数据
 * 需要block配置数据
 * 属性变化要经过验证
 * 可能选择多个block，甚至不同类型的block，这种情况要合并处理
 * TODO:
 * 1. 按编排配置渲染
 * 2. 处理多个合并的情况
 * @param {*} props
 */
class Propsbar extends React.Component {
    constructor (props) {
        super(props)

        this.getBlockProps(props);
    }
    
    componentWillReceiveProps(nextProps) {
        this.getBlockProps(nextProps);
    }
    
    getBlockProps (props) {
        const {data} = props;
        this.blockType = !!data.size && data.getIn([0, 'data', 'type']);
        if (this.blockType) {
            const block = configHelper.getBlock(this.blockType);
            this.blockProps = block.get('props');
            this.blockPropsLayout = block.get('propsbar').reverse();
        }
    }

    render () {
        const {data, onPropsChange} = this.props;
        const key = data.reduce((k, v) => k += v.get('id').substr(-3), '')
        return (
            <div className='propsbar' styleName='propsbar'>
                {data.size ?
                <Tabs
                  key={key}
                  defaultActiveKey={`.$${this.blockPropsLayout.getIn([0, 'name'])}`}
                  style={{height: '100%'}}>
                    {
                        this.blockPropsLayout.map(item => {
                            return <TabPane style={{padding: '0 15px'}} tab={item.get('title')} key={item.get('name')}>
                                <PropsPane
                                  blockProps={this.blockProps}
                                  propsLayout={item.get('layout')}
                                  value={data.getIn([0, 'data', 'props'])}
                                  onChange={v => onPropsChange(v, data.get(0))}
                                />
                            </TabPane>
                        })
                    }
                </Tabs> : null}
            </div>
        )
    }
    // render () {
    //     const {data, onPropsChange} = this.props;
    //     if (!data.size) {
    //         return <div />
    //     }
    //     const dataPropsConfig = data.map(item => configHelper.getBlock(item.get('type')).get('props'))
    //     let mergedPropsConfig = dataPropsConfig;
    //     if (data.size === 1) {
    //         mergedPropsConfig = dataPropsConfig.get(0);
    //     } else {
    //         // 需要合并处理多个block情况
    //     }
    //     const mergedProps = data.getIn([0, 'props']);
    //     return (
    //         <div className='propsbar' styleName='propsbar'>
    //             <h3>属性栏</h3>
    //             {
    //                 mergedPropsConfig.map((prop, key) =>
    //                     <div key={key}>
    //                         {prop.get('title')}：
    //                         {
    //                             prop.has('props') ? '这是嵌套的' : <input
    //                             name={key}
    //                             value={mergedProps.get(key)}
    //                             onChange={e => onPropsChange(key, e.target.value, data.get(0))}
    //                             />
    //                         }
    //                     </div>
    //                 ).toList()
    //             }
    //         </div>
    //     )
    // }
}

Propsbar.propTypes = {
    data: PropTypes.any,
    onPropsChange: PropTypes.func.isRequired
}

export default CSSModules(Propsbar, styles);
