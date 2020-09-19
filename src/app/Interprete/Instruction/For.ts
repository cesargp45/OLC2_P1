import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";

export class For extends Instruction{

    constructor(private declaracion : Expression | Instruction ,private condicion : Expression ,private asignacion : Instruction, private code : Instruction, line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        const newEnv = new Environment(env);
        let dec = this.declaracion.execute(newEnv);
        let cond = this.condicion.execute(newEnv);

        if(cond.type != Type.BOOLEAN){
            throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
        }
        while(cond.value == true){
            
            const element = this.code.execute(newEnv);
            if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
            }
             let asig =this.asignacion.execute(newEnv);
            cond = this.condicion.execute(newEnv);
            if(cond.type != Type.BOOLEAN){
                throw {error: "La condicion no es booleana", linea: this.line, columna : this.column};
            }
        }


    }
}