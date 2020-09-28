import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import { env } from "process";
import {Error_} from "../Error"
import {errores} from "../Errores"

export enum ArithmeticOption{
    PLUS,
    MINUS,
    TIMES,
    DIV,
    NEGATIVE,
    MOD,
    POT
}

export class Arithmetic extends Expression{

    constructor(private left: Expression, private right: Expression, private type : ArithmeticOption, line: number, column: number){
        super(line,column);
    }

    public execute(environment : Environment) : Retorno{
        const leftValue = this.left.execute(environment);
        let rightValue;
        let tipoDominante;
        if(this.right != null){
             rightValue = this.right.execute(environment);
             tipoDominante = this.tipoDominante(leftValue.type, rightValue.type);
        }     
        let result : Retorno;
        

        if(this.type == ArithmeticOption.PLUS){
            
            if(tipoDominante == Type.STRING){
                if(rightValue.value == null){
                    result = {value : (leftValue.value.toString() ), type : Type.STRING};
                }else{
                    
                        result = {value : (leftValue.value.toString() + rightValue.value.toString()), type : Type.STRING};
                             
                }             
            }else if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value + rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' + ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' + ' + rightValue.type); 
            }           
        }
        else if(this.type == ArithmeticOption.MINUS){
            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value - rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' - ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' - ' + rightValue.type);
            }           
        }
        else if(this.type == ArithmeticOption.TIMES){

            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value * rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' * ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' * ' + rightValue.type);
            }  
            
        }
        else if(this.type == ArithmeticOption.DIV){

            if(tipoDominante == Type.NUMBER){
                if(rightValue.value == 0){
                    let errorN = new Error_(this.line,this.column,"Semantico","No se puede dividir entre 0");
                    errores.push(errorN); 
                    throw new Error_(this.line, this.column, "Semantico", "No se puede dividir entre 0");
                }
                result = {value : (leftValue.value / rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' / ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' / ' + rightValue.type);
            }  
            
            
        }
        else if(this.type == ArithmeticOption.NEGATIVE){
            if(leftValue.type== Type.NUMBER){
                result = {value : ((-1)*leftValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede negar: ' + leftValue.type );
                errores.push(errorN); 
                throw new Error_(this.line, this.column, "Semantico", "No se puede negar un " + leftValue.type);
            }  
            
        }
        else if(this.type == ArithmeticOption.POT){
            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value ** rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' ** ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' ** ' + rightValue.type);
            }  

        }
        else if(this.type == ArithmeticOption.MOD){
            if(tipoDominante == Type.NUMBER){
                result = {value : (leftValue.value % rightValue.value), type : Type.NUMBER};
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico",'No se puede operar: ' + leftValue.type + ' % ' + rightValue.type);
                errores.push(errorN); 
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede operar: ' + leftValue.type + ' % ' + rightValue.type);
            }             
        }
        return result;
    }
}

/*
    3 + 5 * "hola mundo";
    Error
*/