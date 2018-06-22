import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button, Menu} from 'antd';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { withHamster } from '../../../manager';
import Slide from './';
import { onContextMenu, hideContextMenu } from '../../../../../component/ContextMenu';
const SlideGroup = Slide.Group

@withHamster()
class SlidePane extends Component {
    handleAddSlide = () => {
        const {hamster} = this.props;
        hamster.slideManager.addSlide();
    }

    handleAddSlideGroup = () => {
        const {hamster} = this.props;
        hamster.slideManager.addSlideGroup();
    }

    handleContextMenu = (e, data, position = 'body') => {
        e.preventDefault();
        e.stopPropagation();
        const target = data ? data.get('type') : 'pane';
        const targetId = data && data.get('id');
        const payload = {target, targetId, position}
        onContextMenu(e, (
            <Menu theme='dark' onClick={e => this.handleContextMenuClick(e, payload)}>
                <Menu.Item key='addSlide'>添加卡片</Menu.Item>
                <Menu.Item key='addGroup'>添加小节</Menu.Item>
            </Menu>
        ));
    }

    /**
     * TODO:
     * position: before | after | first | last 四种情况
     */
    handleContextMenuClick = (e, payload) => {
        hideContextMenu();
        const {hamster} = this.props;
        const {target, position} = payload;
        switch (e.key) {
        case 'addSlide':
            hamster.slideManager.addSlide(null, {
                ...payload,
                position: target === 'slide' ? (position === 'header' ? 'before' : 'after') : (position === 'header' ? 'first' : 'last')
            });
            break;
        case 'addGroup':
            hamster.slideManager.addSlideGroup(null, {
                ...payload,
                position: target === 'pane' ? (position === 'body' ? 'last' : 'first') : (position === 'header' ? 'before' : 'after')
            });
            break;
        }
    }

    render() {
        const {slideGroups, entities, slides} = this.props;
        return (
            <div className='slide-pane' style={{position: 'absolute', top: 0, bottom: 0, width: '100%', overflow: 'hidden'}}>
                <div className='content' onContextMenu={this.handleContextMenu} style={{position: 'absolute', top: 0, bottom: 0, width: '100%', overflow: 'auto'}}>
                {
                    slideGroups.map(groupId => {
                        const groupData = entities.get(groupId);
                        const groupSlides = groupData.getIn(['data', 'slides'])
                        return <SlideGroup key={groupId} data={groupData} onContextMenu={this.handleContextMenu}>
                        {
                            slides.map((slideId, slideIndex) => {
                                if (groupSlides.includes(slideId)) {
                                    return <Slide
                                      key={slideId}
                                      index={slideIndex}
                                      data={entities.get(slideId)}
                                      onContextMenu={this.handleContextMenu}
                                    />
                                }
                            })
                        }
                        </SlideGroup>
                    })
                }
                </div>
                {/* <div style={{
                  padding: 12,
                  textAlign: 'center',
                  borderTop: '1px solid #efefef',
                  width: '100%',
                  position: 'absolute',
                  bottom: 0
                }}>
                    <Button size='small' onClick={this.handleAddSlide}>
                        添加卡片
                    </Button>
                    &nbsp;&nbsp;
                    <Button size='small' onClick={this.handleAddSlideGroup}>
                        添加小节
                    </Button>
                </div> */}
            </div>
        );
    }
}

SlidePane.propTypes = {
    slideGroups: ImmutablePropTypes.list,
    slides: ImmutablePropTypes.list,
    entities: ImmutablePropTypes.map
};

export default SlidePane;
