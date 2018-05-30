import React, { Component } from 'react';
import {connect} from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes';

import Navbar from '../../components/Navbar';

class NavbarView extends Component {
    render () {
        return (
            <Navbar {...this.props} />
        );
    }
}

NavbarView.propTypes = {
    slideGroups: ImmutablePropTypes.list,
    slides: ImmutablePropTypes.list,
    entities: ImmutablePropTypes.map
};

const mapStateToProps = ({hamster}) => ({
    slideGroups: hamster.getIn(['index', 'slide.groups']),
    slides: hamster.getIn(['index', 'slides']),
    entities: hamster.get('entities')
});

export default connect(mapStateToProps)(NavbarView);
