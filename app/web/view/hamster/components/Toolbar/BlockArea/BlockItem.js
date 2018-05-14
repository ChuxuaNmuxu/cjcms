import React from 'react'
import PropTypes from 'prop-types';

/**
 * Toolbar Block项
 */
class BlockItem extends React.Component {
    renderBtn = () => {
        let {block, btn: Btn, onBtnClick} = this.props;
        Btn = Btn || <div onClick={onBtnClick}>
            <i className={block.get('icon')} /><br />
            <span>{block.get('title')}</span>
        </div>
        return Btn;
    }

    render () {
        const {children} = this.props;
        return (<div className='block-item'>
            {this.renderBtn()}
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>)
    }
}

BlockItem.propTypes = {
    block: PropTypes.any,
    btn: PropTypes.element,
    onBtnClick: PropTypes.func,
}

export default BlockItem;
