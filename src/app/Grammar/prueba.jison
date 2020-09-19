%{
  const {Arithmetic, ArithmeticOption} = require('../Interprete/Expression/Arithmetic');
  const {Relational, RelationalOption} = require('../Interprete/Expression/Relational');
  const {Access} = require('../Interprete/Expression/Access');
  const {Literal} = require('../Interprete/Expression/Literal');
  const {Declaration} = require('../Interprete/Instruction/Declaration');
  const {Logic} = require('../Interprete/Expression/Logic');
%}

%lex
%options case-sensitive
entero  [0-9]+
decimal {entero}"."{entero}
cadena  (\"[^"]*\")
cadenab  (\'[^']*\')
%%
\s+                   /* skip whitespace */

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
    :  Declaration{
        $$ = $1;
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
   : 
     ENTERO
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 1);;
        console.log("pasa papa");
          
    }
    
;
   