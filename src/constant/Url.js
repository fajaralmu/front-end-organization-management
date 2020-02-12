import * as config from '../utils/WebConfig'

export const hostLocal ="http://localhost:8080";
export const hostCloud = "";
export const baseImageUrl = config.debugMode()==true?hostLocal:hostCloud;
 