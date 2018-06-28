import { getBlockType } from "./block";
import ConfigManager from "../manager/ConfigManager";

export const getBlockConfigByData = block => {
    const type = getBlockType(block);
    return ConfigManager.getBlock(type);
}
