import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import {Error_} from "../Error";
import {errores} from "../Errores";
import { Retorno, Type } from "../Abstract/Retorno";

export class Function extends Instruction{

    constructor(private id: string, public parametros : Array<any> | null, public tipo:number | null, public instrucciones: Array<Instruction>, line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
       
        const v = environment.getFuncion(this.id);
       
        if(v != undefined || v!= null){
             let errorN = new Error_(this.line,this.column,"Semantico"," Ya existe una funcion con el mismo id");
             errores.push(errorN);
            throw {error: "Semantico: Ya existe una funcion con el mismo id", linea: this.line, columna : this.column}
        } 
       
        
        
        if (this.parametros != null){

            

            for(let i = 1; i < this.parametros.length; i = i+2){
                let no = this.parametros[i];
                 if(no  == 3){
                    
                     let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser null");
                     errores.push(errorN);  
                    throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser null", linea: this.line, columna : this.column};
                 }
                 else if(no  == 4){
                    let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser array");
                    errores.push(errorN);  
                   throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser array", linea: this.line, columna : this.column};
                 }
                 else if(no  == 5){
                    let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser void");
                     errores.push(errorN);  
                    throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser void", linea: this.line, columna : this.column};
                }
                else if(no  == 6){
                    let errorN = new Error_(this.line,this.column,"Semantico","El parametro "+this.parametros[i-1]+" no puede ser any");
                     errores.push(errorN);  
                    throw {error: "Semantico: El parametro "+this.parametros[i-1]+" no puede ser any", linea: this.line, columna : this.column};
                    
                }
                
            }
        }


        environment.guardarFuncion(this.id, this);

       
    }

    public getDot(ant:string){}
}





/*
    Lenguaje Entrada -> Traducis -> Lenguaje Salida;
    Lenguaje Salida -> Intepretas -> Salida en consola | Reportes | TS;
*/

function getTipo(no:number):Type {
    
    if(no == 0){
        return Type.NUMBER;
    }
     else if(no  == 1){
        return Type.STRING;
     }
     else if(no  == 2){
       return Type.BOOLEAN;
     }
     else if(no  == 3){
        
         let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser null");
         errores.push(errorN);  
        throw {error: "Semantico: el tipo no puede ser nulo", linea: this.line, columna : this.column};
     }
     else if(no  == 4){
        let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser array");
        errores.push(errorN);  
       throw {error: "Semantico: el tipo no puede ser array", linea: this.line, columna : this.column};
     }
     else if(no  == 5){
        let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser void");
         errores.push(errorN);  
        throw {error: "Semantico: el tipo no puede ser void", linea: this.line, columna : this.column};
    }
    else if(no  == 6){
        let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser any");
         errores.push(errorN);  
        throw {error: "Semantico: el tipo no puede ser any", linea: this.line, columna : this.column};
        
    }

   
}