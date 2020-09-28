import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Instruction } from "../Abstract/Instruction";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import {Error_} from "../Error";
import {errores} from "../Errores";



export class pruebaAsign extends Instruction{

    constructor(private pos:any, private value: Expression, line:number,column:number){
      super(line,column);
    }
   

    public execute(environment:Environment){
      
         let a = this.value.execute(environment);

         this.pos.Iguala = a;

         this.pos.execute(environment);

      
  }
}