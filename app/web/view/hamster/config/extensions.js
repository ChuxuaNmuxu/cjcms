import {fromJS} from 'immutable';

import * as BlockText from '../extensions/Blocks/BlockText'
import * as BlockShape from '../extensions/Blocks/BlockShape'
import * as BlockImage from '../extensions/Blocks/BlockImage'
import * as BlockLine from '../extensions/Blocks/BlockLine'
import * as BlockAudio from '../extensions/Blocks/BlockAudio'

export const blocks = fromJS([
    BlockText.manifest,
    BlockShape.manifest,
    BlockImage.manifest,
    BlockLine.manifest,
    BlockAudio.manifest
]);
