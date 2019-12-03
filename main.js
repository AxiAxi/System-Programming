const SIGNS = {
    '+': 'ADDITION',
    '-': 'SUBTRACTION',
    '*': 'MULTIPLICATION',
    '/': 'DIVISION',
    '%': 'MODULUS',
    '=': 'EQUALIZATION',
    '<>': 'NOT EQUAL',
    '>': 'GREATER',
    '<': 'LESS',
    '>=': 'GREATER OR EQUAL',
    '<=': 'LESS OR EQUAL',
    '&': 'BINARY AND',
    '|': 'BINARY OR',
    '!': 'BINARY NOT',
    '~': 'BINARY ONES COMPLEMENT',
    '<<': 'BINARY LEFT SHIFT',
    '>>': 'BINARY RIGHT SHIFT',
    ';': 'SEMICOLON',
    ':=': 'ASSIGNMENT',
    '..': 'VALUE RANGE',
    ',': 'COMMA',
    '.': 'DOT',
    ':': 'COLON',
    '[': 'OPENING SQUARE BRACKET',
    ']': 'CLOSING SQUARE BRACKET',
    '{': 'OPENING BRACE',
    '}': 'CLOSING BRACE',
    '(': 'OPENING PARENTHESIS',
    ')': 'CLOSING PARENTHESIS'
};

const TYPES = {
    'char': 'CHARACTER',
    'widechar': 'CHARACTER',
    'pchar': 'CHARACTER',
    'string': 'STRING',
    'shortstring': 'STRING',
    'ansistring': 'STRING',
    'widestring': 'STRING',
    'boolean': 'BOOLEAN',
    'bytebool': 'BOOLEAN',
    'wordbool': 'BOOLEAN',
    'longbool': 'BOOLEAN',
    'integer': 'INTEGER',
    'byte': 'INTEGER',
    'shortint': 'INTEGER',
    'smallint': 'INTEGER',
    'word': 'INTEGER',
    'cardinal': 'INTEGER',
    'longint': 'INTEGER',
    'longword': 'INTEGER',
    'int64': 'INTEGER',
    'qword': 'INTEGER',
    'real': 'REAL',
    'single': 'REAL',
    'double': 'REAL',
    'extended': 'REAL',
    'comp': 'REAL',
    'currency': 'REAL'
};

const SIGNS_FOR_ASM = {
    '+': 'add eax, ',
    '-': 'sub eax, ',
    '*': 'imul eax, ',
    '/': 'idiv ',
    '<>': 'cmovne',
    '>=': 'cmovge',
    '<=': 'cmovle',
    '=': 'cmove',
    '>': 'cmovg',
    '<': 'cmovl'
};

const OPENING_BRACKETS = ['[', '{', '('];

const CLOSING_BRACKETS = [']', '}', ')'];

const COMMON_SIGNS = ['+', '-', '*', '/', '%', '=', '<>', '>=', '<=', '&', '|', '!', '~', '<<', '>>', '..', '.'];

const parenthesisComparison = (openingP, closingP) => {
    
    if ((openingP === OPENING_BRACKETS[0]) && (closingP === CLOSING_BRACKETS[0])) {
        return true;
    } else if ((openingP === OPENING_BRACKETS[1]) && (closingP === CLOSING_BRACKETS[1])) {
        return true;
    } else if ((openingP === OPENING_BRACKETS[2]) && (closingP === CLOSING_BRACKETS[2])) {
        return true;
    } else {
        return false;
    };
};

const variableVerification = variable => {
    
    if (variable.length === 0) {
        console.error('[EXCEPTION] Empty statement.');
        return false;
    };
    
    let equilibrium = [];
    let isParenthesisFound = false;
    let lastParenthesisIndex = 0;
    for (let i = 0; i < variable.length; i++) {
        if (OPENING_BRACKETS.includes(variable[i])) {
            equilibrium.push(variable[i]);
            isParenthesisFound = true;
            lastParenthesisIndex = i;
        };
        if (CLOSING_BRACKETS.includes(variable[i])) {
            if (equilibrium.length !== 0) {
                if (parenthesisComparison(equilibrium[equilibrium.length - 1], variable[i])) {
                    equilibrium.splice(equilibrium.length - 1);
                };
            } else {
                console.error(`[EXCEPTION] Wrong statement: ${variable}\nCheck your parenthesis.`);
                return false;
            };
            if ((i - lastParenthesisIndex) === 1) {
                console.error(`[EXCEPTION] Wrong statement: ${variable}\nCheck your parenthesis.`);
                return false;
            };
        };
    };
    
    if (equilibrium.length !== 0) {
        console.error(`[EXCEPTION] Wrong statement: ${variable}\nCheck your parenthesis.`);
        return false;
    };
    
    if ((/[а-яА-ЯёЁґҐєЄіІїЇ]+/g).test(variable) || (/[0-9]+[a-zA-Z]+/g).test(variable)) {
        console.error('[EXCEPTION] Forbidden symbols in the statement: ' + variable);
        return false;
    };
    
    if (COMMON_SIGNS.includes(variable[variable.length - 1])) {
        console.error('[EXCEPTION] Forbidden symbols in the statement: ' + variable);
        return false;
    };
    
    if (isParenthesisFound) {
        const parenthesisInside = variable.match(/(?<=\[).+?(?=\])/);
        if ((/[^A-Za-z0-9\(\)\[\]{}]/).test(parenthesisInside)) {
            console.error('[EXCEPTION] Wrong statement inside brackets: ' + parenthesisInside);
            return false;
        };
    };
    
    if (!isParenthesisFound) {
        if (!(variable in SIGNS)) {
            return true;
        } else {
            console.error('[EXCEPTION] Wrong statement: ' + variable);
            return false;
        };
    };
    
    return true;
};

const completeVerification = variable => {

    if (variableVerification(variable)) {
        for (let i = 0; i < variable.length; i++) {
            if (COMMON_SIGNS.includes(variable[i])) {
                try {
                    if (((variable[i - 1] in SIGNS) && !(OPENING_BRACKETS.includes(variable[i - 1])) && !(CLOSING_BRACKETS.includes(variable[i - 1])))
                    &&
                    ((variable[i + 1] in SIGNS) && !(OPENING_BRACKETS.includes(variable[i + 1])) && !(CLOSING_BRACKETS.includes(variable[i + 1])))) {
                        console.error('[EXCEPTION] Wrong statement: ' + variable);
                        return false;
                    };
                } catch (error) {
                    console.error('[EXCEPTION] Wrong statement: ' + variable);
                    return false;
                };
            };
        };
    } else {
        return false;
    };

    return true;
};

const finalVerification = EXPRESSION => {
    
    let ASM_CODE = 'xor eax, eax\nxor ebx, ebx\nxor ecx, ecx\nxor edx, edx\n\nxor r8, r8\nmov r8, 1\n\n';
    
    if (EXPRESSION.replace(/ /g, '').length === 0) {
        console.error('[EXCEPTION] Empty statement.');
        return;
    };
    
    EXPRESSION = EXPRESSION.toLowerCase();
    
    if ((EXPRESSION.replace(/ /g, '').slice(0, 3) !== 'var') || (EXPRESSION[EXPRESSION.indexOf('var') + 3] !== ' ')) {
        console.error('[EXCEPTION] Wrong statement. Variable declaration expected but expression found. [0]');
        return;
    };
    
    EXPRESSION = EXPRESSION.replace('var', '');
    
    const expressionParts = EXPRESSION.replace(/[;]/g, ';¬').split('¬').filter(expressionPart => expressionPart);
    
    const variableDefinitionParts = [];
    
    for (let part of expressionParts) {
        for (let type in TYPES) {
            if (part.includes(type)) {
                variableDefinitionParts.push(part);
                break;
            };
        };
    };
    
    const variableExecutionParts = expressionParts.filter(part => !variableDefinitionParts.includes(part));
    
    const variableDefinitionPartsIndices = [];
    
    for (let part of variableDefinitionParts) {
        variableDefinitionPartsIndices.push(EXPRESSION.indexOf(part));
    };
    
    const variableExecutionPartsIndices = [];
    
    for (let part of variableExecutionParts) {
        variableExecutionPartsIndices.push(EXPRESSION.indexOf(part));
    };
    
    for (let index of variableDefinitionPartsIndices) {
        for (let indexToCheck of variableExecutionPartsIndices) {
            if (index > indexToCheck) {
                console.error(`[EXCEPTION] Wrong statement. Variable declaration expected but expression found. [${index + 3}]`);
                return;
            };
        };
    };
    
    for (let part of variableExecutionParts) {
        
        let [variableExecutionPartHead, variableExecutionPartBody] = [];
        let assignmentCounter = 0;
        
        for (let assignment of [':=', '<>', '>=', '<=', '=', '>', '<']) {
            if (part.includes(assignment)) {
                [variableExecutionPartHead, variableExecutionPartBody] = part.split(assignment);
                assignmentCounter++;
                break;
            };
        };
        
        if (assignmentCounter === 0) {
            console.error('[EXCEPTION] Missing assignment sign in the statement: ' + part);
            return;
        };
        
        if (/[<,.>:;"'|/`~!@#$%^&?*-+=]/.test(variableExecutionPartHead)) {
            console.error('[EXCEPTION] Unknown expression: ' + variableExecutionPartHead);
            return;
        };
        
        if (variableExecutionPartBody.replace(/ /g, '')[variableExecutionPartBody.replace(/ /g, '').length - 1] !== ';') {
            console.error(`[EXCEPTION] Missing semicolon at the end of the statement. [${EXPRESSION.indexOf(variableExecutionPartBody) + variableExecutionPartBody.length - 1 + 3}]`);
            return;
        };
        
        if (!(completeVerification(variableExecutionPartHead))) {
            return;
        };
        
        if (!(completeVerification(variableExecutionPartBody))) {
            return;
        };
    };
    
    const EXPRESSION_VARIABLES = {};
    
    for (let part of variableDefinitionParts) {
        
        let typeKeywordCounter = 0;
        let typeKeywordRepeatCheck = false;
        let partTypeKeyword;
        
        for (let type in TYPES) {
            if (part.includes(type)) {
                typeKeywordCounter++;
                partTypeKeyword = type;
                if (part.indexOf(type) !== part.lastIndexOf(type)) {
                    typeKeywordRepeatCheck = true;
                    break;
                };
            };
        };
        
        if (typeKeywordCounter !== 1 || typeKeywordRepeatCheck) {
            console.error('[EXCEPTION] Wrong statement: ' + part);
            return;
        };
        
        if (!(part.includes(':')) || (part.indexOf(':') !== part.lastIndexOf(':'))) {
            console.error('[EXCEPTION] Unknown expression: ' + part);
            return;
        };
        
        let [variableDefinition, typeDefinition] = part.split(':');
        let isArray = false;
        let arraySize;
        
        if (typeDefinition.replace(/ /g, '').replace(/[;]/, '') in TYPES) {
            if ((EXPRESSION.replace(/ /g, '')[EXPRESSION.replace(/ /g, '').indexOf(typeDefinition.replace(/ /g, '').replace(/[;]/, '')) - 1] !== ':') 
            || 
            (EXPRESSION.replace(/ /g, '')[EXPRESSION.replace(/ /g, '').indexOf(typeDefinition.replace(/ /g, '').replace(/[;]/, '')) + typeDefinition.replace(/ /g, '').replace(/[;]/, '').length] !== ';')) {
                console.error('[EXCEPTION] Unknown expression: ' + part);
                return;
            };
        } else if (typeDefinition.replace(/ /g, '').slice(0, 9) === 'array[0..') {
            isArray = true;
            if (!(typeDefinition.includes(']')) || (typeDefinition.indexOf(']') !== typeDefinition.lastIndexOf(']'))) {
                console.error(`[EXCEPTION] Wrong statement: ${part}\nCheck your parenthesis.`);
                return;
            };
            if (isNaN(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']')))) {
                console.error(`[EXCEPTION] Unexpected type of number. "INTEGER" type expected. Got expression instead. [${EXPRESSION.indexOf(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))) + 3}]`);
                return;
            } else if (`${parseInt(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']')))}` !== typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))) {
                console.error(`[EXCEPTION] Unexpected type of number "${typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))) + 3}]`);
                return;
            };
            if (parseInt(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))) < 1) {
                console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))) + 3}]`);
                return;
            };
            arraySize = parseInt(typeDefinition.replace(/ /g, '').slice(9, typeDefinition.replace(/ /g, '').indexOf(']'))) + 1;
            if (typeDefinition.replace(/ /g, '').slice(typeDefinition.replace(/ /g, '').indexOf(']') + 1, typeDefinition.replace(/ /g, '').indexOf(']') + 3) !== 'of') {
                console.error('[EXCEPTION] Unknown expression: ' + part);
                return;
            };
            if (!(typeDefinition.replace(/ /g, '').replace(/[;]/, '').slice(typeDefinition.replace(/ /g, '').indexOf('of') + 2) in TYPES)) {
                console.error('[EXCEPTION] Unknown expression: ' + part);
                return;
            };
            if ((typeDefinition[typeDefinition.indexOf(partTypeKeyword) - 1] !== ' ') || typeDefinition[typeDefinition.indexOf(partTypeKeyword) + partTypeKeyword.length] !== ';') {
                console.error('[EXCEPTION] Unknown expression: ' + part);
                return;
            };
        } else {
            console.error('[EXCEPTION] Unknown expression: ' + part);
            return;
        };
        
        const variables = variableDefinition.replace(/ /g, '').split(',');
        
        for (variable of variables) {
            if (/[\~\'\`\₴\!\@\"\#\№\$\;\%\^\:\&\?\*\(\)\_\-\+\=\/\{\[\}\]\|\\\<\,\>\.]/.test(variable)) {
                console.error('[EXCEPTION] Unknown expression: ' + variable);
                return;
            };
            if (!(completeVerification(variable))) {
                return;
            };
        };
        
        for (variable of variables) {
            if ((variable in EXPRESSION_VARIABLES) || (`${variable}[]` in EXPRESSION_VARIABLES)) {
                console.error(`[EXCEPTION] Unexpected variable declaration. Variable "${variable}" has already been declared. [${EXPRESSION.indexOf(variable) + 3}]`);
                return;
            } else if (isArray) {
                EXPRESSION_VARIABLES[`${variable}[]`] = {
                    type: TYPES[partTypeKeyword],
                    nextType: partTypeKeyword,
                    definition: 'ARRAY',
                    size: arraySize,
                    value: Array(arraySize).fill(0)
                };
            } else {
                EXPRESSION_VARIABLES[variable] = {
                    type: TYPES[partTypeKeyword],
                    nextType: partTypeKeyword,
                    value: 0
                };
            };
        };
    };
    
    for (let part of variableExecutionParts) {
        let [variableExecutionPartHead, variableExecutionPartBody] = [];
        let isArrayForASM = false;
        let arrayIndexForASM;
        let signForASM;
        for (let assignment of [':=', '<>', '>=', '<=', '=', '>', '<']) {
            if (part.includes(assignment)) {
                [variableExecutionPartHead, variableExecutionPartBody] = part.replace(/ /g, '').split(assignment);
                signForASM = assignment;
                break;
            };
        };
        
        if (!(variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES)) {
            console.error(`[EXCEPTION] Variable "${variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')}" is not defined. [${EXPRESSION.indexOf(part) + 3}]`);
            return;
        };
        
        if (EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
            const parenthesisInside = variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g).join();
            isArrayForASM = true;
            if (!(isNaN(parenthesisInside))) {
                if ((parseInt(parenthesisInside) < 0) || (parseInt(parenthesisInside) >= EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                    console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                    return;
                };
                arrayIndexForASM = parenthesisInside;
            } else {
                if (!(parenthesisInside in EXPRESSION_VARIABLES)) {
                    console.error(`[EXCEPTION] Variable "${parenthesisInside}" is not defined. [${EXPRESSION.indexOf(part) + 3}]`);
                    return;
                } else if (EXPRESSION_VARIABLES[parenthesisInside].type !== 'INTEGER') {
                    console.error(`[EXCEPTION] Unexpected type. "INTEGER" type expected. Got "${EXPRESSION_VARIABLES[parenthesisInside].type}" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                    return;
                } else if ((EXPRESSION_VARIABLES[parenthesisInside].value < 0) || (EXPRESSION_VARIABLES[parenthesisInside].value >= EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                    console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                    return;
                };
                arrayIndexForASM = EXPRESSION_VARIABLES[parenthesisInside].value;
            };
        };
        
        if ((EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].type === 'INTEGER') || 
        (EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].type === 'REAL')) {
            
            const executionPartVariables = variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ' ');
            const executionPartVariablesType = EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].type;
            
            for (let element of executionPartVariables.replace(/ /g, '')) {
                if (['>', '<', '<>', '>=', '<=', '&', '|', '!', '~', '<<', '>>', "'", '"', '..', ',', ':'].includes(element)) {
                    console.error(`[EXCEPTION] Unexpected operator "${element}" occured in the statement: ${variableExecutionPartBody}`);
                    return;
                };
            };
            
            const executionPartVariablesList = executionPartVariables.split(' ').filter(executionPartVariable => executionPartVariable);
            
            for (let variable of executionPartVariablesList) {
                if (isNaN(variable)) {
                    if (!(variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES)) {
                        console.error(`[EXCEPTION] Variable "${variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                        return;
                    };
                    if ((executionPartVariablesType === 'INTEGER') && (signForASM === ':=')) {
                        if (EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].type !== executionPartVariablesType) {
                            console.error(`[EXCEPTION] Incompatible type of variable "${variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')}": got "${EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].type}" instead of "${executionPartVariablesType}". [${EXPRESSION.indexOf(part) + 3}]`);
                            return;
                        };
                    } else {
                        if ((EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].type !== 'INTEGER') && 
                        (EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].type !== 'REAL')) {
                            console.error(`[EXCEPTION] Incompatible type of variable "${variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')}": got "${EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].type}" instead of "INTEGER" or "REAL". [${EXPRESSION.indexOf(part) + 3}]`);
                            return;
                        };
                    };
                    if (EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                        const parenthesisInside = variable.match(/(?<=\[).+?(?=\])/g).join();
                        if (!(isNaN(parenthesisInside))) {
                            if (!(Number.isInteger(+parenthesisInside))) {
                                console.error(`[EXCEPTION] Unexpected type of number "${parenthesisInside}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                                return;
                            };
                            if ((parseInt(parenthesisInside) < 0) || (parseInt(parenthesisInside) >= EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                                console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                                return;
                            };
                        } else {
                            if (!(parenthesisInside in EXPRESSION_VARIABLES)) {
                                console.error(`[EXCEPTION] Variable "${parenthesisInside}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                return;
                            } else if (EXPRESSION_VARIABLES[parenthesisInside].type !== 'INTEGER') {
                                console.error(`[EXCEPTION] Unexpected type of variable "${parenthesisInside}". "INTEGER" type expected. Got "${EXPRESSION_VARIABLES[parenthesisInside].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                return;
                            } else if ((EXPRESSION_VARIABLES[parenthesisInside].value < 0) || (EXPRESSION_VARIABLES[parenthesisInside].value >= EXPRESSION_VARIABLES[variable.replace(variable.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                                console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                                return;
                            };
                        };
                    };
                } else {
                    if (executionPartVariablesType === 'INTEGER') {
                        if ((!(Number.isInteger(+variable))) && (signForASM === ':=')) {
                            console.error(`[EXCEPTION] Unexpected type of number "${variable}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                            return;
                        };
                    };
                };
            };
            
            let arrayIndex;
            let delimiter;
            const valuesForASM = [];
            
            if (executionPartVariablesList.length === 1) {
                if (executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                    if (EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                        arrayIndex = isNaN(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g).join()) ? EXPRESSION_VARIABLES[executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g).join()].value : parseInt(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g).join());
                        if (isArrayForASM) {
                            if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(executionPartVariablesList[0])) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM] = -EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndex];
                            } else {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM] = EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndex];
                            };
                        } else {
                            if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(executionPartVariablesList[0])) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = -EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndex];
                            } else {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndex];
                            };
                        };
                    } else {
                        if (isArrayForASM) {
                            if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(executionPartVariablesList[0])) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM] = -EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value;
                            } else {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM] = EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value;
                            };
                        } else {
                            if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(executionPartVariablesList[0])) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = -EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value;
                            } else {
                                EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].value;
                            };
                        };
                    };
                } else {
                    if (isArrayForASM) {
                        if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''))) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                            EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[parseInt(arrayIndexForASM)] = -parseFloat(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''));
                        } else {
                            EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM] = parseFloat(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''));
                        };
                    } else {
                        if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''))) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                            EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = -parseFloat(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''));
                        } else {
                            EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = parseFloat(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''));
                        };
                    };
                };
            } else {
                
                delimiter = variableExecutionPartBody[variableExecutionPartBody.indexOf(executionPartVariablesList[0]) + executionPartVariablesList[0].length];
                const variableExecutionPartBodyParts = [variableExecutionPartBody.slice(0, variableExecutionPartBody.indexOf(executionPartVariablesList[0]) + executionPartVariablesList[0].length), variableExecutionPartBody.replace(/[;]/, '').slice(variableExecutionPartBody.indexOf(executionPartVariablesList[0]) + executionPartVariablesList[0].length + 1)];
                
                for (let variable of variableExecutionPartBodyParts) {
                    if (variable.replace(/[\+\-\*\/\%]/g, '').replace(variable.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                        if (EXPRESSION_VARIABLES[variable.replace(/[\+\-\*\/\%]/g, '').replace(variable.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                            arrayIndex = isNaN(variable.replace(/[\+\-\*\/\%]/g, '').match(/(?<=\[).+?(?=\])/g).join()) ? EXPRESSION_VARIABLES[variable.replace(/[\+\-\*\/\%]/g, '').match(/(?<=\[).+?(?=\])/g).join()].value : parseInt(variable.replace(/[\+\-\*\/\%]/g, '').match(/(?<=\[).+?(?=\])/g).join());
                            if ((variable.indexOf('-') !== -1) && (variable.indexOf('-') < variable.indexOf(variable.replace(/[\+\-\*\/\%]/g, ''))) && ((variable.split('-').length - 1) % 2 !== 0)) {
                                valuesForASM.push(-EXPRESSION_VARIABLES[variable.replace(/[\+\-\*\/\%]/g, '').replace(variable.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndex]);
                            } else {
                                valuesForASM.push(EXPRESSION_VARIABLES[variable.replace(/[\+\-\*\/\%]/g, '').replace(variable.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndex]);
                            };
                        } else {
                            if ((variable.indexOf('-') !== -1) && (variable.indexOf('-') < variable.indexOf(variable.replace(/[\+\-\*\/\%]/g, ''))) && ((variable.split('-').length - 1) % 2 !== 0)) {
                                valuesForASM.push(-EXPRESSION_VARIABLES[variable.replace(/[\+\-\*\/\%]/g, '').replace(variable.match(/(?<=\[).+?(?=\])/g), '')].value);
                            } else {
                                valuesForASM.push(EXPRESSION_VARIABLES[variable.replace(/[\+\-\*\/\%]/g, '').replace(variable.match(/(?<=\[).+?(?=\])/g), '')].value);
                            };
                        };
                    } else {
                        if ((variable.indexOf('-') !== -1) && (variable.indexOf('-') < variable.indexOf(variable.replace(/[\+\-\*\/\%]/g, ''))) && ((variable.split('-').length - 1) % 2 !== 0)) {
                            valuesForASM.push(-parseFloat(variable.replace(/[\+\-\*\/\%]/g, '')));
                        } else {
                            valuesForASM.push(parseFloat(variable.replace(/[\+\-\*\/\%]/g, '')));
                        };
                    };
                };
                if (signForASM === ':=') {
                    let variableExecutionPartResult;
                    switch(delimiter) {
                        case '+': variableExecutionPartResult = valuesForASM[0] + valuesForASM[1]; break;
                        case '-': variableExecutionPartResult = valuesForASM[0] - valuesForASM[1]; break;
                        case '*': variableExecutionPartResult = valuesForASM[0] * valuesForASM[1]; break;
                        case '/': variableExecutionPartResult = valuesForASM[0] / valuesForASM[1]; break;
                    };
                    if (executionPartVariablesType === 'INTEGER') {
                        if (!(Number.isInteger(variableExecutionPartResult))) {
                            console.error(`[EXCEPTION] Unexpected type of result. "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.replace(/ /g, '').indexOf(variableExecutionPartHead) + 3}]`);
                            return;
                        };
                    };
                    if (isArrayForASM) {
                        EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM] = variableExecutionPartResult;
                    } else {
                        EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value = variableExecutionPartResult;
                    };
                };
            };
            
            if (signForASM === ':=') {
                if (executionPartVariablesList.length === 1) {
                    if (executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                        if (EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                            ASM_CODE += `mov eax, dword ptr[${executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/\[(.*?)\]/g), '')} + ${arrayIndex * 2}]\n`;
                        } else {
                            ASM_CODE += `mov eax, ${executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')}\n`;
                        };
                    } else {
                        if (isArrayForASM) {
                            ASM_CODE += `mov eax, ${EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value[arrayIndexForASM]}\n`;
                        } else {
                            ASM_CODE += `mov eax, ${EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].value}\n`;
                        };
                    };
                    if (isArrayForASM) {
                        ASM_CODE += `mov dword ptr[${variableExecutionPartHead.replace(/ /g, '').replace(variableExecutionPartHead.match(/\[(.*?)\]/g), '')} + ${arrayIndexForASM * 2}], eax\nxor eax, eax\n\n`;
                    } else {
                        ASM_CODE += `mov ${variableExecutionPartHead.replace(/ /g, '')}, eax\nxor eax, eax\n\n`;
                    };
                } else {
                    if (executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                        if (EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                            ASM_CODE += `mov eax, dword ptr[${executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/\[(.*?)\]/g), '')} + ${executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g).join() * 2}]\n`;
                        } else {
                            ASM_CODE += `mov eax, ${executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')}\n`;
                        };
                    } else {
                        ASM_CODE += `mov eax, ${valuesForASM[0]}\n`;
                    };
                    if (executionPartVariablesList[1].replace(executionPartVariablesList[1].match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                        if (EXPRESSION_VARIABLES[executionPartVariablesList[1].replace(executionPartVariablesList[1].match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                            ASM_CODE += `${SIGNS_FOR_ASM[delimiter]}dword ptr[${executionPartVariablesList[1].replace(executionPartVariablesList[1].match(/\[(.*?)\]/g), '')} + ${executionPartVariablesList[1].match(/(?<=\[).+?(?=\])/g).join() * 2}]\n`;
                        } else {
                            ASM_CODE += `${SIGNS_FOR_ASM[delimiter]}${executionPartVariablesList[1].replace(executionPartVariablesList[1].match(/(?<=\[).+?(?=\])/g), '')}\n`;
                        };
                    } else {
                        ASM_CODE += `${SIGNS_FOR_ASM[delimiter]}${valuesForASM[1]}\n`;
                    };
                    if (isArrayForASM) {
                        ASM_CODE += `mov dword ptr[${variableExecutionPartHead.replace(/ /g, '').replace(variableExecutionPartHead.match(/\[(.*?)\]/g), '')} + ${arrayIndexForASM * 2}], eax\nxor eax, eax\n\n`;
                    } else {
                        ASM_CODE += `mov ${variableExecutionPartHead.replace(/ /g, '')}, eax\nxor eax, eax\n\n`;
                    };
                };
            } else {
                if (isArrayForASM) {
                    ASM_CODE += `mov eax, dword ptr[${variableExecutionPartHead.replace(/ /g, '').replace(variableExecutionPartHead.match(/\[(.*?)\]/g), '')} + ${arrayIndexForASM * 2}]\n`;
                } else {
                    ASM_CODE += `mov eax, ${variableExecutionPartHead.replace(/ /g, '')}\n`;
                };
                if (executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                    if (EXPRESSION_VARIABLES[executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                        ASM_CODE += `mov ebx, dword ptr[${executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/\[(.*?)\]/g), '')} + ${executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g).join() * 2}]\n`;
                    } else {
                        ASM_CODE += `mov ebx, ${executionPartVariablesList[0].replace(executionPartVariablesList[0].match(/(?<=\[).+?(?=\])/g), '')}\n`;
                    };
                } else {
                    if ((variableExecutionPartBody.indexOf('-') !== -1) && (variableExecutionPartBody.indexOf('-') < variableExecutionPartBody.indexOf(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''))) && ((variableExecutionPartBody.split('-').length - 1) % 2 !== 0)) {
                        ASM_CODE += `mov ebx, ${-parseFloat(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''))}\n`;
                    } else {
                        ASM_CODE += `mov ebx, ${parseFloat(variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%]/g, ''))}\n`;
                    };
                };
                ASM_CODE += `cmp eax, ebx\n${SIGNS_FOR_ASM[signForASM]} ecx, r8\nmov flag, ecx\n`;
            };
        };
        
        if (EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].type === 'CHARACTER') {
            const executionPart = variableExecutionPartBody.replace(/[;]/, '');
            if ((executionPart.length >= 2) && ((executionPart[0] === "'") && (executionPart[executionPart.length - 1] === "'"))) {
                const executionPartText = executionPart.replace(/[']/g, '');
                if (executionPartText.length > 1) {
                    console.error(`[EXCEPTION] Unexpected type. "CHARACTER" type expected. Got "STRING" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                    return;
                };
            } else if (executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                if (!(EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type === 'CHARACTER')) {
                    console.error(`[EXCEPTION] Unexpected type. "CHARACTER" type expected. Got "${EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                    return;
                };
                if (EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                    const parenthesisInside = executionPart.match(/(?<=\[).+?(?=\])/g).join();
                    if (!(isNaN(parenthesisInside))) {
                        if (!(Number.isInteger(+parenthesisInside))) {
                            console.error(`[EXCEPTION] Unexpected type of number "${parenthesisInside}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                            return;
                        };
                        if ((parseInt(parenthesisInside) < 0) || (parseInt(parenthesisInside) >= EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                            console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                            return;
                        };
                    } else {
                        if (!(parenthesisInside in EXPRESSION_VARIABLES)) {
                            console.error(`[EXCEPTION] Variable "${parenthesisInside}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                            return;
                        } else if (EXPRESSION_VARIABLES[parenthesisInside].type !== 'INTEGER') {
                            console.error(`[EXCEPTION] Unexpected type of variable "${parenthesisInside}". "INTEGER" type expected. Got "${EXPRESSION_VARIABLES[parenthesisInside].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                            return;
                        };
                    };
                };
            } else {
                console.error(`[EXCEPTION] Unknown statement. "CHARACTER" type expected. Got expression instead: ${EXPRESSION.indexOf(variableExecutionPartBody)}`);
                return;
            };
        };
        
        if (EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].type === 'STRING') {
            const executionParts = variableExecutionPartBody.replace(/[;]/, '').replace(/[+]/g, ' ');
            for (let element of executionParts.replace(/ /g, '')) {
                if (['-', '*', '/', '%', '=', '<>', '>', '<', '>=', '<=', '&', '|', '!', '~', '<<', '>>', ";", '..', ',', '.', ':'].includes(element)) {
                    console.error(`[EXCEPTION] Unexpected operator "${element}" occured in the statement: ${variableExecutionPartBody}`);
                    return;
                };
            };
            const executionPartsList = executionParts.split(' ').filter(executionPart => executionPart);
            for (let executionPart of executionPartsList) {
                if ((executionPart.length >= 2) && ((executionPart[0] === "'") && (executionPart[executionPart.length - 1] === "'"))) {
                } else if (executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES) {
                    if (!((EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type === 'CHARACTER') || 
                    (EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type === 'STRING'))) {
                        console.error(`[EXCEPTION] Unexpected type. "CHARACTER" or "STRING" type expected. Got "${EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                        return;
                    };
                    if (EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                        const parenthesisInside = executionPart.match(/(?<=\[).+?(?=\])/g).join();
                        if (!(isNaN(parenthesisInside))) {
                            if (!(Number.isInteger(+parenthesisInside))) {
                                console.error(`[EXCEPTION] Unexpected type of number "${parenthesisInside}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                                return;
                            };
                            if ((parseInt(parenthesisInside) < 0) || (parseInt(parenthesisInside) >= EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                                console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                                return;
                            };
                        } else {
                            if (!(parenthesisInside in EXPRESSION_VARIABLES)) {
                                console.error(`[EXCEPTION] Variable "${parenthesisInside}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                return;
                            } else if (EXPRESSION_VARIABLES[parenthesisInside].type !== 'INTEGER') {
                                console.error(`[EXCEPTION] Unexpected type of variable "${parenthesisInside}". "INTEGER" type expected. Got "${EXPRESSION_VARIABLES[parenthesisInside].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                return;
                            };
                        };
                    };
                } else {
                    console.error(`[EXCEPTION] Unknown statement. "CHARACTER" or "STRING" type expected. Got expression instead: ${variableExecutionPartBody}`);
                    return;
                };
            };
        };
        
        if (EXPRESSION_VARIABLES[variableExecutionPartHead.replace(variableExecutionPartHead.match(/(?<=\[).+?(?=\])/g), '')].type === 'BOOLEAN') {
            const executionPartVariables = variableExecutionPartBody.replace(/[;]/, '').replace(/[\+\-\*\/\%\=\>\<\&\|\!\~]/g, ' ');
            for (element of executionPartVariables.replace(/ /g, '')) {
                if ([',' , ':'].includes(element)) {
                    console.error(`[EXCEPTION] Unexpected operator "${element}" occured in the statement: ${variableExecutionPartBody}`);
                    return;
                };
            };
            const executionPartVariablesList = executionPartVariables.split(' ').filter(executionPartVariable => executionPartVariable);
            for (let executionPart of executionPartVariablesList) {
                if (executionPartVariablesList.length === 1) {
                    if ((executionPart === 'true') || (executionPart === 'false')) {
                    } else if (isNaN(executionPart)) {
                        if (!(executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES)) {
                            console.error(`[EXCEPTION] Variable "${executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                            return;
                        };
                        if (EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type !== 'BOOLEAN') {
                            console.error(`[EXCEPTION] Unexpected type of variable "${executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')}". "BOOLEAN" type expected. Got "${EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                            return;
                        };
                        if (EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                            const parenthesisInside = executionPart.match(/(?<=\[).+?(?=\])/g).join();
                            if (!(isNaN(parenthesisInside))) {
                                if (!(Number.isInteger(+parenthesisInside))) {
                                    console.error(`[EXCEPTION] Unexpected type of number "${parenthesisInside}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                                    return;
                                };
                                if ((parseInt(parenthesisInside) < 0) || (parseInt(parenthesisInside) >= EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                                    console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                                    return;
                                };
                            } else {
                                if (!(parenthesisInside in EXPRESSION_VARIABLES)) {
                                    console.error(`[EXCEPTION] Variable "${parenthesisInside}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                    return;
                                } else if (EXPRESSION_VARIABLES[parenthesisInside].type !== 'INTEGER') {
                                    console.error(`[EXCEPTION] Unexpected type of variable "${parenthesisInside}". "INTEGER" type expected. Got "${EXPRESSION_VARIABLES[parenthesisInside].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                    return;
                                };
                            };
                        };
                    } else {
                        console.error(`[EXCEPTION] Unknown statement. "BOOLEAN" type expected. Got expression instead: ${variableExecutionPartBody}`);
                        return;
                    };
                } else {
                    if ((executionPart === 'true') || (executionPart === 'false')) {
                    } else if ((executionPart.length >= 2) && ((executionPart[0] === "'") && (executionPart[executionPart.length - 1] === "'"))) {
                    } else if (!(isNaN(executionPart))) {
                    } else if (isNaN(executionPart)) {
                        if (!(executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '') in EXPRESSION_VARIABLES)) {
                            console.error(`[EXCEPTION] Variable "${executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                            return;
                        };
                        if (EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].definition === 'ARRAY') {
                            const parenthesisInside = executionPart.match(/(?<=\[).+?(?=\])/g).join();
                            if (!(isNaN(parenthesisInside))) {
                                if (!(Number.isInteger(+parenthesisInside))) {
                                    console.error(`[EXCEPTION] Unexpected type of number "${parenthesisInside}". "INTEGER" type expected. Got "REAL" instead. [${EXPRESSION.indexOf(part) + 3}]`);
                                    return;
                                };
                                if ((parseInt(parenthesisInside) < 0) || (parseInt(parenthesisInside) >= EXPRESSION_VARIABLES[executionPart.replace(executionPart.match(/(?<=\[).+?(?=\])/g), '')].size)) {
                                    console.error(`[EXCEPTION] Array index is out of range. [${EXPRESSION.indexOf(parenthesisInside) + 3}]`);
                                    return;
                                };
                            } else {
                                if (!(parenthesisInside in EXPRESSION_VARIABLES)) {
                                    console.error(`[EXCEPTION] Variable "${parenthesisInside}" is not defined. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                    return;
                                } else if (EXPRESSION_VARIABLES[parenthesisInside].type !== 'INTEGER') {
                                    console.error(`[EXCEPTION] Unexpected type of variable "${parenthesisInside}". "INTEGER" type expected. Got "${EXPRESSION_VARIABLES[parenthesisInside].type}" instead. [${EXPRESSION.indexOf(variableExecutionPartBody) + 3}]`);
                                    return;
                                };
                            };
                        };
                    } else {
                        console.error(`[EXCEPTION] Unknown statement. "BOOLEAN" type expected. Got expression instead: ${variableExecutionPartBody}`);
                        return;
                    };
                };
            };
        };
    };
    console.warn(`Generated code for Pascal inline assembler:\n\n${ASM_CODE}`);
    return 'Successfully. No exceptions found.';
};

let EXPRESSION = `double *b, a[4]; char n; b:=b+a[n]; n:=n-1; n=0;`;