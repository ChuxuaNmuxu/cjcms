import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import entityActions from '../../actions/entity'
import Propsbar from '../../components/Propsbar';
import configManager from '../../manager/ConfigManager';

/**
 * 可能选择多个实体，甚至不同类型的实体，这种情况要合并处理
 * TODO:
 * block、slide
 */
class PropsbarView extends Component {
    constructor (props) {
        super(props)

        this.getProps(props);
    }

    getProps (props) {
        const {entitiesType, entities} = props;
        if (entities.size) {
            entitiesType === 'block' ? this.getBlockProps(entities) : this.getSlideProps(entities);
        }
    }

    getBlockProps (data) {
        const {props, layout} = configManager.getBlocksLayout(data)
        this.propsConfig = props;
        this.propsLayout = layout.reverse();
    }

    getSlideProps (data) {
        const {props, layout} = configManager.getSlidesPropsbar(data)
        this.propsConfig = props;
        this.propsLayout = layout.reverse();
    }

    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }

    handlePropsChange = (value) => {
        const {dispatch, entityIds} = this.props;
        dispatch(entityActions.propsChange({entityIds, props: value}))
    }

    render() {
        const {entities} = this.props;
        const data = entities.last().getIn(['data', 'props']);
        const key = entities.reduce((k, v) => k += v.get('id').substr(-3), '');
        return (
            <Propsbar
              onPropsChange={this.handlePropsChange}
              data={data}
              k={key}
              propsLayout={this.propsLayout}
              propsConfig={this.propsConfig}
            />
        );
    }
}

PropsbarView.propTypes = {
    entitiesType: PropTypes.oneOf(['block', 'slide']),
    entities: PropTypes.any,
    entityIds: PropTypes.any
}

function mapStateToProps({hamster}) {
    const entities = hamster.get('entities')
    const currentBlockIds = hamster.getIn(['current', 'blocks'])
    const hasBlocks = !!currentBlockIds.size;
    const currentEntitiesType = hasBlocks ? 'block' : 'slide';
    const currentEntityIds = hasBlocks ? currentBlockIds : hamster.getIn(['current', 'slides'])
    const currentEntities = currentEntityIds.map(id => entities.get(id))
    return {
        entitiesType: currentEntitiesType,
        entities: currentEntities,
        entityIds: currentEntityIds,
    };
}

export default connect(
    mapStateToProps,
)(PropsbarView);