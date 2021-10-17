export default function conditionParser(conditionString: string, rootVariableName: string): string {
    if(rootVariableName === ""){
        throw new Error(`[internal error] the root variable name for condition string parser is empty string
         It is not your fault. This is a bug of this program. If you see this message, please let the developer know about this bug by reporting this error stack.`)
    }
    const originalConditionString = conditionString;
    while (true){ //repeat until all $$ terms are replaced.
        let parsingIsOnFlag = false;
        let tokenStartPoint = 0;
        let tokenLength = 0;
        let replaceString = "";
        for(let p = 0; p < conditionString.length; p++){
            if(conditionString[p] === "$" && parsingIsOnFlag === false){
                parsingIsOnFlag = true;
                tokenStartPoint = p;
            }
            else if(conditionString[p] === "$" && parsingIsOnFlag === true){
                parsingIsOnFlag = false;
                tokenLength = p-tokenStartPoint+1;
                const propertyChain = conditionString.substr(tokenStartPoint+1, tokenLength-2);
                if(propertyChain === ""){
                    replaceString = rootVariableName;
                }
                else{
                    replaceString = `mapFactoryGetValue(${rootVariableName}, "${propertyChain}")`;
                }
                break;
            }
        }

        if(parsingIsOnFlag){
            throw new SyntaxError(`condition string parsing error
            There is a letter $ which does not have its pair.
            ${originalConditionString}`)
        }

        if(replaceString === ""){
            break;
        }

        conditionString = replaceRange(conditionString, tokenStartPoint, tokenLength+tokenStartPoint, replaceString);
    }

    return conditionString;
}

function replaceRange(s:string, start:number, end:number, substitute:string): string {
    return s.substring(0, start) + substitute + s.substring(end);
}