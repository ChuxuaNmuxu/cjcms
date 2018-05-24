import invariant from 'invariant'
import React from 'react'
import path from 'path'
import CSSModules from 'react-css-modules';
import objectUnfreeze from 'object-unfreeze';

/**
 * @deprecated
 * @param {*} styles 
 */
const withCSSModules = styles => {

    return Component => {
    
        @CSSModules(styles)
        class DecoratedComponent extends Component {
            render () {
                let elementTree = super.render();
    
                elementTree = objectUnfreeze(elementTree);
                elementTree.props = objectUnfreeze(elementTree.props);
    
                const styleName = Object.keys(styles)[0]
                elementTree.props.styleName = styleName;
    
                Object.preventExtensions(elementTree.props);
                return elementTree
            }
        }

        // return hoistStatics(DecoratedComponent, Component);
        return DecoratedComponent;
    }
}

export default withCSSModules
