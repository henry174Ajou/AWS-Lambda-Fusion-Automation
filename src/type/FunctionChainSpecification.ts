/**
 * This is a **root object** of a function chain specification JSON/YAML file.
 * start here to write your function chain specification.
 *
 * A function chain specification contains two information:
 * 1. source function information
 * 2. workflow structure
 */
interface FunctionChainSpecification {
    /**
     * List of [[FunctionInfo|function information]].
     *
     * This property describe what function is in the workflow and its information.
     */
    functionInfo: FunctionInfo[],

    /**
     * Ordered list of [[ChainItem|step]].
     *
     * The *step* means an acton that workflow will run. It will be [[FunctionChainItem|a function]], [[BranchChainItem|a conditional branch]], [[FanOutChainItem|iteration]], or [[ConverterChainItem|a message transformation]].
     *
     * This is a **ordered** list. The order of step is meaningful.
     * The chain can be nested if the workflow contain [[FanOutChainItem|fan-outs]] or [[BranchChainItem|conditional branches]].
     */
    chain: ChainItem[]
}

export {FunctionChainSpecification};

export {FunctionChainSpecification as default};

export type ChainItem = FunctionChainItem | ConverterChainItem | SelectorChainItem | FanOutChainItem | BranchChainItem | ConstantValueAddChainItem | ReturnChainItem | ErrorChainItem;

export interface FunctionInfo {
    handlerFileName: string
    handlerFunctionName: string
    functionId: string,
    handlerRootFolder: string
}

export interface FunctionChainItem {
    type: "function",
    functionId: string,
    mergeInputAndOutput?: boolean
}

export interface ConverterChainItem {
    type: "converter",
    rules: TransformAction[]
}

export interface TransformAction {
    from: string,
    postAction: PostAction | undefined | null,
    postActionParameters: string[] | null | undefined,
    to: string
}

export enum PostAction {
    removing = "removing",
    keep = "keep",
    acceptIf = "acceptIf",
    rejectIf = "rejectIf",
    first = "first",
    last = "last",
    compact = "compact",
}

export interface SelectorChainItem {
    type: "selector",
    target: string
}

export interface ConstantValueAddChainItem {
    type: "add value",
    rules: Array<{target:string, value: ""}>
}

export interface FanOutChainItem {
    type: "fan-out" | "fanout" |"fanOut" | "fan out" | "map",
    iterationTarget: string,
    chain: ChainItem[],
    mergeInputAndOutput?: boolean
}

export type MapChainItem = FanOutChainItem;


export interface BranchChainItem {
    type: "branch",
    blocks: Array<{condition: string | null, chains: ChainItem[]}>
}

export interface ReturnChainItem {
    type: "return"
}

export interface ErrorChainItem {
    type: "error",
    errorName: string,
    errorMessage: string
}
