import * as config from '../utils/WebConfig'
 
const rootValue = document.getElementById("rootPath").value == "${basePath}" ?
     "/organization-management" : document.getElementById("rootPath").value;

export const hostLocal ="http://localhost:8080".concat(rootValue);
export const hostCloud = (rootValue);
export const baseImageUrl = config.debugMode()==true?hostLocal:hostCloud;
 