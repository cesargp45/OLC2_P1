import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { env } from "process";
import { Type } from '../Abstract/Retorno';
import {Error_} from "../Error"
import {errores} from "../Errores"

export class Asignation extends Instruction{

    private id : string;
    private value : Expression;
    private tipo: number;

    constructor(id: string, value : Expression , line : number, column: number,tipo:number){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
    }

    public execute(environment: Environment) {
        
        const v = environment.getVar(this.id);

        if(v == null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe, o se encuentra en otro entorno");
             errores.push(errorN);
            throw {error: "Semantico: la variable no existe, o se encuentra en otro entorno", linea: this.line, columna : this.column}
        } 
        
        if(this.value != null){

         const vall = this.value.execute(environment);

        if(vall == undefined){
            let errorN = new Error_(this.line,this.column,"Semantico","no se puede asignar un valor undefined");
            errores.push(errorN);  
            throw {error: "Semantico: no se puede asignar un valor undefined", linea: this.line, columna : this.column};
          }

         }else if( this.tipo == 1){
            let errorN = new Error_(this.line,this.column,"Semantico","valor nulo");
            errores.push(errorN);  
            throw {error: "Semantico: valor nulo", linea: this.line, columna : this.column};

         }
        
         //console.log(this.value.execute(environment));
        
        if(this.tipo == 1){ // solo se asigna el nuevo valor, y se verifica si el nuevo valor es del mismo tipo                   
            const val = this.value.execute(environment);
            if(v.type==Type.ANY || v.type == val.type){
                if(v.tipoVar == "let"){
                    if (val.type == Type.ARRAY) {

                        let arreglo: Array<any> = [];
                        let siany = null;
                        let igual;
                        if (this.value != null) {
                            for (const c of val.value) {
                                let valor = c.execute(environment);
                               // console.log(valor);
                                if (valor.type != v.typeArray) {
                                     if(v.typeArray != null ){
                                        let errorN = new Error_(this.line, this.column, "Semantico", "el valor  [" + valor.value + "]  no coincide con el tipo del arreglo");
                                        errores.push(errorN);
                                        throw { error: "Semantico: el valor  [" + valor.value + "]  no coincide con el tipo del arreglo", linea: this.line, columna: this.column };
                                     }else{
                                        if (siany == null){
                                            siany = valor.type;
                                        }else{
                                            if(siany != valor.type){
                                                let errorN = new Error_(this.line, this.column, "Semantico", "no se acepta un arreglo de multiples tipos");
                                                errores.push(errorN);
                                                throw { error: "Semantico: no se acepta un arreglo de multiples tipos, linea: this.line, columna: this.column "};
                                            }
                                        }
                                     }
                                    

                                }
                            }
                             
                            for (const a of val.value) {
                                let valor = a.execute(environment);
                                arreglo.push(valor.value);
                                igual = valor.type;
                            }

                        }
                        if(v.typeArray == null || v.typeArray == Type.ANY  ){
                            environment.guardar(this.id, arreglo, val.type,v.tipoVar,arreglo,igual); 
                        }else{
                            environment.guardar(this.id, arreglo, val.type,v.tipoVar,arreglo,v.typeArray); 
                        }
                       

                    }else{
                        environment.guardar(this.id, val.value, val.type,v.tipoVar,v.listaVal,v.typeArray); 
                    }

                }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","La variable es de tipo constante, no puede cambiar su valor");
                    errores.push(errorN);
                    throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                }
                  
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","el valor a asignar y la variable, no son del mismo tipoLa variable no existe");
                errores.push(errorN);
                throw {error: "Semantico: el valor a asignar y la variable, no son del mismo tipo", linea: this.line, columna : this.column}
            }


                  
        }else if (this.tipo == 2){ // solo se incrementa en uno el valor, si es number
               if(v.type == Type.NUMBER){
                if(v.tipoVar == "let"){
                  let res = v.valor + 1;
                  
                  environment.guardar(this.id, res, v.type,v.tipoVar,null,null); 
                }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","La variable es tipo constante, no puede cambiar su valor");
                    errores.push(errorN);
                    throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                }
                  
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no es de tipo number");
                errores.push(errorN);
                throw {error: "Semantico: la variable no es de tipo number", linea: this.line, columna : this.column}
               }
        }else if (this.tipo == 3){ //solo se le resta uno al valor, si es number
            if(v.type == Type.NUMBER){
                if(v.tipoVar == "let"){
                    let res = v.valor - 1;
                    environment.guardar(this.id, res, v.type,v.tipoVar,null,null); 
                  }else{
                       let errorN = new Error_(this.line,this.column,"Semantico","La variable es tipo constante, no puede cambiar su valor");
                       errores.push(errorN);
                      throw {error: "Semantico: La variable es tipo constante, no puede cambiar su valor", linea: this.line, columna : this.column}
                  }
             }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no es de tipo number");
                errores.push(errorN);
              throw {error: "Semantico: la variable no es de tipo number", linea: this.line, columna : this.column}
             }

        }
         

        
    }

 
}