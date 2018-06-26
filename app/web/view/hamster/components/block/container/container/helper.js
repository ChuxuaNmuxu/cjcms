/**
 * container配置浅解析
 */
import {Map} from 'immutable'

import { defaultBlockConfig } from "../../../../config/config";
import {isTrue, dispatchMission, prevCheck, always, identity} from '../../../../utils/miaow'
const defaultContainerConfig = defaultBlockConfig.getIn(['content', 'container'])

const prevParseConfig = dispatchMission(
    prevCheck(isTrue)(always(defaultContainerConfig)),
    prevCheck(identity)(identity),
    always(Map()))

export default prevParseConfig;
