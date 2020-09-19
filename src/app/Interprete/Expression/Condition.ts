import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import {Error_} from "../Error";
import {errores} from "../Errores";



export class Condition extends Expression{

    constructor(private condicion: Expression,private exp1: Expression, private exp2: Expression, line: number, column: number){
        super(line,column);
    }

    public execute(environment : Environment) : Retorno{

        
        
        const cond= this.condicion.execute(environment);

        if(cond.type != Type.BOOLEAN){ 
            
            let errorN = new Error_(this.line,this.column,"Semantico","La condicion no es booleana");
            errores.push(errorN);
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }


             if(cond.value == true){
                
                const expresion1 = this.exp1.execute(environment);
                return {value : expresion1.value, type : expresion1.type};

             } else{
                const expresion2= this.exp2.execute(environment);

                return {value : expresion2.value, type : expresion2.type};
             }             
            
               
        
    }
}