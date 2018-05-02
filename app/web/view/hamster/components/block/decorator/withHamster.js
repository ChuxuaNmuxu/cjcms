import React from 'react'
import {HamsterContext} from '../../../hamster';

const withHamster = Component => {
    return props => (
        <HamsterContext.Consumer>
            {
                Hamster => <Component {...props} Hamster={Hamster} />
            }
        </HamsterContext.Consumer>
    )
}

export default withHamster;
