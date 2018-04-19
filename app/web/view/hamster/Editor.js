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

class Editor extends React.Component {
    state = {}

    constructor (props) {
        super(props);

        this.hamster = new Hamster(props.dispatch);
        this.handlePropChange = this.handlePropChange.bind(this);
    }

    handlePropChange (name, value, block) {
        const {dispatch} = this.props;
        dispatch({type: HAMSTER.BLOCK_PROPS_CHANGE, payload: {block, props: {[name]: value}}});
    }

    render () {
        const {blockIds, blockObjects} = this.props;
        const currentBlocks = blockObjects.filter(block => blockIds .includes(block.get('id'))).toList();

        return (
            <HamsterContext.Provider value={this.hamster}>
                <div className='editor' styleName='editor'>
                    <header>
                        <Toolbar />
                    </header>
                    <main>
                        <Propsbar onPropChange={this.handlePropChange} data={currentBlocks} />
                        <Navbar />
                        <Viewport blockIds={blockIds}/>
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
    blockObjects: hamster.get('objects')
});

export default connect(mapStateToProps)(CSSModules(Editor, styles));
