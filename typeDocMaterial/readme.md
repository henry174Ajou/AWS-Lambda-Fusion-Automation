# Function Chain Specification JSON scheme document.
This is a document for Function Chain Specification. 

## Start Here
The root object name is `FunctionChainSpecification`.
See the structure {@link FunctionChainSpecification | here}.

## Overview
This is a quick reference. If you want more information, search the type name.
```
root : FunctionChainSpecification
├── functionInfo: FunctionInfo[]
│   ├── handlerFileName: string
│   ├── handlerFunctionName: string
│   ├── functionId: string
│   └── handlerRootFolder: string
└── chain: ChainItem[]
    ├── FunctionChainItem
    │   ├── type: "function"
    │   ├── functionId: string
    │   └── mergeInputAndOutput?: boolean
    ├── ConverterChainItem
    │   ├── type: "converter"
    │   └── rules: TransformAction[]
    │       ├── from: string
    │       ├── postAction: PostAction | undefined | null
    │       ├── postActionParameters: string[] | null | undefined
    │       └── to: string
    ├── SelectorChainItem
    │   ├── type: "selector"
    │   └── target: string
    ├── FanOutChainItem
    │   ├── type: "fan-out" | "fanout" |"fanOut" | "fan out" | "map"
    │   ├── iterationTarget: string
    │   ├── chain: ChainItem[]
    │   └── mergeInputAndOutput?: boolean
    ├── BranchChainItem
    │   ├── type: "branch"
    │   └── blocks: Array<{condition: string | null, chains: ChainItem[]}>
    ├── ConstantValueAddChainItem
    │   ├── type: "add value"
    │   └── rules: Array<{target:string, value: ""}>
    ├── ReturnChainItem
    │   └── type: "return"
    └── ErrorChainItem
        ├── type: "error"
        ├── errorName: string
        └── errorMessage: string
```


## sample
```yaml
functionInfo:
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: allPositive
    handlerRootFolder: allPositive
    executionTime: 2
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: square
    handlerRootFolder: square
    executionTime: 2
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: twice
    handlerRootFolder: twice
    executionTime: 2
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: absolute
    handlerRootFolder: absolute
    executionTime: 2
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: sum
    handlerRootFolder: numberListSum
    executionTime: 2
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: pass50ms
    handlerRootFolder: fiftyMilliPass
    executionTime: 50
  - handlerFileName: index.js
    handlerFunctionName: handler
    functionId: pass500ms
    handlerRootFolder: pass500ms
    executionTime: 500

chain:
  - type: function
    functionId: allPositive
    mergeInputAndOutput: true
  - type: converter
    rules:
      - from: in.numberList
        to: numberList
      - from: out.result
        to: isAllPositive
  - type: branch
    stepName: firstCondition
    blocks:
      - condition: "$isAllPositive$ === true"
        probability: 0.5
        chains:
          - type: map
            iterationTarget: numberList
            numberOfRequest: 8
            maximumConcurrency: 8
            stepName: firstTrueMap
            chain:
              - type: converter
                rules:
                  - from: ""
                    to: number
              - type: function
                functionId: square
      - condition: null
        probability: 0.5
        chains:
          - type: map
            iterationTarget: numberList
            numberOfRequest: 8
            maximumConcurrency: 8
            stepName: firstFalseMap
            chain:
              - type: converter
                rules:
                  - from: ""
                    to: number
              - type: function
                functionId: absolute
              - type: function
                functionId: twice
  - type: converter
    rules:
      - from: "[].number"
        to: numberList
  - type: function
    functionId: sum
    mergeInputAndOutput: true
  - type: converter
    rules:
      - from: in.numberList
        to: numberList
      - from: out.sum
        to: sum
  - type: branch
    stepName: secondCondition
    blocks:
      - condition: "$sum$ > 100"
        probability: 0.5
        chains:
          - type: map
            iterationTarget: numberList
            maximumConcurrency: 8
            numberOfRequest: 8
            stepName: secondTrueMap
            chain:
              - type: function
                functionId: pass50ms
      - condition: null
        probability: 0.5
        chains:
          - type: map
            iterationTarget: numberList
            maximumConcurrency: 8
            stepName: secondFalseMap
            numberOfRequest: 8
            chain:
              - type: function
                functionId: pass500ms
```

This is a function chain specification of SingleShortAndLongCondition workflow.
You can see this file in `sample/singleShortAndLongCondition.yaml`.
The workflow structure is shown in the below.
![](../typeDocMaterial/singleShortAndLongCondition.svg)