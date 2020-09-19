%{
  const {Arithmetic, ArithmeticOption} = require('../Interprete/Expression/Arithmetic');
  const {Relational, RelationalOption} = require('../Interprete/Expression/Relational');
  const {Access} = require('../Interprete/Expression/Access');
  const {Literal} = require('../Interprete/Expression/Literal');
  const {Declaration} = require('../Interprete/Instruction/Declaration');
  const {Logic} = require('../Interprete/Expression/Logic');
  const {Function} = require('../Interprete/Instruction/Function');
  const {Asignation} = require('../Interprete/Instruction/Asignation');
  const {If} = require('../Interprete/Instruction/If');
  const {While} = require('../Interprete/Instruction/While');
  const {doWhile} = require('../Interprete/Instruction/doWhile');
  const {Statement} = require('../Interprete/Instruction/Statement');
  //const {Switch} = require('../Interprete/Instruction/Switch');
  const {For} = require('../Interprete/Instruction/For');
  const {For2} = require('../Interprete/Instruction/For2');
  const {FunctionArray} = require('../Interprete/Instruction/FunctionArray');
  const {Condition} = require('../Interprete/Expression/Condition');
  const {Print} = require('../Interprete/Instruction/Print');
  const {Continue} = require('../Interprete/Instruction/Continue');
  const {Break} = require('../Interprete/Instruction/Break');

%}

%lex
%options case-sensitive

entero  [0-9]+
decimal {entero}"."{entero}
cadena  (\"[^"]*\")
cadenab  (\'[^']*\')
%%
\s+                   /* skip whitespace */
"//".*
[/][*][^*]*[*]+([^/\*][^*]*[*]+)*[/]


{entero}                return 'ENTERO'
{decimal}               return 'DECIMAL'
{cadena}                return 'CADENA'
{cadenab}               return 'CADENA'
"string"			    return 'STRING'
"boolean"			    return 'BOOLEAN'
"number"			    return 'NUMBER'
"type"			        return 'TYPE'
"Array"			        return 'ARRAY'
"let"			        return 'LET'
"const"			        return 'CONST'
"true"				    return 'TRUE'
"false"				    return 'FALSE'
"if"				    return 'IF'
"else"				    return 'ELSE'
"switch"			    return 'SWITCH'
"case"				    return 'CASE'
"default"			    return 'DEFAULT'
"do"				    return 'DO'
"while"				    return 'WHILE'
"for"				    return 'FOR'
"break"				    return 'BREAK'
"continue"				return 'CONTINUE'
"return"				return 'RETURN'
"console.log"	        return 'PRINT'
"graficar_ts"		    return 'GRAPH'
"function"			    return 'FUNCTION'
"void"			        return 'VOID'
"Push"			        return 'PUSH'
"Pop"			        return 'POP'
"Length"			    return 'LENGTH'
"null"			        return 'NULL'
"any"			        return 'ANY'

"+"					    return '+'
"++"				    return '++'
"-"					    return '-'
"--"				    return '--'
"/"						return '/'
"*"						return '*'
"**"			        return '*'
"%"						return '%'
"?"						return '?'
"=="					return '=='
">="					return '>='
"!="					return '!='
"<"						return '<'
"<="					return '<='
">"						return '>'
"&&"					return '&&'
"||"					return '||'
"!"						return '!'
"("						return '('
")"						return ')'
"{"						return '{'
"}"						return '}'
";"						return ';' 
":"						return ':'
"="						return '='
","						return ','

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID';
<<EOF>>		            return 'EOF'


/lex

%left '||'
%left '&&'
%left '==' '!='
%left '>=' '<=' '>' '<'
%left '+' '-'
%left '*' '/'
%left '**' '%'
%left UMENOS
%right '!'
%right '++' '--'

%start Init

%%

Init    
    : Instructions EOF { 
        return $1; 
      } 
;



Instructions
    : Instructions Instruction{
        $1.push($2);
        $$ = $1;
    }
    | Instruction{
        $$ = [$1];
    }
;



Instruction
    : IfSt {
        $$ = $1;
    }
    | WhileSt {
        $$ = $1;
    }
    | doWhileSt {
        $$ = $1;
    }
    | ForSt {
        $$ = $1;
    }
    | SwitchSt {
        $$ = $1;
    }
    | Statement {
        $$ = $1;
    }
    | PrintSt {
        $$ = $1;
    }
    | Declaration{
        $$ = $1;
    }
    | Asignation{
        $$ = $1;
    }
    | 'BREAK' ';' {
        $$ = new Break(@1.first_line, @1.first_column);
    }
    | 'CONTINUE' ';'{
        $$ = "que ubo";
    }
    | ReturnSt{ 
        
    }
    | FunctionSt {
        $$ = $1;
    }
    | FunctionArray {
        $$ = $1;
    }
    | TernarioST {
        $$ = $1;
    }
    | 
     Call ';'{
         $$ = $1;
    }
    
;




ReturnSt 
    : 'RETURN' ';' {
        $$ = "return";
    }
    | 'RETURN' Expr ';'{
         $$ = $2;
    }
    | 'RETURN' Call {
         $$ = $2;
    }
;  




Call
    : ID '(' ')' ';' {
        $$ = new Call($1, [], @1.first_line, @1.first_column);
    }
    | ID '(' ListaExpr ')' ';' {
        $$ = new Call($1, $3, @1.first_line, @1.first_column);
    }
;




FunctionArray
    : ID '.' 'LENGTH' '(' ')' ';'  {
        $$ = new Call($1,null,"Length",1, @1.first_line, @1.first_column);
    }
    | ID '.' 'PUSH' '(' Expr ')' ';'  {
        $$ = new Call($1,$5,"push",2, @1.first_line, @1.first_column);
    }
    | ID '.' 'POP' '(' ')' ';'  {
        $$ = new Call($1,null,"pop",3, @1.first_line, @1.first_column);
    }
;




ListaExpr 
    : ListaExpr ',' Expr{
        $1.push($3);
        $$ = $1;
    }
    | Expr{
        $$ = [$1];
    }
;    




FunctionSt 
    : 'FUNCTION' ID '(' ')' Statement {
        $$ = new Function($2, $5, [], @1.first_line, @1.first_column);
    }
    | 'FUNCTION' ID '(' Parametros ')' Statement {
        $$ = new Function($2, $6, $4, @1.first_line, @1.first_column);
    }
;




Parametros
    : Parametros ',' ID {
        $1.push($3);
        $$ = $1;
    }
    | ID{
        $$ = [$1];
    }
;




Declaration  
    :
    'LET' ID ';' 
    {
        $$ = new Declaration($1, null, @1.first_line, @1.first_column,null);
    }
    |
    'LET' ID '=' Expr ';' 
    {
        $$ = new Declaration($1, $4, @1.first_line, @1.first_column,null);
    }
    |'LET' ID  ':' Tipo '=' Expr ';'
    {
        $$ = new Declaration($1, $6, @1.first_line, @1.first_column,$4);
    }
    |'LET' ID  ':' Tipo ';'
    {
        $$ = new Declaration($1, null, @1.first_line, @1.first_column,$4);
    }
    |'CONST' ID '=' Expr ';'
    {
        $$ = new Declaration($1, $4, @1.first_line, @1.first_column,null);
    }
    |'CONST' ID  ':' Tipo '=' Expr  ';'
    {
        $$ = new Declaration($1, $6, @1.first_line, @1.first_column,$4);
    }
    
;




Asignation
    :ID '=' Expr ';'
    {
        $$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
    } 
    | ID '++' ';'
    { 
        $$ = new Asignation($1, $3, @1.first_line, @1.first_column,2);
    }
    | ID '--' ';'
    { 
        $$ = new Asignation($1, $3, @1.first_line, @1.first_column,3);
    }  
;




Tipo  
    : 
     NUMBER
    { 
        $$ = 0;
    }
    | STRING
    { 
        $$ = 1;
    }
    
    | BOOLEAN
    {
        $$ = 2;
    }
    | ARRAY
    {
        $$ = 4;
    }   
    | VOID
    {
        $$ = 5;
    }   
    | ANY
    {
        $$ = 6;
    } 
;




IfSt
    : 'IF' '(' Expr ')' Statement ElseSt{
        $$ = new If($3, $5, $6, @1.first_line, @1.first_column);
    }
;




ElseSt
    : 'ELSE' Statement {
        $$ = $2;
    }
    | 'ELSE' IfSt {
        $$ = $2;
    }
    | /* epsilon */
    {
        $$ = null;
    }
;




WhileSt
    : 'WHILE' '(' Expr ')' Statement{
        $$ = new While($3, $5, @1.first_line, @1.first_column);
    }
;



doWhileSt
    : 'DO' Statement 'WHILE' '(' Expr ')' ';' {
         $$ = new doWhile($5, $2, @1.first_line, @1.first_column);
    }
;


SwitchSt
    : 'SWITCH' '(' Expr ')' '{' CaseSt'}'{
       $$ = new Switch($3, $6, @1.first_line, @1.first_column);
    }
;



CaseSt
 : CaseSt CaseEvalSt{
        
  }
  |CaseEvalSt{

  }  
;



CaseEvalSt

: 'CASE' Expr ':' Instructions{
  
}
| 'CASE' Expr ':' {
       
}
| 'DEFAULT' ':' Instructions{
       
}
| 'DEFAULT' ':' {
       
}

;



ForSt
: 'FOR' '(' Expr';'Expr';' AsignationFor')' Statement{
    $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
}
| 'FOR' '(' DeclarationFor';'Expr';' AsignationFor')' Statement{
   $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column);
}
| 'FOR' '(' DeclarationFor 'in' Expr ')' Statement{
   $$ = new For2($3, $5, $7, @1.first_line, @1.first_column);
}
| 'FOR' '(' Expr 'in' Expr ')' Statement{
   $$ = new For2($3, $5, $7, @1.first_line, @1.first_column);
}
| 'FOR' '(' DeclarationFor 'for' Expr ')' Statement{
   $$ = new For2($3, $5, $7,  @1.first_line, @1.first_column);
}
| 'FOR' '(' Expr 'for' Expr ')' Statement{
   $$ = new For2($3, $5, $7, @1.first_line, @1.first_column);
}
;



DeclarationFor  
    :'LET' ID '=' Expr  
    {
        $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null);
    }
    |'LET' ID  ':' Tipo '=' Expr 
    {
        $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4);
    }
    |'CONST' ID '=' Expr 
    {
        $$ = new Declaration($2, $4, @1.first_line, @1.first_column,null);
    }
    |'CONST' ID  ':' Tipo '=' Expr 
    {
        $$ = new Declaration($2, $6, @1.first_line, @1.first_column,$4);
    }
    
;



AsignationFor
    :ID '=' Expr 
    {
        $$ = new Asignation($1, $3, @1.first_line, @1.first_column,1);
    } 
    | ID '++' 
    { 
        $$ = new Asignation($1, null, @1.first_line, @1.first_column,2);
    }
    | ID '--' 
    { 
        $$ = new Asignation($1, null, @1.first_line, @1.first_column,3);
    }  
;



Statement
    : '{' Instructions '}' {
        $$ = new Statement($2, @1.first_line, @1.first_column);
    }
    | '{' '}' {
        $$ = new Statement(new Array(), @1.first_line, @1.first_column);
    }
;



PrintSt 
    : 'console.log' '(' Expr ')' ';' {
        $$ = new Print($3, @1.first_line, @1.first_column);
        //agregar imprimir 
    }
;


TernarioST

    : Expr '?' Expr ':' Expr ';'
    {
        $$ = new Condition($1, $3, $5,CondOption.TERN ,@1.first_line, @1.first_column);
    }
    |
     ID '(' ')' '?' Expr ':' Expr ';'
    {
        $$ = new Condition($1, $5, $7,CondOption.TERN ,@1.first_line, @1.first_column);
    }
    |
     ID '(' ListaExpr ')' '?' Expr ':' Expr ';'
    {
        $$ = new Condition($1, $5, $7,CondOption.TERN ,@1.first_line, @1.first_column);
    }
    ;


Expr
    : '-' Expr % UMENOS
    {
        $$ = new Arithmetic($1, null, ArithmeticOption.PLUS, @1.first_line,@1.first_column);
    } 
    |'!' Expr
    {
        $$ = new Logic($1, null, LogicOption.NOT, @1.first_line,@1.first_column);
    }
    |Expr '+' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.PLUS, @1.first_line,@1.first_column);
    }       
    | Expr '-' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MINUS, @1.first_line,@1.first_column);
    }
    | Expr '*' Expr
    { 
        $$ = new Arithmetic($1, $3, ArithmeticOption.TIMES, @1.first_line,@1.first_column);
    }       
    | Expr '/' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column);
    }
    | Expr '%' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.MOD, @1.first_line,@1.first_column);
    }
    | Expr '**' Expr
    {
        $$ = new Arithmetic($1, $3, ArithmeticOption.POT, @1.first_line,@1.first_column);
    }
    | Expr '<' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESS, @1.first_line, @1.first_column);
    }
    | Expr '<=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.LESSOREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '>' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATER ,@1.first_line, @1.first_column);
    }
    | Expr '>=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.GREATEROREQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '==' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.EQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '!=' Expr
    {
        $$ = new Relational($1, $3,RelationalOption.NOTEQUAL ,@1.first_line, @1.first_column);
    }
    | Expr '&&' Expr
    {
        $$ = new Logic($1, $3,LogicOption.AND ,@1.first_line, @1.first_column);
    }
    | Expr '||' Expr
    {
        $$ = new Logic($1, $3,LogicOption.OR ,@1.first_line, @1.first_column);
    }
    | F
    {
        $$ = $1;
    }
;


F
   : '(' Expr ')'
    { 
        $$ = $2;
    }
    | DECIMAL
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | ENTERO
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 1);
    }
    | CADENA
    {
        $$ = new Literal($1.replace(/\"/g,""), @1.first_line, @1.first_column, 2);
    }
    | TRUE
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 3);
    }
    | FALSE
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 3);
    }
    | ID{
        $$ = new Access($1, @1.first_line, @1.first_column);
    }
;