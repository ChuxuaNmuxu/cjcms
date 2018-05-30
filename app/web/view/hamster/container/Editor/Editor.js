import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Button} from 'antd' 

import styles from './Editor.scss';
import Toolbar from './Toolbar';
import Propsbar from './Propsbar';
import Navbar from './Navbar';
import Viewport from './Viewport';
import Hamster, {HamsterContext} from '../../hamster';
import StoreProvider from '../../core/StoreProvider'

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
        return (
            <HamsterContext.Provider value={this.hamster}>
                <div className='editor' styleName='editor'>
                    <header className='header'>
                        <Toolbar />
                    </header>
                    <main>
                        <div className='sidebar right'>
                            <Propsbar />
                        </div>
                        <div className='sidebar left'>
                            <Navbar />
                        </div>
                        <Viewport />
                    </main>
                </div>
            </HamsterContext.Provider>
        )
    }
}

Editor.propTypes = {
    dispatch: PropTypes.func
}

const mapStateToProps = ({hamster}) => ({
    
});

export default StoreProvider(connect(mapStateToProps)(CSSModules(Editor, styles)));
