// Token types
const tokenTypes = [
  ['NUMBER', /\b\d+\b/],
  ['IDENTIFIER', /\b[a-zA-Z_][a-zA-Z0-9_]*\b/],
  ['OPERATOR', /\+|\-|\*|\//],
  ['PUNCTUATION', /\(|\)|\{|\}|\[|\]/],
  ['KEYWORD', /if|else|while|for|function/],
  ['WHITESPACE', /\s+/],
];

function tokenize(code) {
  const tokens = [];
  while (code.length > 0) {
    let match = null;
    for (const [tokenType, pattern] of tokenTypes) {
      const regex = new RegExp(`^${pattern.source}`);
      match = code.match(regex);
      if (match) {
        const value = match[0];
        tokens.push({ type: tokenType, value });
        code = code.slice(value.length).trimLeft();
        break;
      }
    }
    if (!match) {
      throw new Error('Invalid character: ' + code[0]);
    }
  }
  return tokens;
}

// Example JavaScript code
const javascriptCode = `
function add(a, b) {
    return a + b;
}

var result = add(3, 5);
console.log(result);
`;

// Tokenize the JavaScript code
const tokens = tokenize(javascriptCode);

// Display the tokens
for (const token of tokens) {
  console.log(token);
}

const tokenTypes = [
  'NUMBER',
  'IDENTIFIER',
  'OPERATOR',
  'PUNCTUATION',
  'KEYWORD',
  'WHITESPACE',
];

let tokens = [];
let currentTokenIndex = 0;

function parseExpression(tokens) {
  const term = parseTerm(tokens);
  if (match(tokens, 'OPERATOR', '+')) {
    consume(tokens);
    const expression = parseExpression(tokens);
    return { type: 'BinaryExpression', operator: '+', left: term, right: expression };
  }
  return term;
}

function parseTerm(tokens) {
  const factor = parseFactor(tokens);
  if (match(tokens, 'OPERATOR', '*')) {
    consume(tokens);
    const term = parseTerm(tokens);
    return { type: 'BinaryExpression', operator: '*', left: factor, right: term };
  }
  return factor;
}

function parseFactor(tokens) {
  if (match(tokens, 'NUMBER')) {
    return { type: 'Literal', value: consume(tokens).value };
  } else if (match(tokens, 'IDENTIFIER')) {
    return { type: 'Identifier', name: consume(tokens).value };
  } else if (match(tokens, 'PUNCTUATION', '(')) {
    consume(tokens); // Consume '('
    const expression = parseExpression(tokens);
    if (!match(tokens, 'PUNCTUATION', ')')) {
      throw new Error("Expected ')'");
    }
    consume(tokens); // Consume ')'
    return expression;
  } else {
    throw new Error('Unexpected token: ' + tokens[currentTokenIndex].value);
  }
}

function match(tokens, expectedType, expectedValue) {
  const token = tokens[currentTokenIndex];
  return token && token.type === expectedType && (expectedValue === undefined || token.value === expectedValue);
}

function consume(tokens) {
  return tokens[currentTokenIndex++];
}

// Example JavaScript code
const javascriptCode = '2 * (3 + 4)';

// Tokenize the JavaScript code
tokens = tokenize(javascriptCode);

// Parse the expression
const parsedExpression = parseExpression(tokens);

// Display the parsed expression
console.log(parsedExpression);

function performSemanticAnalysis(parsedAST) {
  const symbolTable = {};

  function analyzeNode(node, currentScope) {
    if (node.type === 'VariableDeclaration') {
      handleVariableDeclaration(node, currentScope);
    } else if (node.type === 'BlockStatement') {
      // Create a new scope for block statements
      const newScope = { parent: currentScope, variables: {} };
      for (const statement of node.body) {
        analyzeNode(statement, newScope);
      }
    } else if (node.type === 'Identifier') {
      handleIdentifier(node, currentScope);
    } else if (node.type === 'BinaryExpression') {
      analyzeNode(node.left, currentScope);
      analyzeNode(node.right, currentScope);
    }
    // Add more semantic analysis rules for other node types as needed
  }

  function handleVariableDeclaration(declaration, scope) {
    const variableName = declaration.identifier.name;
    if (scope.variables[variableName]) {
      throw new Error(`Variable '${variableName}' is already declared in this scope.`);
    }
    scope.variables[variableName] = true;
  }

  function handleIdentifier(identifier, scope) {
    const variableName = identifier.name;
    if (!findVariableInScope(variableName, scope)) {
      throw new Error(`Variable '${variableName}' is not defined.`);
    }
  }

  function findVariableInScope(variableName, scope) {
    if (scope.variables[variableName]) {
      return true;
    } else if (scope.parent) {
      return findVariableInScope(variableName, scope.parent);
    }
    return false;
  }

  // Start analyzing the AST
  analyzeNode(parsedAST, { variables: {} });

  console.log('Semantic analysis passed successfully.');
}

// Example AST (Abstract Syntax Tree)
const parsedAST = {
  type: 'Program',
  body: [
    {
      type: 'VariableDeclaration',
      identifier: { type: 'Identifier', name: 'x' },
    },
    {
      type: 'BlockStatement',
      body: [
        {
          type: 'VariableDeclaration',
          identifier: { type: 'Identifier', name: 'y' },
        },
        {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Identifier', name: 'x' },
          right: { type: 'Identifier', name: 'y' },
        },
      ],
    },
  ],
};

// Perform semantic analysis
performSemanticAnalysis(parsedAST);

function translateToLLVMIR(ast) {
  let llvmIR = '';

  function translateNode(node) {
    if (node.type === 'Program') {
      for (const statement of node.body) {
        translateNode(statement);
      }
    } else if (node.type === 'VariableDeclaration') {
      llvmIR += `%${node.identifier.name} = alloca i32\n`;
    } else if (node.type === 'BlockStatement') {
      for (const statement of node.body) {
        translateNode(statement);
      }
    } else if (node.type === 'BinaryExpression') {
      const left = translateExpression(node.left);
      const right = translateExpression(node.right);
      llvmIR += `%${node.resultVar} = ${getLLVMOperator(node.operator)} i32 ${left}, ${right}\n`;
    }
    // Add more translation rules for other node types as needed
  }

  function translateExpression(expression) {
    if (expression.type === 'Identifier') {
      return `%${expression.name}`;
    } else if (expression.type === 'Literal') {
      return expression.value;
    }
    // Add more expression translation rules for other node types as needed
  }

  function getLLVMOperator(operator) {
    // Map JavaScript operators to LLVM operators (simplified for this example)
    const operatorMap = {
      '+': 'add',
      '-': 'sub',
      '*': 'mul',
      '/': 'sdiv',
    };
    return operatorMap[operator];
  }

  // Start translating the AST
  translateNode(ast);

  return llvmIR;
}

// Example AST (Abstract Syntax Tree)
const parsedAST = {
  type: 'Program',
  body: [
    {
      type: 'VariableDeclaration',
      identifier: { type: 'Identifier', name: 'x' },
    },
    {
      type: 'BlockStatement',
      body: [
        {
          type: 'VariableDeclaration',
          identifier: { type: 'Identifier', name: 'y' },
        },
        {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Identifier', name: 'x' },
          right: { type: 'Literal', value: '5' },
          resultVar: 'z',
        },
      ],
    },
  ],
};

// Translate AST to LLVM IR
const llvmIR = translateToLLVMIR(parsedAST);

// Display the LLVM IR
console.log(llvmIR);

