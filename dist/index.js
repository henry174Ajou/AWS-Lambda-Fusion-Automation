"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs = __importStar(require("fs"));
var moment_1 = __importDefault(require("moment"));
var converterCodeWriter_1 = __importDefault(require("./converterCodeWriter"));
var conditionParser_1 = __importDefault(require("./conditionParser"));
var yaml_1 = __importDefault(require("yaml"));
var log = require("log-beautify");
var copydir = require('copy-dir');
var prompt = require('prompt-promise');
log.useSymbols = true;
log.useLabels = true;
var workingDirectory = process.cwd();
var functionSpecificationFilePath = "";
var sourceFunctionRootDirectoryPath = "";
var pipelineDataInspectMode = false;
var lastErrorObjectId = 0;
main().then(function (code) { process.exit(code); }).catch(function (error) {
    console.error(error);
    process.exit(500);
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, startTime, lastFinishedStep, functionChainSpecification, sourceCodeDictionary, fusionFunctionSourceCode, endTime;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log("working directory: " + workingDirectory);
                    _b = (_a = path_1.default).join;
                    _c = [workingDirectory];
                    return [4 /*yield*/, prompt("function specification file path: ")];
                case 1:
                    functionSpecificationFilePath = _b.apply(_a, _c.concat([_g.sent()]));
                    _e = (_d = path_1.default).join;
                    _f = [workingDirectory];
                    return [4 /*yield*/, prompt("the path of a directory that contains source functions: ")];
                case 2:
                    sourceFunctionRootDirectoryPath = _e.apply(_d, _f.concat([_g.sent()]));
                    return [4 /*yield*/, prompt("inspect on? (y/n): ")];
                case 3:
                    pipelineDataInspectMode = (_g.sent()) === "y";
                    startTime = (0, moment_1.default)();
                    log.info("process started at " + startTime.format());
                    lastFinishedStep = 0;
                    try {
                        functionChainSpecification = loadFunctionChainSpecification();
                        lastFinishedStep++;
                        log.success("[1/4] The function chain specification is parsed.");
                        sourceCodeDictionary = loadFunctionSourceCodes(functionChainSpecification.functionInfo);
                        lastFinishedStep++;
                        log.success("[2/4] Function source codes to fuse are loaded.");
                        fusionFunctionSourceCode = writeFusionFunctionBodyCode(functionChainSpecification);
                        lastFinishedStep++;
                        log.success("[3/4] The fusion function is generated.");
                        writeResult(fusionFunctionSourceCode, functionChainSpecification.functionInfo, sourceCodeDictionary);
                        lastFinishedStep++;
                        log.success("[4/4] All artifacts are stored at " + path_1.default.join(workingDirectory, "result"));
                    }
                    catch (e) {
                        switch (lastFinishedStep) {
                            case 0:
                                log.error("An error occurred in loading function chain specification.");
                                break;
                            case 1:
                                log.error("An error occurred in loading function source codes to fuse.");
                                break;
                            case 2:
                                log.error("An error occurred in writing the fusion function body.");
                                break;
                            case 3:
                                log.error("An error occurred in saving result artifacts.");
                                break;
                        }
                        log.error("The process is failed. For more detail, see the following error stack.");
                        log.show(e.stack);
                        return [2 /*return*/, lastFinishedStep + 1];
                    }
                    endTime = (0, moment_1.default)();
                    log.success("all process doen " + startTime.to(endTime) + " (ended at " + endTime.format() + ")");
                    //success code
                    return [2 /*return*/, 0];
            }
        });
    });
}
function loadFunctionChainSpecification() {
    // 1.1. load function chain specification
    var functionChainSpecificationJsonString = fs.readFileSync(functionSpecificationFilePath, "utf8");
    var functionChainSpecification = null;
    //1.2. firstly try to parse it as JSON
    try {
        functionChainSpecification = JSON.parse(functionChainSpecificationJsonString);
    }
    catch (_a) {
        //if fail, try to parse it as YAML
        functionChainSpecification = yaml_1.default.parse(functionChainSpecificationJsonString);
    }
    if (functionChainSpecification === null) {
        throw new SyntaxError("The function chain specification isn't a JSON nor YAML. Please check it's syntax");
    }
    return functionChainSpecification;
}
function loadFunctionSourceCodes(functionInfoList) {
    var e_1, _a;
    //2.   load function code
    var functionCodeDictionary = new Map();
    try {
        for (var functionInfoList_1 = __values(functionInfoList), functionInfoList_1_1 = functionInfoList_1.next(); !functionInfoList_1_1.done; functionInfoList_1_1 = functionInfoList_1.next()) {
            var functionInfo = functionInfoList_1_1.value;
            var functionCode = fs.readFileSync(path_1.default.join(sourceFunctionRootDirectoryPath, functionInfo.handlerRootFolder, functionInfo.handlerFileName), "utf8");
            //2.1. convert aws module declaration (exports.handler) to common js module declaration (module.exports)
            var commonJsCode = functionCode.replace(new RegExp("exports." + functionInfo.handlerFunctionName), "module.exports");
            functionCodeDictionary.set(functionInfo.functionId, commonJsCode);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (functionInfoList_1_1 && !functionInfoList_1_1.done && (_a = functionInfoList_1.return)) _a.call(functionInfoList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return functionCodeDictionary;
}
function writeFusionFunctionBodyCode(functionChainSpecification) {
    var e_2, _a;
    //3. write main fused function body
    var fusedFunctionBody = "//this function is auto generated\n";
    //3.1. declare function module
    fusedFunctionBody += '\nconst createMapper = require("./map-factory.js");';
    fusedFunctionBody += "\nconst mapFactoryGetValue = createMapper.getValue;";
    fusedFunctionBody += "\nconst mapFactorySetValue = createMapper.setValue;";
    try {
        for (var _b = __values(functionChainSpecification.functionInfo), _c = _b.next(); !_c.done; _c = _b.next()) {
            var functionInfo = _c.value;
            fusedFunctionBody += "\nconst " + functionInfo.functionId + " = require(\"./" + functionInfo.handlerRootFolder + "/" + functionInfo.handlerFileName + "\");";
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    //3.2. declare main function
    fusedFunctionBody += "\n\nexports.handler = async function(event){";
    //3.3. write main function body
    var lastConverterId = 0;
    var lastPipeDataId = 0;
    var pipeDataVariableName = "pipeData";
    fusedFunctionBody += "\n    const " + pipeDataVariableName + lastPipeDataId + " = event;";
    if (pipelineDataInspectMode) {
        fusedFunctionBody += "\n\n    console.log(\"workflow input\", " + pipeDataVariableName + lastPipeDataId + ");";
    }
    recursiveWriteBodyCode(functionChainSpecification.chain, 1);
    function recursiveWriteBodyCode(chain, depth) {
        var e_3, _a, e_4, _b, e_5, _c;
        try {
            for (var chain_1 = __values(chain), chain_1_1 = chain_1.next(); !chain_1_1.done; chain_1_1 = chain_1.next()) {
                var step = chain_1_1.value;
                switch (step.type) {
                    case "function":
                        fusedFunctionBody += "\n";
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"function " + step.functionId + " input\", " + pipeDataVariableName + lastPipeDataId + ")";
                        }
                        fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = await " + step.functionId + "(" + pipeDataVariableName + lastPipeDataId + ")";
                        lastPipeDataId++;
                        if (step.mergeInputAndOutput !== undefined && step.mergeInputAndOutput) {
                            lastConverterId++;
                            fusedFunctionBody += "\n" + ident(depth) + "const converter" + lastConverterId + " = createMapper();";
                            fusedFunctionBody += "\n" + ident(depth) + "converter" + lastConverterId + ".map().to(\"out\")";
                            fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = converter" + lastConverterId + ".execute(" + pipeDataVariableName + lastPipeDataId + ");";
                            fusedFunctionBody += "\n" + ident(depth) + pipeDataVariableName + (lastPipeDataId + 1) + ".in = " + pipeDataVariableName + (lastPipeDataId - 1) + ";";
                            lastPipeDataId++;
                        }
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"function " + step.functionId + " output\", " + pipeDataVariableName + lastPipeDataId + ")";
                        }
                        break;
                    case "converter":
                        lastConverterId++;
                        fusedFunctionBody += "\n";
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"converter input\", " + pipeDataVariableName + lastPipeDataId + ")";
                        }
                        fusedFunctionBody += "\n" + ident(depth) + "const converter" + lastConverterId + " = createMapper();";
                        try {
                            for (var _d = (e_4 = void 0, __values(step.rules)), _e = _d.next(); !_e.done; _e = _d.next()) {
                                var rule = _e.value;
                                fusedFunctionBody += "\n" + ident(depth) + (0, converterCodeWriter_1.default)(rule, "converter" + lastConverterId);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = converter" + lastConverterId + ".execute(" + pipeDataVariableName + lastPipeDataId + ");";
                        lastPipeDataId++;
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"converter output\", " + pipeDataVariableName + lastPipeDataId + ")";
                        }
                        break;
                    case "map":
                        var inputVariableName = "" + pipeDataVariableName + lastPipeDataId;
                        fusedFunctionBody += "\n";
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"map input\", " + inputVariableName + ");";
                        }
                        //For loop for each element, Array.map is used. But the function is in map is async function, so Promise.all warp it.
                        fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = mapFactoryGetValue(" + pipeDataVariableName + lastPipeDataId + ", \"" + step.iterationTarget + "\")";
                        fusedFunctionBody += "\n" + ident(depth) + "if(Array.isArray(" + pipeDataVariableName + (lastPipeDataId + 1) + ") === false) {throw new Error(\"map fail: " + step.iterationTarget + " is not an array.\")}";
                        lastPipeDataId++;
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"map iteration target\", " + pipeDataVariableName + lastPipeDataId + ");";
                        }
                        var mapResultListVariableName = "" + pipeDataVariableName + (lastPipeDataId + 1);
                        if (false) { //TODO: 나중에 조건문을 스위치 할 수 있도록 바꾸자.
                            //promise all로 map을 처리하는 방법
                            fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = await Promise.all(" + pipeDataVariableName + lastPipeDataId + ".map(function(value){";
                            fusedFunctionBody += "\n" + ident(depth + 1) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = value;";
                            lastPipeDataId++;
                            fusedFunctionBody += "\n" + ident(depth + 1) + "return async function(){";
                            recursiveWriteBodyCode(step.chain, depth + 2);
                            fusedFunctionBody += "\n" + ident(depth + 2) + "return " + pipeDataVariableName + lastPipeDataId + ";";
                            fusedFunctionBody += "\n" + ident(depth + 1) + "}();";
                            fusedFunctionBody += "\n" + ident(depth) + "}));";
                            fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = " + mapResultListVariableName + ";";
                            lastPipeDataId++;
                        }
                        else {
                            //for each로 map을 처리하는 방법.
                            var iterationTarget = "" + pipeDataVariableName + lastPipeDataId;
                            var forResultArrayName = "" + pipeDataVariableName + (lastPipeDataId + 1);
                            var iteratorName = "" + pipeDataVariableName + (lastPipeDataId + 2);
                            lastPipeDataId += 2;
                            fusedFunctionBody += "\n" + ident(depth) + "const " + forResultArrayName + " = []";
                            fusedFunctionBody += "\n" + ident(depth) + "for(let " + iteratorName + " of " + iterationTarget + "){";
                            fusedFunctionBody += "\n" + ident(depth + 1) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = " + iteratorName;
                            lastPipeDataId++;
                            recursiveWriteBodyCode(step.chain, depth + 2);
                            fusedFunctionBody += "\n" + ident(depth + 1) + mapResultListVariableName + ".push(" + pipeDataVariableName + lastPipeDataId + ");";
                            fusedFunctionBody += "\n" + ident(depth) + "}";
                            fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = " + mapResultListVariableName + ";";
                            lastPipeDataId++;
                        }
                        if (step.mergeInputAndOutput !== undefined && step.mergeInputAndOutput) {
                            lastConverterId++;
                            fusedFunctionBody += "\n" + ident(depth) + "const converter" + lastConverterId + " = createMapper();";
                            fusedFunctionBody += "\n" + ident(depth) + "converter" + lastConverterId + ".map().to(\"out\")";
                            fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = converter" + lastConverterId + ".execute(" + pipeDataVariableName + lastPipeDataId + ");";
                            fusedFunctionBody += "\n" + ident(depth) + pipeDataVariableName + (lastPipeDataId + 1) + ".in = " + inputVariableName + ";";
                            lastPipeDataId++;
                        }
                        if (pipelineDataInspectMode) {
                            fusedFunctionBody += "\n" + ident(depth) + "console.log(\"map output\", " + pipeDataVariableName + lastPipeDataId + ")";
                        }
                        break;
                    case "branch":
                        //check condition list validity
                        var nullConditionFoundFlag = false;
                        if (step.blocks.length < 2) {
                            throw new SyntaxError("A branch chain item must have at least 2 blocks, but a branch chain item which has only " + step.blocks.length + " block(s) was found.");
                        }
                        for (var i = 0; i < step.blocks.length; i++) {
                            if (step.blocks[i].condition === null) {
                                if (i !== step.blocks.length - 1) {
                                    throw new SyntaxError("Null condition in branch chain item must be the last condition, but it was found in at " + (i + 1) + "th (total " + step.blocks.length + " conditions");
                                }
                                nullConditionFoundFlag = true;
                            }
                        }
                        if (!nullConditionFoundFlag) {
                            throw new SyntaxError("Null condition in branch chain item must exist, but it was not found.");
                        }
                        //write if-else if-else state
                        var ifBlockInputVariableName = pipeDataVariableName + lastPipeDataId;
                        var ifBlockOutputVariableName = pipeDataVariableName + (lastPipeDataId + 1);
                        lastPipeDataId++;
                        fusedFunctionBody += "\n";
                        fusedFunctionBody += "\n" + ident(depth) + "let " + ifBlockOutputVariableName + " = null;";
                        for (var i = 0; i < step.blocks.length; i++) {
                            var block = step.blocks[i];
                            if (i === 0) {
                                fusedFunctionBody += "\n" + ident(depth) + "if(" + (0, conditionParser_1.default)(block.condition, ifBlockInputVariableName) + "){";
                            }
                            else if (i === step.blocks.length - 1) {
                                fusedFunctionBody += "\n" + ident(depth) + "else{";
                            }
                            else {
                                fusedFunctionBody += "\n" + ident(depth) + "else if(" + (0, conditionParser_1.default)(block.condition, ifBlockInputVariableName) + "){";
                            }
                            fusedFunctionBody += "\n" + ident(depth + 1) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = " + ifBlockInputVariableName;
                            lastPipeDataId++;
                            recursiveWriteBodyCode(block.chains, depth + 1);
                            fusedFunctionBody += "\n" + ident(depth + 1) + ifBlockOutputVariableName + " = " + pipeDataVariableName + lastPipeDataId + ";";
                            fusedFunctionBody += "\n" + ident(depth) + "}";
                        }
                        fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = " + ifBlockOutputVariableName + ";";
                        lastPipeDataId++;
                        break;
                    case "add value":
                        fusedFunctionBody += "\n";
                        try {
                            for (var _f = (e_5 = void 0, __values(step.rules)), _g = _f.next(); !_g.done; _g = _f.next()) {
                                var rule = _g.value;
                                fusedFunctionBody += "\n" + ident(depth) + "mapFactorySetValue(" + pipeDataVariableName + lastPipeDataId + ", \"" + rule.target + "\", JSON.parse('" + rule.value + "'));";
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        break;
                    case "return":
                        fusedFunctionBody += "\n";
                        fusedFunctionBody += "\n" + ident(depth) + "return " + pipeDataVariableName + lastPipeDataId + ";";
                        break;
                    case "error":
                        fusedFunctionBody += "\n";
                        fusedFunctionBody += "\n" + ident(depth) + "const autoGeneratedError" + (lastErrorObjectId + 1) + " = new Error();";
                        lastErrorObjectId++;
                        fusedFunctionBody += "\n" + ident(depth) + "autoGeneratedError" + lastErrorObjectId + ".name = \"" + step.errorName + "\";";
                        fusedFunctionBody += "\n" + ident(depth) + "autoGeneratedError" + lastErrorObjectId + ".message = \"" + step.errorMessage + "\";";
                        fusedFunctionBody += "\n" + ident(depth) + "throw autoGeneratedError" + lastErrorObjectId + ";";
                        break;
                    case "selector":
                        fusedFunctionBody += "\n";
                        fusedFunctionBody += "\n" + ident(depth) + "const " + pipeDataVariableName + (lastPipeDataId + 1) + " = mapFactoryGetValue(" + pipeDataVariableName + lastPipeDataId + ", \"" + step.target + "\");";
                        lastPipeDataId++;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (chain_1_1 && !chain_1_1.done && (_a = chain_1.return)) _a.call(chain_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    fusedFunctionBody += "\n\n    return " + pipeDataVariableName + lastPipeDataId;
    fusedFunctionBody += "\n}";
    return fusedFunctionBody;
}
function ident(depth) {
    var identBlock = "    ";
    var result = "";
    for (var i = 0; i < depth; i++) {
        result += identBlock;
    }
    return result;
}
function writeResult(fusedFunctionCode, functionInfoList, functionCodeDictionary) {
    //4. write all result to files.
    var e_6, _a, e_7, _b, e_8, _c;
    //4.1. make result directory
    if (!fs.existsSync(path_1.default.join(workingDirectory, "result"))) {
        fs.mkdirSync(path_1.default.join(workingDirectory, "result"));
    }
    try {
        //4.2 copy source function directories
        for (var functionInfoList_2 = __values(functionInfoList), functionInfoList_2_1 = functionInfoList_2.next(); !functionInfoList_2_1.done; functionInfoList_2_1 = functionInfoList_2.next()) {
            var functionInfo = functionInfoList_2_1.value;
            var source = path_1.default.join(sourceFunctionRootDirectoryPath, functionInfo.handlerRootFolder);
            var destination = path_1.default.join(workingDirectory, "result", functionInfo.handlerRootFolder);
            if (!fs.existsSync(path_1.default.join(workingDirectory, "result", functionInfo.handlerRootFolder))) {
                fs.mkdirSync(path_1.default.join(workingDirectory, "result", functionInfo.handlerRootFolder));
            }
            copydir.sync(source, destination);
            //TODO:함수 복사 완성하기
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (functionInfoList_2_1 && !functionInfoList_2_1.done && (_a = functionInfoList_2.return)) _a.call(functionInfoList_2);
        }
        finally { if (e_6) throw e_6.error; }
    }
    try {
        //4.3. write converted file
        for (var functionInfoList_3 = __values(functionInfoList), functionInfoList_3_1 = functionInfoList_3.next(); !functionInfoList_3_1.done; functionInfoList_3_1 = functionInfoList_3.next()) {
            var functionInfo = functionInfoList_3_1.value;
            fs.writeFileSync(path_1.default.join(workingDirectory, "result", functionInfo.handlerRootFolder, functionInfo.handlerFileName), functionCodeDictionary.get(functionInfo.functionId), "utf8");
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (functionInfoList_3_1 && !functionInfoList_3_1.done && (_b = functionInfoList_3.return)) _b.call(functionInfoList_3);
        }
        finally { if (e_7) throw e_7.error; }
    }
    try {
        //4.4. write entry file
        for (var functionInfoList_4 = __values(functionInfoList), functionInfoList_4_1 = functionInfoList_4.next(); !functionInfoList_4_1.done; functionInfoList_4_1 = functionInfoList_4.next()) {
            var functionInfo = functionInfoList_4_1.value;
            fs.writeFileSync(path_1.default.join(workingDirectory, "result", "index.js"), fusedFunctionCode, "utf8");
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (functionInfoList_4_1 && !functionInfoList_4_1.done && (_c = functionInfoList_4.return)) _c.call(functionInfoList_4);
        }
        finally { if (e_8) throw e_8.error; }
    }
    //4.5. copy dependency module
    fs.copyFileSync(path_1.default.join(__dirname, "bundleModule/map-factory.js"), path_1.default.join(workingDirectory, "result/map-factory.js"));
}
//# sourceMappingURL=index.js.map