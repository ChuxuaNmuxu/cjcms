import React from 'react';
import {Map} from 'immutable';
import {flow, over, flatten} from 'lodash';

import { destruction, get, dispatchMission, prevCheck, identity, always, isValidateReactComponent, isMap, and } from '../../utils/miaow';
import configManager from '../../manager/ConfigManager';
import { defaultBlockConfig } from '../../config/config';

const prevParseConfig = blockType => {
    const blockConfig = configManager.getBlock(blockType);
    const contentConfig = blockConfig.get('content');
    const config = flow(
        dispatchMission(
            prevCheck(identity)(
                over([
                    flow(
                        get('container'),
                        dispatchMission(
                            prevCheck(isMap)(identity),
                            prevCheck(identity)(always(defaultBlockConfig.getIn(['content', 'container']))),
                            always(Map())
                        ),
                        destruction('draggable', 'rotatable', 'resizable')
                    ),
                    flow(
                        get('component'),
                        dispatchMission(
                            prevCheck(identity, isValidateReactComponent)(identity),
                            always(props => null)
                        ),
                        Component => props => <Component config={contentConfig}/>
                    )
                ])
            ),
            always([])
        ),
        flatten
    )(contentConfig)
    return config;
}

export default prevParseConfig;
