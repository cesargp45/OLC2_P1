import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error";
import {errores} from "../Errores";


export class Case extends Instruction{

    constructor(public condition : Expression | null, private code: Instruction |null ,line : number, column : number,public tipo:string){
        super(line, column);
    }

    public execute(env : Environment) {
         
        if(this.code != null){
            return this.code.execute(env);
        }
        else{           
            return;
        }
    }
}