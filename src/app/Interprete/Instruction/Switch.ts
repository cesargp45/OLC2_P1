import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error";
import {errores} from "../Errores";
import {Case} from "./Case";
import { Condition } from '../Expression/Condition';


export class Switch extends Instruction{

    constructor(private condition : Expression, private cases : Array<Case> ,line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment) {
        let bandera = false;
        const condition = this.condition.execute(env);
        
        for (const c of this.cases) {
            
            let condition2;
            if(c.condition != null){
                condition2 = c.condition.execute(env);
            }else{
                condition2 = null;
            }
             
            if(c.tipo == "case"){
                if(condition2.type != condition.type || condition2 == null ){               
                    let errorN = new Error_(this.line,this.column,"Semantico","La condicion y el caso no son del mismo tipo");
                    errores.push(errorN);         
                    throw {error: "Semantico: La condicion y el caso no son del mismo tipo", linea: this.line, columna : this.column};
                }
           }
            

           if( condition2 == null || bandera == true){

            const element = c.execute(env);

            if(element != null || element != undefined){
               //console.log(element);
               if(element.type == 'Break'){
                   return;  
                  } else if(element.type == 'Return'){
                    return element;  
                 }             
               }

             bandera = true;

           }else if(condition2.value == condition.value  ){
                 
                 const element = c.execute(env);

             if(element != null || element != undefined){
                //console.log(element);
                if(element.type == 'Break'){
                    return; 
                }else if(element.type == 'Return'){
                    return element;  
                 }   
                                  
              }              
              bandera = true;
            }

        }
        
 }

}

