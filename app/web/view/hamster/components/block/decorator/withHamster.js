import React from 'react'
import {HamsterContext} from '../../../hamster';

const withHamster = () => Component => {
    return props => (
        <HamsterContext.Consumer>
            {
                hamster => <Component {...props} hamster={hamster} />
            }
        </HamsterContext.Consumer>
    )
}

export default withHamster;
