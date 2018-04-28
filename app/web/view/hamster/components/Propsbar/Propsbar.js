import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { Tabs } from 'antd';
import {clone, isArray} from 'lodash'
import {List} from 'immutable'

import styles from './Propsbar.scss';
import PropsPane from './PropsPane';
const TabPane = Tabs.TabPane;

/**
 * 属性栏，不区分元素类型，通用
 * 需要属性数据
 * 需要属性配置
 * 需要属性编排配置
 * 属性变化要经过验证
 * @param {*} props
 */
class Propsbar extends React.Component {
    renderPropsPane = (item) => {
        const {data, propsConfig, onPropsChange} = this.props;
        const Layout = item.get('layout');
        const props = {
            propsConfig,
            propsLayout: Layout,
            value: data.getIn([0, 'data', 'props']),
            onChange: v => onPropsChange(v)
        }
        return List.isList(Layout) ? <PropsPane {...props} /> : <Layout {...props} />
    }

    render () {
        const {data, propsLayout} = this.props;
        const key = data.reduce((k, v) => k += v.get('id').substr(-3), '')
        return (
            <div className='propsbar' styleName='propsbar'>
                {data.size ?
                <Tabs
                  key={key}
                  defaultActiveKey={`.$${propsLayout.getIn([0, 'name'])}`}
                  style={{height: '100%'}}>
                    {propsLayout.map(item => (
                        <TabPane
                            style={{padding: '0 15px'}}
                            tab={item.get('title')}
                            key={item.get('name')}>
                            { this.renderPropsPane(item) }
                        </TabPane>
                    ))}
                </Tabs> : null}
            </div>
        )
    }
}

Propsbar.propTypes = {
    data: PropTypes.any,
    propsLayout: PropTypes.any,
    propsConfig: PropTypes.any,
    onPropsChange: PropTypes.func.isRequired,
}

export default CSSModules(Propsbar, styles);
