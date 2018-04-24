import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Demo extends Component {
    render() {
        const {block} = this.props;
        return (
            <div>
                <h4>{block.getIn(['data', 'type'])}</h4>
                <hr />
                {
                    block.getIn(['data', 'props']).map((v, k) => <p key={k}>{`${k}：${v}`}</p>).toList()
                }
            </div>
        )
    }
}

Demo.propTypes = {
    block: PropTypes.object
};

export default Demo;
