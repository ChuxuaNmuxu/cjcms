import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Tabs} from 'antd';
import CSSModules from 'react-css-modules';
import ImmutablePropTypes from 'react-immutable-proptypes';

import styles from './Navbar.scss';
import { withHamster } from '../../manager';
import SlidePane from './slide/Pane';
import { relative } from 'path';

const TabPane = Tabs.TabPane;

@withHamster()
@CSSModules(styles)
class Navbar extends Component {
    handleUnite = () => {
        const {hamster} = this.props;
        hamster.blockManager.groupUnite()
    }

    handleAddSlide = () => {
        const {hamster} = this.props;
        hamster.slideManager.addSlide();
    }

    render() {
        const {slideGroups, slides, entities} = this.props;
        return (
            <div className='navbar' styleName='navbar'>
                {/* <div>
                    我是导航栏
                    <Button onClick={this.handleUnite}>
                        合并元素
                    </Button>
                </div>
                <div style={{position: 'absolute', top: 40, bottom: 0, width: '100%'}}>
                    <SlidePane {...{slideGroups, slides, entities}} />
                </div> */}

                <Tabs defaultActiveKey='.$1'>
                    <TabPane tab='Tab 1' key='1'>
                        <SlidePane {...{slideGroups, slides, entities}} />
                    </TabPane>
                    <TabPane tab='Tab 2' key='2'>Content of Tab Pane 2</TabPane>
                    <TabPane tab='Tab 3' key='3'>Content of Tab Pane 3</TabPane>
                </Tabs>
            </div>
        );
    }
}

Navbar.propTypes = {
    slideGroups: ImmutablePropTypes.list,
    slides: ImmutablePropTypes.list,
    entities: ImmutablePropTypes.map
};

export default Navbar;
