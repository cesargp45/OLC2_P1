import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error";
import {errores} from "../Errores";


export class If extends Instruction{

    constructor(private condition : Expression, private code : Instruction, private elsSt : Instruction | null,
        line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        const condition = this.condition.execute(env);
        if(condition.type != Type.BOOLEAN){
            
            let errorN = new Error_(this.line,this.column,"Semantico","La condicion no es booleana");
            errores.push(errorN);
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }

        if(condition.value == true){
            return this.code.execute(env);
        }
        else{
            if(this.elsSt != null){
                return this.elsSt.execute(env);
            }
            
        }
    }
}



/*
    PADRE <- HIJO <- IF
    PADRE <- HIJO <- WHILE
*/