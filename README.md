# AWS Lambda Fusion Automation

This script fuse source functions that compose a workflow into a single big function.



## Installation

1. Clone this repository.

2. Install dependencies via

   ```bash
   npm ci
   ```
   
3. Run the script code.

   ```bash
   npm run fuse
   ```

   

## How to use

1. Write a function chain specification.
   A function chain specification describes your workflow structure. The syntax document for a function chain specification will be uploaded soon.

2. Pack source functions and the function chain specification.
   The function chain specification and the source functions to be fused are in the same directory with the following directory structure.

   ```
   input_root/
   ├─ function_chain_specification.yaml
   ├─ source_function/
   │  ├─ functionA/
   │  │  ├─ index.js
   │  ├─ functionB/
   │  │  ├─ index.js
   │  ├─ functionC/
   │  │  ├─ index.js
   │  │  ├─ node_modules/
   ```
   The name of the function chain specification can be any name as you want. However, the directory name of the collection of the source functions must be `source_function`. Each source function has its own directory in `source_function`. If a source function has dependencies, it should be put in the source function directory (like function C).

3. Start the script by `npm run fuse` in the project root. You can also directly run the script file `dist/index.js`.

4. Input the path of the function chain specification.

5. the fusion result is wrote in the `result` directory, the same location with the function chain specification.

6. Archive the `result` directory as a zip file, and upload it to AWS Lambda.

