import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Retorno } from "../Abstract/Retorno";
//import { type } from "os";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error";
import {errores} from "../Errores";


export class Access extends Expression{

    constructor(private id: string,private indice:Expression | null, line : number, column: number,private tipo: number){
        super(line, column);
    }

    public execute(environment: Environment): Retorno {
       
        const value = environment.getVar(this.id);
        if(value == null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe");
             errores.push(errorN);         
             throw {error: "Semantico:La variable no existe", linea: this.line, columna : this.column};
        }
        
        if(this.indice == null){
            if(this.tipo == 1){
                return {value : value.valor, type : value.type};
            }else{
             

             if(value.type == Type.ARRAY){
                let n = value.valor;
                let tam = n.length;
                
                return {value : tam, type : Type.NUMBER};
             }else{
                 let errorN = new Error_(this.line,this.column,"Semantico","No se puede accesar a ese dato pues la variable no es un arreglo");
                 errores.push(errorN);         
                 throw {error: "Semantico:No se puede accesar a ese dato pues la variable no es un arreglo", linea: this.line, columna : this.column};
             }


            }
            
        }else{
                let n = this.indice.execute(environment);
            if(value.type == Type.ARRAY){
                   if (n.type == Type.NUMBER){
                        
                     let valora = value.valor[n.value];
                     if(valora == null || valora == undefined){
                        let errorN = new Error_(this.line,this.column,"Semantico","el valor al que intenta acceder no esta definido");
                        errores.push(errorN);         
                        throw {error: "Semantico: el valor al que intenta acceder no esta definido", linea: this.line, columna : this.column};

                     }else{
                        return {value: valora, type : value.typeArray};
                     }
                     
                   }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","El indice debe de ser de tipo number");
                    errores.push(errorN);         
                    throw {error: "Semantico: El indice debe de ser de tipo number", linea: this.line, columna : this.column};
                   }

            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","No se puede accesar a ese dato pues la variable no es un arreglo");
                errores.push(errorN);         
                throw {error: "Semantico:No se puede accesar a ese dato pues la variable no es un arreglo", linea: this.line, columna : this.column};
            }
        }
        
    }
}