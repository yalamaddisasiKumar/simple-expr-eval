
enum Token{
    Add = 1,
    Sub,
    Multi,
    Divide,
    Caret,
    Modulus,
    LeftPerm,
    RightPerm,
    Num,
    // EOF,
}

enum TokenValue{
    Pluse = '+',
    Minus = '-',
    Star = '*',
    ForwardSlash = '/',
    // Caret = '^',
    Caret = '**',
    Modulus = "%",
    LeftPerm = '(',
    RightPerm = ')'
}

// enum OperPres{
//     DefaultZero,
//     AddSub,
//     MulDiv,
//     Power,
//     Negative,
//     Perm
// }

// type TokenObj = {
//     token: Token.Num,
//     data:  number,
// } | {
//     token: Token,
//     data?:  number,
// }



type TokenObj = {
    token: Exclude<Token, Token.Num> ,
    data?: number,
} | {
    token: Token.Num,
    data:  number,
}

// function getTokenPrec(tObj: TokenObj): OperPres{
//     switch(tObj.token){
//         case Token.Add : {
//             return OperPres.AddSub
//         };
//         case Token.Sub : {
//             return OperPres.AddSub
//         };
//         case Token.Multi : {
//             return OperPres.MulDiv
//         };
//         case Token.Divide : {
//             return OperPres.MulDiv
//         };
//         case Token.Caret : {
//             return OperPres.Power
//         };
//         case Token.LeftPerm : {
//             return OperPres.Perm
//         };
//         case Token.RightPerm : {
//             return OperPres.Perm
//         };
//         default : {
//             return OperPres.DefaultZero
//         }
//     }
// }

// type Chars =  Record< TokenValue, string>

type ValidChars = TokenValue | "." | "," ;
type ArthematicToken = Token.Add | Token.Sub | Token.Multi | Token.Divide | Token.Caret | Token.Modulus
type ArthematicOpertor =  "add" | "sub" | "multi" | "div" | "power" | "modulus";

type AllOpType = ArthematicOpertor | "plus" | "minus" | "perm" | "num" | "undefined";

type TreeNode={
    isBinaryOp: false,
    opType: "plus" | "minus" | "perm" ,
    value?: number,
    leftChild: TreeNode,
} | {
    isBinaryOp: false,
    opType: "num",
    value: number,
} | {
    isBinaryOp: false,
    opType: "undefined",
} | {
    isBinaryOp: true,
    opType: ArthematicOpertor,
    value?: number,
    leftChild: TreeNode,
    rightChild: TreeNode,
};

type Left = {isLeft: true,leftTree?: TreeNode} | {isLeft: false, leftTree: TreeNode}

type LeftWithPrevOp = Left & {
    prevOpe?: Token.Add | Token.Sub | Token.Multi | Token.Divide | Token.Caret 
}

function getOpeTypePrecedence(opType: AllOpType){
    switch(opType){
        case "power": return 3;
        case "modulus": return 2
        case "multi": return 2;
        case "div": return 2;
        case "add": return 1;
        case "sub": return 1;
        default: return 0;
    }   
}

function add(x: number,y: number){
    return x+y;
}

function sub(x: number,y: number){
    return x-y;
}

function mult(x: number,y: number){
    return x*y;
}

function div(x: number,y: number){
    return x/y;
}

function modulus(x: number, y: number){
    return x%y;
}

function pow(x: number,y: number){
    return Math.pow(x,y);
}

function num(x: string | number){
    return Number(x);
}

function minus(x: number){
    return -1*x;
}

function plus(x: number){
    return -1*x;
}

function perm(x: number){
    return x;
}

const getFun  = {
    "add":add,
    "sub":sub,
    "multi":mult,
    "div":div,
    "modulus": modulus, 
    "power":pow,
    "num":num,
    "minus": minus,
    "plus":plus,
    "perm":perm,
}


function getParsedTokens(input: string): TokenObj[] | Error{
    const tokens: TokenObj[]=[];
    input = input.replace(/\s/g,'');
    const tokenChars = input.split('') as Array<ValidChars>
    let i=0;
    while(i<tokenChars.length){
        const char= tokenChars[i];
        let validToken: undefined | Token = undefined;
        let n= Number(char);
        if(char && !Number.isNaN(n)){
            let j=i+1;
            let value = char;
            let nextChar = tokenChars[j];
            let nextCharNumber = Number(nextChar);
            let isFloating = false;
            let isLastCommaChar =false
            while(nextChar && (!Number.isNaN(nextCharNumber) || (nextChar === '.' && !isFloating  && !isLastCommaChar ) || (nextChar === ',' && !isFloating && !isLastCommaChar))){
                // n=n*10 + nextCharNumber;
                if(nextChar != ','){
                    value += nextChar;
                    isLastCommaChar = false
                }else{
                    isLastCommaChar = true;
                }
                isFloating = isFloating || nextChar == '.';
                j++
                i++;
                nextChar = tokenChars[j];
                nextCharNumber = Number(nextChar);
            };
            validToken = Token.Num;
            tokens.push({
                token: validToken,
                data: Number(value),
            })
        }else {
            switch(char){
                case TokenValue.Pluse : {
                    validToken = Token.Add
                    break;
                };
                case TokenValue.Minus : {
                    validToken = Token.Sub
                    break;
                };
                case TokenValue.Star : {
                    validToken = Token.Multi
                    if(i<tokenChars.length-1){
                        const nextChar = tokenChars[i+1];
                        if(char + nextChar === TokenValue.Caret){
                            validToken = Token.Caret;
                            i++;
                        }
                    }
                    break;   
                };
                case TokenValue.ForwardSlash : {
                    validToken = Token.Divide
                    break;   
                };
                case TokenValue.Caret : {
                    validToken = Token.Caret
                    break;   
                };
                case TokenValue.Modulus : {
                    validToken = Token.Modulus
                    break;   
                };
                case TokenValue.LeftPerm : {
                    validToken = Token.LeftPerm
                    break;   
                };
                case TokenValue.RightPerm : {
                    validToken = Token.RightPerm
                    break;   
                };
                default: {
                    // console.log("invalid char ",char)
                    return Error("Invalid expression")
                }
            }
            if(validToken){
                tokens.push({
                    token: validToken as Exclude<Token, Token.Num>,
                })
            }
        }
        i++;
    }
    return tokens;
}

function getInnerTokens(tokenObjs: TokenObj[]){
    let internalTokens: TokenObj[]=[];
    let pt= tokenObjs.shift();
    let no_of_left = 0;
    while(pt && (pt.token != Token.RightPerm || no_of_left>0)){
        internalTokens.push(pt);
        if(pt.token == Token.LeftPerm){
            no_of_left++;
        }else if(pt.token == Token.RightPerm){
            no_of_left--;
        }
        pt = tokenObjs.shift();
    }
    return internalTokens;
}

function getArthematicOpertor(token:ArthematicToken):ArthematicOpertor{
    switch(token){
        case Token.Add : {
            return "add"
        };
        case Token.Sub : {
            return "sub"
        };
        case Token.Multi : {
            return 'multi'
        };
        case Token.Divide : {
            return "div"
        };
        case Token.Caret : {
            return "power"
        };
        case Token.Modulus : {
            return "modulus"
        };
    }
}

function getAbstractTree(tokenObjs: TokenObj[], left : LeftWithPrevOp = { isLeft: true }  ): TreeNode{
    let tokenObj= tokenObjs.shift();
    // let len = tokenObjs.length;
    const {isLeft, prevOpe } = left;
    if(!tokenObj){
        return {
            isBinaryOp: false,
            opType: "undefined",
        }
    }
    if(tokenObj.token == Token.LeftPerm){

        const internalTokens: TokenObj[]= getInnerTokens(tokenObjs)
        const ast: TreeNode = getAbstractTree(internalTokens);
        const currentTreeNode: TreeNode ={
            isBinaryOp: false,
            opType: "perm",
            leftChild: ast,
        }

        if(tokenObjs.length>0){
            return getAbstractTree(tokenObjs,{ isLeft: false, leftTree:  currentTreeNode})
        }

        return currentTreeNode;
    }

    if(isLeft){
        if(tokenObj.token == Token.Num){
            const currentNode: TreeNode = {
                isBinaryOp: false,
                opType: "num",
                value: tokenObj.data
            }
            if(tokenObjs.length){
                return getAbstractTree(tokenObjs, { isLeft: false, leftTree:  currentNode});
            }
            return currentNode;
        }else if(tokenObj.token == Token.Add || tokenObj.token == Token.Sub){
            const nextTokenObj = tokenObjs.shift();
            if(nextTokenObj){
                if(nextTokenObj.token == Token.LeftPerm){
                    const internalTokens: TokenObj[]= getInnerTokens(tokenObjs)
                    const ast = getAbstractTree(internalTokens);
                    const currentTreeNode: TreeNode ={
                        isBinaryOp: false,
                        opType: tokenObj.token == Token.Add ? "plus" : "minus",
                        leftChild: ast
                    }
                    if(tokenObjs.length>0){
                        return getAbstractTree(tokenObjs,{ isLeft: false, leftTree:  currentTreeNode})
                    }
                    return currentTreeNode;
                }else if(nextTokenObj.token == Token.Num){
                    const numberNode: TreeNode = {
                        isBinaryOp: false,
                        opType: "num",
                        value: nextTokenObj.data
                    }
                    const currentTreeNode: TreeNode ={
                        isBinaryOp: false,
                        opType: tokenObj.token == Token.Add ? "plus" : "minus",
                        leftChild: numberNode
                    }
                                
                    if(tokenObjs.length>0){
                        return getAbstractTree(tokenObjs,{ isLeft: false, leftTree:  currentTreeNode})
                    }
                    return currentTreeNode;
                    }
            }
        }
        return {
            isBinaryOp: false,
            opType: "undefined",
        }
    }else{
        const token = tokenObj.token;
        if(Token.Add == token || Token.Sub == token || Token.Divide == token || Token.Multi == token || Token.Caret == token || Token.Modulus == token ){
            // const nextTokenObj = tokenObjs[0];
            const rightTree = getAbstractTree(tokenObjs);
            // if(rightTree)
            // const rightTreeToken = rightTree.opType;
            const opType = getArthematicOpertor(token);
            const presentTokenPrec = getOpeTypePrecedence(opType)
            const childTokenPrec = getOpeTypePrecedence(rightTree.opType)
            if(childTokenPrec == 0 || presentTokenPrec <= childTokenPrec)
                return {
                    isBinaryOp: true,
                    opType: opType ,
                    leftChild: left.leftTree,
                    rightChild: rightTree,
                }
            else{
                if(rightTree.isBinaryOp){
                    const currentTreeNode: TreeNode ={
                        isBinaryOp: true,
                        opType: opType ,
                        leftChild: left.leftTree,
                        rightChild: rightTree.leftChild 
                    }
                    rightTree.leftChild= currentTreeNode
                }
                return rightTree;
                
            }
        }
        return {
            isBinaryOp: false,
            opType: "undefined",
        }
    }
}

function getValueFromAST(t: TreeNode) : number{
    if(t.opType=="num"){
        return t.value;
    }
    if(t.opType == "undefined"){
        return 0;
    }

    if(t.isBinaryOp==true){
        const x=getValueFromAST(t.leftChild);
        const y=getValueFromAST(t.rightChild);
        const f=getFun[t.opType];
        return f(x,y);
    }else{
        const x=getValueFromAST(t.leftChild);
        const f=getFun[t.opType];
        return f(x);
    }
}

function preProcessStringExpression(expression: string){
    const len = expression.length;
    const newExpression: string[] = expression.split('').map((ch, i)=>{
        if(i+1<len){
            const nextCh = expression[i+1];
            const numberOfCh = Number(ch);
            const numberOfNextCh = Number(nextCh);
            if(!Number.isNaN(numberOfCh) && nextCh=='('){
                return ch+"*"
            }
            if(!Number.isNaN(numberOfNextCh) && ch==')'){
                return ")*";
            }
        }
        return ch;
    })
    let m = newExpression.join('')
    return m;
}

export function evaluate(expression: string){
    if(typeof(expression) !== "string"){
        return Error("Invalid expression type")
    }
    const tokensOrError = getParsedTokens(preProcessStringExpression(expression));
    if(tokensOrError instanceof Error){
        return tokensOrError;
    }
    if(tokensOrError.length == 0){
        return NaN
    }
    const ast = getAbstractTree(tokensOrError);
    const value = getValueFromAST(ast);
    return value
}