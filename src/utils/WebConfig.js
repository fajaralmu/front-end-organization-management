export const debugMode = () => {
    console.log("localStorage.getItem(\"debugMode\")",localStorage.getItem("debugMode"));
    return localStorage.getItem("debugMode") && localStorage.getItem("debugMode") == "true";
}