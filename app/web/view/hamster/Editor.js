import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';

import styles from './Editor.scss';
import Toolbar from './components/Toolbar';
import Propsbar from './components/Propsbar';
import Navbar from './components/Navbar';
import Viewport from './components/Viewport';
import {HAMSTER} from '../../actions/actionTypes';
import Hamster, {HamsterContext} from './hamster';
import {Button} from 'antd'

class Editor extends React.Component {
    state = {}

    constructor (props) {
        super(props);

        this.hamster = new Hamster(props.dispatch);
        this.handlePropsChange = this.handlePropsChange.bind(this);
    }

    handlePropsChange (value, block) {
        const {dispatch} = this.props;
        dispatch({type: HAMSTER.BLOCK_PROPS_CHANGE, payload: {block, props: value}});
    }

    render () {
        const {current, blockIds, blockObjects} = this.props;
        const currentBlockIds = current.get('blocks')
        const currentBlocks = blockObjects.filter(block => currentBlockIds.includes(block.get('id'))).toList();

        return (
            <HamsterContext.Provider value={this.hamster}>
                <div className='editor' styleName='editor'>
                    <header className='header'>
                        <Toolbar />
                    </header>
                    <main>
                        <Propsbar onPropsChange={this.handlePropsChange} data={currentBlocks} />
                        <Navbar />
                        <Viewport blockIds={blockIds}/>
                        <Button />
                    </main>
                </div>
            </HamsterContext.Provider>
        )
    }
}

Editor.propTypes = {
    dispatch: PropTypes.func,
    blocks: PropTypes.any,
    current: PropTypes.any
}

const mapStateToProps = ({hamster}) => ({
    blockIds: hamster.getIn(['index', 'blocks']),
    blockObjects: hamster.get('objects'),
    current: hamster.get('current'),
});

export default connect(mapStateToProps)(CSSModules(Editor, styles));
