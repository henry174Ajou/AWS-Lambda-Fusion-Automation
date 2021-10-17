import path from "path";
import FunctionChainSpecification, {ChainItem, FunctionInfo, MapChainItem} from "./type/FunctionChainSpecification";
import * as fs from "fs";
import moment from "moment";
import converterCodeWriter from "./converterCodeWriter";
import conditionParser from "./conditionParser";
import YAML from "yaml";
const log = require("log-beautify");
const copydir = require('copy-dir');
const prompt = require('prompt-promise');

log.useSymbols = true;
log.useLabels = true;

let workingDirectory = process.cwd();
let functionSpecificationFilePath = "";
let pipelineDataInspectMode = false;
let lastErrorObjectId = 0;

main().then(code=>{process.exit(code)}).catch(function(error){
    console.error(error);
    process.exit(500);
});

async function main() : Promise<number>{
    console.log(`working directory: ${workingDirectory}`);
    functionSpecificationFilePath = path.join(workingDirectory, await prompt("function specification file path: "));
    pipelineDataInspectMode = await prompt("inspect on? (y/n): ") === "y";

    const startTime = moment();
    log.info(`process started at ${startTime.format()}`);
    let lastFinishedStep = 0;

    try{
        const functionChainSpecification = loadFunctionChainSpecification();
        lastFinishedStep++;
        log.success("[1/4] The function chain specification is parsed.")

        const sourceCodeDictionary = loadFunctionSourceCodes(functionChainSpecification.functionInfo);
        lastFinishedStep++;
        log.success("[2/4] Function source codes to fuse are loaded.")

        const fusionFunctionSourceCode = writeFusionFunctionBodyCode(functionChainSpecification);
        lastFinishedStep++;
        log.success("[3/4] The fusion function is generated.")

        writeResult(fusionFunctionSourceCode, functionChainSpecification.functionInfo, sourceCodeDictionary);
        lastFinishedStep++;
        log.success(`[4/4] All artifacts are stored at ${path.join(workingDirectory, "result")}`);
    }
    catch (e) {
        switch (lastFinishedStep) {
            case 0:
                log.error("An error occurred in loading function chain specification.")
                break;
            case 1:
                log.error("An error occurred in loading function source codes to fuse.")
                break;
            case 2:
                log.error("An error occurred in writing the fusion function body.")
                break;
            case 3:
                log.error("An error occurred in saving result artifacts.");
                break;
        }

        log.error("The process is failed. For more detail, see the following error stack.");
        log.show((e as Error).stack);

        return lastFinishedStep+1;
    }


    const endTime = moment();

    log.success(`all process doen ${startTime.to(endTime)} (ended at ${endTime.format()})`);

    //success code
    return 0;
}

function loadFunctionChainSpecification() : FunctionChainSpecification {
    // 1.1. load function chain specification
    const functionChainSpecificationJsonString: string = fs.readFileSync(functionSpecificationFilePath, "utf8");

    let functionChainSpecification: FunctionChainSpecification | null = null;
    //1.2. firstly try to parse it as JSON
    try{
        functionChainSpecification = JSON.parse(functionChainSpecificationJsonString) as FunctionChainSpecification;
    }
    catch {
        //if fail, try to parse it as YAML
        functionChainSpecification = YAML.parse(functionChainSpecificationJsonString) as FunctionChainSpecification;
    }

    if(functionChainSpecification === null){
        throw new SyntaxError(`The function chain specification isn't a JSON nor YAML. Please check it's syntax`);
    }


    return functionChainSpecification;
}

function loadFunctionSourceCodes(functionInfoList: FunctionInfo[]) : Map<string, string>{
    //2.   load function code
    const functionCodeDictionary = new Map<string, string>();
    for(let functionInfo of functionInfoList){
        const functionCode: string = fs.readFileSync(path.join(workingDirectory, "source_function", functionInfo.handlerRootFolder, functionInfo.handlerFileName), "utf8");

        //2.1. convert aws module declaration (exports.handler) to common js module declaration (module.exports)
        const commonJsCode: string = functionCode.replace(new RegExp(`exports.${functionInfo.handlerFunctionName}`), "module.exports");

        functionCodeDictionary.set(functionInfo.functionId, commonJsCode);
    }

    return functionCodeDictionary;
}

function writeFusionFunctionBodyCode(functionChainSpecification: FunctionChainSpecification): string {
    //3. write main fused function body
    let fusedFunctionBody: string = "//this function is auto generated\n";

    //3.1. declare function module
    fusedFunctionBody += '\nconst createMapper = require("./map-factory.js");'
    fusedFunctionBody += `\nconst mapFactoryGetValue = createMapper.getValue;`
    fusedFunctionBody += `\nconst mapFactorySetValue = createMapper.setValue;`
    for(let functionInfo of functionChainSpecification.functionInfo){
        fusedFunctionBody += `\nconst ${functionInfo.functionId} = require("./${functionInfo.handlerRootFolder}/${functionInfo.handlerFileName}");`;
    }

    //3.2. declare main function
    fusedFunctionBody += "\n\nexports.handler = async function(event){";

    //3.3. write main function body
    let lastConverterId = 0;
    let lastPipeDataId = 0;
    const pipeDataVariableName = "pipeData";
    fusedFunctionBody += `\n    const ${pipeDataVariableName}${lastPipeDataId} = event;`;
    if(pipelineDataInspectMode){
        fusedFunctionBody += `\n\n    console.log("workflow input", ${pipeDataVariableName}${lastPipeDataId});`;
    }
    recursiveWriteBodyCode(functionChainSpecification.chain, 1)

    function recursiveWriteBodyCode(chain: ChainItem[], depth: number){
        for(let step of chain){
            switch (step.type) {
                case "function":
                    fusedFunctionBody += "\n";
                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("function ${step.functionId} input", ${pipeDataVariableName}${lastPipeDataId})`;
                    }
                    fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = await ${step.functionId}(${pipeDataVariableName}${lastPipeDataId})`;
                    lastPipeDataId++;

                    if(step.mergeInputAndOutput !== undefined && step.mergeInputAndOutput){
                        lastConverterId++;
                        fusedFunctionBody += `\n${ident(depth)}const converter${lastConverterId} = createMapper();`
                        fusedFunctionBody += `\n${ident(depth)}converter${lastConverterId}.map().to("out")`;
                        fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = converter${lastConverterId}.execute(${pipeDataVariableName}${lastPipeDataId});`;
                        fusedFunctionBody += `\n${ident(depth)}${pipeDataVariableName}${lastPipeDataId+1}.in = ${pipeDataVariableName}${lastPipeDataId-1};`;
                        lastPipeDataId++;
                    }

                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("function ${step.functionId} output", ${pipeDataVariableName}${lastPipeDataId})`;
                    }

                    break;

                case "converter":
                    lastConverterId++;
                    fusedFunctionBody += "\n";
                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("converter input", ${pipeDataVariableName}${lastPipeDataId})`;
                    }
                    fusedFunctionBody += `\n${ident(depth)}const converter${lastConverterId} = createMapper();`;
                    for(let rule of step.rules){
                        fusedFunctionBody += `\n${ident(depth)}${converterCodeWriter(rule, "converter" + lastConverterId)}`;
                    }
                    fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = converter${lastConverterId}.execute(${pipeDataVariableName}${lastPipeDataId});`;
                    lastPipeDataId++;

                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("converter output", ${pipeDataVariableName}${lastPipeDataId})`;
                    }

                    break;

                case "map":
                    const inputVariableName = `${pipeDataVariableName}${lastPipeDataId}`;

                    fusedFunctionBody += "\n";
                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("map input", ${inputVariableName});`;
                    }

                    //For loop for each element, Array.map is used. But the function is in map is async function, so Promise.all warp it.
                    fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = mapFactoryGetValue(${pipeDataVariableName}${lastPipeDataId}, "${step.iterationTarget}")`;
                    fusedFunctionBody += `\n${ident(depth)}if(Array.isArray(${pipeDataVariableName}${lastPipeDataId+1}) === false) {throw new Error("map fail: ${step.iterationTarget} is not an array.")}`;
                    lastPipeDataId++;

                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("map iteration target", ${pipeDataVariableName}${lastPipeDataId});`;
                    }

                    const mapResultListVariableName = `${pipeDataVariableName}${lastPipeDataId+1}`;
                    if(false){ //TODO: 나중에 조건문을 스위치 할 수 있도록 바꾸자.
                        fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = await Promise.all(${pipeDataVariableName}${lastPipeDataId}.map(function(value){`
                        fusedFunctionBody += `\n${ident(depth+1)}const ${pipeDataVariableName}${lastPipeDataId+1} = value;`;
                        lastPipeDataId++;
                        fusedFunctionBody += `\n${ident(depth+1)}return async function(){`;
                        recursiveWriteBodyCode((step as MapChainItem).chain, depth+2);
                        fusedFunctionBody += `\n${ident(depth+2)}return ${pipeDataVariableName}${lastPipeDataId};`;
                        fusedFunctionBody += `\n${ident(depth+1)}}();`;
                        fusedFunctionBody += `\n${ident(depth)}}));`;
                        fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = ${mapResultListVariableName};`;
                        lastPipeDataId++;
                    }
                    else {
                        const iterationTarget = `${pipeDataVariableName}${lastPipeDataId}`
                        const forResultArrayName = `${pipeDataVariableName}${lastPipeDataId+1}`;
                        const iteratorName = `${pipeDataVariableName}${lastPipeDataId+2}`;
                        lastPipeDataId += 2;

                        fusedFunctionBody += `\n${ident(depth)}const ${forResultArrayName} = []`;
                        fusedFunctionBody += `\n${ident(depth)}for(let ${iteratorName} of ${iterationTarget}){`
                        fusedFunctionBody += `\n${ident(depth+1)}const ${pipeDataVariableName}${lastPipeDataId+1} = ${iteratorName}`;
                        lastPipeDataId++;
                        recursiveWriteBodyCode(step.chain, depth+2);
                        fusedFunctionBody += `\n${ident(depth+1)}${mapResultListVariableName}.push(${pipeDataVariableName}${lastPipeDataId});`;
                        fusedFunctionBody += `\n${ident(depth)}}`;
                        fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = ${mapResultListVariableName};`;
                        lastPipeDataId++;
                    }

                    if(step.mergeInputAndOutput !== undefined && step.mergeInputAndOutput){
                        lastConverterId++;
                        fusedFunctionBody += `\n${ident(depth)}const converter${lastConverterId} = createMapper();`
                        fusedFunctionBody += `\n${ident(depth)}converter${lastConverterId}.map().to("out")`;
                        fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = converter${lastConverterId}.execute(${pipeDataVariableName}${lastPipeDataId});`;
                        fusedFunctionBody += `\n${ident(depth)}${pipeDataVariableName}${lastPipeDataId+1}.in = ${inputVariableName};`;
                        lastPipeDataId++;
                    }

                    if(pipelineDataInspectMode){
                        fusedFunctionBody += `\n${ident(depth)}console.log("map output", ${pipeDataVariableName}${lastPipeDataId})`;
                    }

                    break;

                case "branch":
                    //check condition list validity
                    let nullConditionFoundFlag = false;
                    if(step.blocks.length < 2){
                        throw new SyntaxError(`A branch chain item must have at least 2 blocks, but a branch chain item which has only ${step.blocks.length} block(s) was found.`);
                    }
                    for(let i = 0; i < step.blocks.length; i++){
                        if(step.blocks[i].condition === null){
                            if(i !== step.blocks.length-1){
                                throw new SyntaxError(`Null condition in branch chain item must be the last condition, but it was found in at ${i+1}th (total ${step.blocks.length} conditions`);
                            }
                            nullConditionFoundFlag = true;
                        }
                    }
                    if(!nullConditionFoundFlag){
                        throw new SyntaxError(`Null condition in branch chain item must exist, but it was not found.`);
                    }

                    //write if-else if-else state
                    const ifBlockInputVariableName = pipeDataVariableName+lastPipeDataId;
                    const ifBlockOutputVariableName = pipeDataVariableName+(lastPipeDataId+1);
                    lastPipeDataId++;
                    fusedFunctionBody += "\n";
                    fusedFunctionBody += `\n${ident(depth)}let ${ifBlockOutputVariableName} = null;`;
                    for(let i = 0; i < step.blocks.length; i++){
                        const block = step.blocks[i];

                        if(i === 0){
                            fusedFunctionBody += `\n${ident(depth)}if(${conditionParser(block.condition as string, ifBlockInputVariableName)}){`;
                        }
                        else if(i === step.blocks.length-1){
                            fusedFunctionBody += `\n${ident(depth)}else{`;
                        }
                        else {
                            fusedFunctionBody += `\n${ident(depth)}else if(${conditionParser(block.condition as string, ifBlockInputVariableName)}){`;
                        }
                        fusedFunctionBody += `\n${ident(depth+1)}const ${pipeDataVariableName}${lastPipeDataId+1} = ${ifBlockInputVariableName}`
                        lastPipeDataId++;
                        recursiveWriteBodyCode(block.chains, depth+1);
                        fusedFunctionBody += `\n${ident(depth+1)}${ifBlockOutputVariableName} = ${pipeDataVariableName}${lastPipeDataId};`;
                        fusedFunctionBody += `\n${ident(depth)}}`;
                    }
                    fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = ${ifBlockOutputVariableName};`;
                    lastPipeDataId++;
                    break;

                case "add value":
                    fusedFunctionBody += "\n";
                    for(let rule of step.rules){
                        fusedFunctionBody += `\n${ident(depth)}mapFactorySetValue(${pipeDataVariableName}${lastPipeDataId}, "${rule.target}", JSON.parse('${rule.value}'));`
                    }
                    break;

                case "return":
                    fusedFunctionBody += "\n";
                    fusedFunctionBody += `\n${ident(depth)}return ${pipeDataVariableName}${lastPipeDataId};`;
                    break;

                case "error":
                    fusedFunctionBody += "\n";
                    fusedFunctionBody += `\n${ident(depth)}const autoGeneratedError${lastErrorObjectId+1} = new Error();`;
                    lastErrorObjectId++;
                    fusedFunctionBody += `\n${ident(depth)}autoGeneratedError${lastErrorObjectId}.name = "${step.errorName}";`;
                    fusedFunctionBody += `\n${ident(depth)}autoGeneratedError${lastErrorObjectId}.message = "${step.errorMessage}";`;
                    fusedFunctionBody += `\n${ident(depth)}throw autoGeneratedError${lastErrorObjectId};`;
                    break;

                case "selector":
                    fusedFunctionBody += "\n";
                    fusedFunctionBody += `\n${ident(depth)}const ${pipeDataVariableName}${lastPipeDataId+1} = mapFactoryGetValue(${pipeDataVariableName}${lastPipeDataId}, "${step.target}");`;
                    lastPipeDataId++;
            }
        }
    }
    fusedFunctionBody += `\n\n    return ${pipeDataVariableName}${lastPipeDataId}`;
    fusedFunctionBody += "\n}";

    return fusedFunctionBody;

}

function ident(depth: number): string{
    const identBlock = "    ";
    let result = "";
    for(let i = 0; i < depth; i++){
        result += identBlock;
    }
    return result;
}


function writeResult(fusedFunctionCode: string, functionInfoList: FunctionInfo[], functionCodeDictionary: Map<string, string>) {
    //4. write all result to files.

    //4.1. make result directory
    if(!fs.existsSync(path.join(workingDirectory, "result"))){
        fs.mkdirSync(path.join(workingDirectory, "result"));
    }

    //4.2 copy source function directories
    for(let functionInfo of functionInfoList){
        const source = path.join(workingDirectory, "source_function", functionInfo.handlerRootFolder);
        const destination = path.join(workingDirectory, "result", functionInfo.handlerRootFolder);
        if(!fs.existsSync(path.join(workingDirectory, "result", functionInfo.handlerRootFolder))){
            fs.mkdirSync(path.join(workingDirectory, "result", functionInfo.handlerRootFolder));
        }
        copydir.sync(source, destination);
        //TODO:함수 복사 완성하기
    }

    //4.3. write converted file
    for(let functionInfo of functionInfoList){
        fs.writeFileSync(path.join(workingDirectory, "result", functionInfo.handlerRootFolder, functionInfo.handlerFileName), functionCodeDictionary.get(functionInfo.functionId) as string, "utf8");
    }

    //4.4. write entry file
    for(let functionInfo of functionInfoList){
        fs.writeFileSync(path.join(workingDirectory, "result", "index.js"), fusedFunctionCode, "utf8");
    }

    //4.5. copy dependency module
    fs.copyFileSync(path.join(__dirname, "bundleModule/map-factory.js"), path.join(workingDirectory, "result/map-factory.js"));
}




