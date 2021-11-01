"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FunctionChainSpecification_1 = require("./type/FunctionChainSpecification");
function converterCodeWriter(rule, converterName) {
    var mapTerm = rule.from === "" ? ".map()" : ".map(\"" + rule.from + "\")";
    var toTerm = rule.to === "" ? "" : ".to(\"" + rule.to + "\")";
    var postActionTerm = "";
    if (rule.postAction === undefined || rule.postAction === null) {
        //Do noting.
        //this if condition is for type guard.
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.removing) {
        var arrayString = "";
        if (rule.postActionParameters !== null && rule.postActionParameters !== undefined) {
            arrayString = "[" + rule.postActionParameters.map(function (v) { return "\"" + v + "\""; }).reduce(function (acc, v) { return acc + ", " + v; }) + "]";
        }
        postActionTerm = ".removing(" + arrayString + ")";
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.keep) {
        var arrayString = "";
        if (rule.postActionParameters !== null && rule.postActionParameters !== undefined) {
            arrayString = "[" + rule.postActionParameters.map(function (v) { return "\"" + v + "\""; }).reduce(function (acc, v) { return acc + ", " + v; }) + "]";
        }
        postActionTerm = ".keep(" + arrayString + ")";
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.acceptIf) {
        if (rule.postActionParameters === null || rule.postActionParameters === undefined) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"acceptIf\" requires 2 parameters but it isn't defined. The \"postActionParameters\" property is " + rule.postActionParameters;
            throw new SyntaxError(msg);
        }
        else if (rule.postActionParameters.length !== 2) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"acceptIf\" requires 2 parameters but the \"postActionParameters\" property has " + rule.postActionParameters.length + " parameter(s).";
            throw new SyntaxError(msg);
        }
        postActionTerm = ".acceptIf(\"" + rule.postActionParameters[0] + "\", \"" + rule.postActionParameters[1] + "\")";
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.rejectIf) {
        if (rule.postActionParameters === null || rule.postActionParameters === undefined) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"rejectIf\" requires 2 parameters but it isn't defined. The \"postActionParameters\" property is " + rule.postActionParameters;
            throw new SyntaxError(msg);
        }
        else if (rule.postActionParameters.length !== 2) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"rejectIf\" requires 2 parameters but the \"postActionParameters\" property has " + rule.postActionParameters.length + " parameter(s).";
            throw new SyntaxError(msg);
        }
        postActionTerm = ".rejectIf(\"" + rule.postActionParameters[0] + "\", \"" + rule.postActionParameters[1] + "\")";
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.first) {
        if (rule.postActionParameters !== null && rule.postActionParameters !== undefined && rule.postActionParameters.length > 0) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"first\" requires no parameter but the \"postActionParameters\" property has " + rule.postActionParameters.length + " parameter(s).";
            throw new SyntaxError(msg);
        }
        postActionTerm = ".first()";
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.last) {
        if (rule.postActionParameters !== null && rule.postActionParameters !== undefined && rule.postActionParameters.length > 0) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"last\" requires no parameter but the \"postActionParameters\" property has " + rule.postActionParameters.length + " parameter(s).";
            throw new SyntaxError(msg);
        }
        postActionTerm = ".last()";
    }
    else if (rule.postAction === FunctionChainSpecification_1.PostAction.compact) {
        if (rule.postActionParameters !== null && rule.postActionParameters !== undefined && rule.postActionParameters.length > 0) {
            var msg = "An incorrectly defined converter rule was found.\n            The post action \"compat\" requires no parameter but the \"postActionParameters\" property has " + rule.postActionParameters.length + " parameter(s).";
            throw new SyntaxError(msg);
        }
        postActionTerm = ".compact()";
    }
    return converterName + mapTerm + postActionTerm + toTerm + ";";
}
exports.default = converterCodeWriter;
//# sourceMappingURL=converterCodeWriter.js.map