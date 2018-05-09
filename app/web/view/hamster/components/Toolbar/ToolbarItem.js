import React from 'react'
import PropTypes from 'prop-types';

class ToolbarItem extends React.Component {
    renderBtn = () => {
        let {block, btn: Btn, onBtnClick} = this.props;
        Btn = Btn || <div onClick={onBtnClick}>
            <i className={block.get('icon')} /><br />
            {block.get('title')}
        </div>
        return Btn;
    }

    render () {
        const {children} = this.props;
        return (<div>
            {this.renderBtn()}
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>)
    }
}

ToolbarItem.propTypes = {
    block: PropTypes.any,
    btn: PropTypes.element,
    onBtnClick: PropTypes.func,
}

export default ToolbarItem;
