import * as config from '../utils/WebConfig'
 
export const hostLocal ="http://localhost:8080".concat(document.getElementById("rootPath").value);
export const hostCloud = (document.getElementById("rootPath").value);
export const baseImageUrl = config.debugMode()==true?hostLocal:hostCloud;
 