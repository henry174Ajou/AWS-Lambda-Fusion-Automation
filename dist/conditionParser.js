"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function conditionParser(conditionString, rootVariableName) {
    if (rootVariableName === "") {
        throw new Error("[internal error] the root variable name for condition string parser is empty string\n         It is not your fault. This is a bug of this program. If you see this message, please let the developer know about this bug by reporting this error stack.");
    }
    var originalConditionString = conditionString;
    while (true) { //repeat until all $$ terms are replaced.
        var parsingIsOnFlag = false;
        var tokenStartPoint = 0;
        var tokenLength = 0;
        var replaceString = "";
        for (var p = 0; p < conditionString.length; p++) {
            if (conditionString[p] === "$" && parsingIsOnFlag === false) {
                parsingIsOnFlag = true;
                tokenStartPoint = p;
            }
            else if (conditionString[p] === "$" && parsingIsOnFlag === true) {
                parsingIsOnFlag = false;
                tokenLength = p - tokenStartPoint + 1;
                var propertyChain = conditionString.substr(tokenStartPoint + 1, tokenLength - 2);
                if (propertyChain === "") {
                    replaceString = rootVariableName;
                }
                else {
                    replaceString = "mapFactoryGetValue(" + rootVariableName + ", \"" + propertyChain + "\")";
                }
                break;
            }
        }
        if (parsingIsOnFlag) {
            throw new SyntaxError("condition string parsing error\n            There is a letter $ which does not have its pair.\n            " + originalConditionString);
        }
        if (replaceString === "") {
            break;
        }
        conditionString = replaceRange(conditionString, tokenStartPoint, tokenLength + tokenStartPoint, replaceString);
    }
    return conditionString;
}
exports.default = conditionParser;
function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
}
//# sourceMappingURL=conditionParser.js.map