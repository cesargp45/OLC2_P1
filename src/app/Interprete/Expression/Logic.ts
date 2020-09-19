import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Environment } from "../Symbol/Environment";
import {Error_} from "../Error"
import {errores} from "../Errores"

export enum LogicOption{
    AND,
    NOT,
    OR
}

export class Logic extends Expression{

    constructor(private left: Expression | null, private right: Expression | null, private type : LogicOption, line: number, column: number){
        super(line,column);
    }

    public execute(environment : Environment) : Retorno{
        const leftValue = this.left.execute(environment);

        if(this.right == null){
            if(this.type == LogicOption.NOT){
                const result = !leftValue.value;  
                return {value : result, type : Type.BOOLEAN};
            }
        }else{
            const rightValue = this.right.execute(environment);

            if(this.type == LogicOption.AND){                    
                const result = leftValue.value && rightValue.value;
                return {value : result, type : Type.BOOLEAN};
            }
            else if(this.type == LogicOption.OR){
                const result = leftValue.value || rightValue.value;
                return {value : result, type : Type.BOOLEAN};
            }

        }

        
        return {value:0, type : Type.NUMBER}
    }
}