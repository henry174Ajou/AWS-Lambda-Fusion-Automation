export default interface FunctionChainSpecification {
    functionInfo: FunctionInfo[],
    chain: ChainItem[]
}

export type ChainItem = FunctionChainItem | ConverterChainItem | SelectorChainItem | MapChainItem | BranchChainItem | ConstantValueAddChainItem | ReturnChainItem | ErrorChainItem;

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

export interface MapChainItem {
    type: "map",
    iterationTarget: string,
    chain: ChainItem[],
    mergeInputAndOutput?: boolean
}

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
