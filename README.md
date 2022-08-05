## simple-expr-eval
 Ultra simple expression evaluator with zero dependencies. wrote in Typescript. Build with own token generator, parser, and AST.
## install
    npm i simple-expr-eval
          (or)
    yarn add simple-expr-eval

# example 

## CommonJs

    const SEE = require("simple-expr-eval")
    
    let a = SEE.evaluate("2+3") // 5
    let b = SEE.evaluate("4*5+6") // 26
    let c = SEE.evaluate("7/2") // 3.5
    let d = SEE.evaluate("9%7") // 2
    let e = SEE.evaluate("3**2%4") // 1 

## ESM module
    
    import { evaluate } from "simple-expr-eval";

    let a = evaluate("2+3") // 5
    let b = evaluate("4*5+6") // 26
    let c = evaluate("7/2") // 3.5
    let d = evaluate("9%5") // 4
    let e = evaluate("3**2%4") // 1 
