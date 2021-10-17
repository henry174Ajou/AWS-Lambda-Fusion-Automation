import {PostAction, TransformAction} from "./type/FunctionChainSpecification";

export default function converterCodeWriter(rule: TransformAction, converterName: string){
    const mapTerm: string = rule.from === "" ? ".map()" : `.map("${rule.from}")`;
    const toTerm: string = rule.to === "" ? "" : `.to("${rule.to}")`;

    let postActionTerm = "";
    if(rule.postAction === undefined || rule.postAction === null){
        //Do noting.
        //this if condition is for type guard.
    }
    else if(rule.postAction === PostAction.removing){
        let arrayString = ""
        if(rule.postActionParameters !== null && rule.postActionParameters !== undefined){
            arrayString = "[" + rule.postActionParameters.map(v=>`"${v}"`).reduce((acc, v)=>`${acc}, ${v}`) + "]";
        }
        postActionTerm = `.removing(${arrayString})`;
    }
    else if(rule.postAction === PostAction.keep){
        let arrayString = ""
        if(rule.postActionParameters !== null && rule.postActionParameters !== undefined){
            arrayString = "[" + rule.postActionParameters.map(v=>`"${v}"`).reduce((acc, v)=>`${acc}, ${v}`) + "]";
        }
        postActionTerm = `.keep(${arrayString})`;
    }
    else if(rule.postAction === PostAction.acceptIf){
        if(rule.postActionParameters === null || rule.postActionParameters === undefined){
            let msg = `An incorrectly defined converter rule was found.
            The post action "acceptIf" requires 2 parameters but it isn't defined. The "postActionParameters" property is ${rule.postActionParameters}`;

            throw new SyntaxError(msg);
        }
        else if(rule.postActionParameters.length !== 2){
            let msg = `An incorrectly defined converter rule was found.
            The post action "acceptIf" requires 2 parameters but the "postActionParameters" property has ${rule.postActionParameters.length} parameter(s).`;

            throw new SyntaxError(msg);
        }

        postActionTerm = `.acceptIf("${rule.postActionParameters[0]}", "${rule.postActionParameters[1]}")`;
    }
    else if(rule.postAction === PostAction.rejectIf){
        if(rule.postActionParameters === null || rule.postActionParameters === undefined){
            let msg = `An incorrectly defined converter rule was found.
            The post action "rejectIf" requires 2 parameters but it isn't defined. The "postActionParameters" property is ${rule.postActionParameters}`;

            throw new SyntaxError(msg);
        }
        else if(rule.postActionParameters.length !== 2){
            let msg = `An incorrectly defined converter rule was found.
            The post action "rejectIf" requires 2 parameters but the "postActionParameters" property has ${rule.postActionParameters.length} parameter(s).`;

            throw new SyntaxError(msg);
        }

        postActionTerm = `.rejectIf("${rule.postActionParameters[0]}", "${rule.postActionParameters[1]}")`;
    }
    else if(rule.postAction === PostAction.first){
        if(rule.postActionParameters !== null && rule.postActionParameters !== undefined && rule.postActionParameters.length > 0){
            let msg = `An incorrectly defined converter rule was found.
            The post action "first" requires no parameter but the "postActionParameters" property has ${rule.postActionParameters.length} parameter(s).`;

            throw new SyntaxError(msg);
        }

        postActionTerm = `.first()`;
    }
    else if(rule.postAction === PostAction.last){
        if(rule.postActionParameters !== null && rule.postActionParameters !== undefined && rule.postActionParameters.length > 0){
            let msg = `An incorrectly defined converter rule was found.
            The post action "last" requires no parameter but the "postActionParameters" property has ${rule.postActionParameters.length} parameter(s).`;

            throw new SyntaxError(msg);
        }

        postActionTerm = `.last()`;
    }
    else if(rule.postAction === PostAction.compact){
        if(rule.postActionParameters !== null && rule.postActionParameters !== undefined && rule.postActionParameters.length > 0){
            let msg = `An incorrectly defined converter rule was found.
            The post action "compat" requires no parameter but the "postActionParameters" property has ${rule.postActionParameters.length} parameter(s).`;

            throw new SyntaxError(msg);
        }

        postActionTerm = `.compact()`;
    }

    return converterName + mapTerm + postActionTerm + toTerm +";";
}