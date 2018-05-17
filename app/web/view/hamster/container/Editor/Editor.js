import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Button} from 'antd' 

import styles from './Editor.scss';
import Toolbar from '../../components/Toolbar';
import Propsbar from './Propsbar';
import Navbar from '../../components/Navbar';
import Viewport from '../../components/Viewport';
import Hamster, {HamsterContext} from '../../hamster';
import createProvider from '../../Utils/tmp'

class Editor extends React.Component {
    static contextTypes = {
        store: PropTypes.object
    };

    state = {}

    constructor (props, context) {
        super(props, context);

        this.hamster = new Hamster(context.store);
        // if (this.context.store) this.hamster.setDragDropManager(this.context.store);
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
                        <Propsbar />
                        <Navbar />
                        <Viewport blockIds={blockIds} />
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

export default createProvider(connect(mapStateToProps)(CSSModules(Editor, styles)));
