import {fromJS} from 'immutable';

import * as BlockTest from '../extensions/Blocks/BlockTest'
import * as BlockTest2 from '../extensions/Blocks/BlockTest2'
import * as BlockTest3 from '../extensions/Blocks/BlockTest3'
import * as BlockTest4 from '../extensions/Blocks/BlockTest4'
import * as BlockTest5 from '../extensions/Blocks/BlockTest5'
import * as BlockDemo from '../extensions/Blocks/BlockDemo'
import * as BlockText from '../extensions/Blocks/BlockText'
import * as BlockShape from '../extensions/Blocks/BlockShape'
import * as BlockImage from '../extensions/Blocks/BlockImage'
import * as BlockLine from '../extensions/Blocks/BlockLine'
import * as BlockAudio from '../extensions/Blocks/BlockAudio'

export const blocks = fromJS([
    BlockTest.manifest,
    BlockTest2.manifest,
    BlockTest3.manifest,
    BlockTest4.manifest,
    BlockTest5.manifest,
    BlockDemo.manifest,
    BlockText.manifest,
    BlockShape.manifest,
    BlockImage.manifest,
    BlockLine.manifest,
    BlockAudio.manifest
]);
