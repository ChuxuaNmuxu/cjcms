import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CSSModules from 'react-css-modules';

import styles from './styles.scss'
import { withHamster } from '../../../manager';
import Slide from './';
import { onContextMenu } from '../../../../../component/ContextMenu';
import createContextMenu from './Menu'
const SlideGroup = Slide.Group

@withHamster()
@CSSModules(styles)
class SlidePane extends Component {
    handleContextMenu = (e, data, position = 'body') => {
        e.preventDefault();
        e.stopPropagation();
        const {hamster} = this.props;
        const payload = {
            target: data ? data.get('type') : 'pane',
            targetId: data && data.get('id'),
            position
        }
        onContextMenu(e, createContextMenu(hamster, payload));
    }

    render() {
        const {slideGroups, entities, slides} = this.props;
        return (
            <div className='slide-pane' styleName='slide-pane'>
                <div className='pane-content' onContextMenu={this.handleContextMenu}>
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
