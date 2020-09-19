import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";

export class Return extends Instruction{

    constructor(private value: Expression | null,line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        if(this.value != null){
             let a = this.value.execute(environment);

            return {line : this.line, column: this.column, type : 'Return' ,value: a.value};
        }else{
            return {line : this.line, column: this.column, type : 'Return' ,value:this.value};
        }
        
    }
}