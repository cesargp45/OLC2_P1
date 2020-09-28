import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from '../Abstract/Retorno';
import {resultado} from '../traduc';
import { Simbolo } from "../simbolo";
import { simbolog } from "../simboloG";

export class Graficar extends Instruction{

    constructor( line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        
        let simboloN = new Simbolo("llamada","", "", "","");
        simbolog.push(simboloN); 

        environment.guardarSimbolos();
        environment.guardarsimbolosf();
        
  }
}