import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { env } from "process";
import {Error_} from "../Error";
import {errores} from "../Errores";

export class Declaration extends Instruction{
    public idt: string;
    private id : string;
    private value : Expression;
    private  tipo : number;
    private  tipoAsig : number;

    constructor(id: string, value : Expression | null , line : number, column: number,tipo:number | null, tipoAsig : number){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        this.tipoAsig = tipoAsig;
        this.idt =id;
    }
    // tipoAsign = 2 = let
    // tipoAsign = 1 = const
    public execute(environment: Environment) {

        const v = environment.getVarEnv(this.id);
        if(v != null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable ya existe en este ambito");
             errores.push(errorN);
            throw {error: "Semantico: la variable ya existe en este ambito", linea: this.line, columna : this.column}
        } 

       let t ;
       if(this.tipo != null){
        if(this.tipo == 0){
            t= Type.NUMBER;
        }
         else if(this.tipo == 1){
            t= Type.STRING;
         }
         else if(this.tipo == 2){
            t= Type.BOOLEAN;
         }
         else if(this.tipo == 3){
            t= Type.NULL;
           // console.log("el tipo no puede ser nulo");
             let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser null");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser nulo", linea: this.line, columna : this.column};
         }
         else if(this.tipo == 4){
            t= Type.ARRAY;
         }
         else if(this.tipo == 5){
            t= Type.VOID;
        }
        else if(this.tipo == 6){
            t= Type.ANY;
        }

       }
       const vall = this.value.execute(environment);

       if(vall == undefined){
         let errorN = new Error_(this.line,this.column,"Semantico","no se puede asignar un valor undefined");
         errores.push(errorN);  
         throw {error: "Semantico: no se puede asignar un valor undefined", linea: this.line, columna : this.column};
       }


        if (this.tipo == null && this.value == null){  // let id;
           
            if(this.tipoAsig == 2){
                environment.guardar(this.id, null, Type.ANY,"let",null,null);
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                errores.push(errorN);  
                throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
            }
                      
        }else if(this.tipo == null && this.value != null){ //let id = exp; / const
           
            const val = this.value.execute(environment);
            if(this.tipoAsig == 1){
                environment.guardar(this.id, val.value, val.type,"const",null,null);
            }else{
                environment.guardar(this.id, val.value, val.type,"let",null,null);
            }
            

        }else if(this.value == null && this.tipo != null){// let id:tipo;
             
            if(this.tipoAsig == 2){
                environment.guardar(this.id, null, t,"let",null,null);
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                errores.push(errorN);  
                throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
            }

        }else if (this.value != null && this.tipo != null){ //let id:tipo = exp; /const
           
            const val = this.value.execute(environment);
            if(t == Type.ANY || val.type == t){
                if(this.tipoAsig == 1){
                    environment.guardar(this.id, val.value, val.type,"const",null,null);
                }else{
                    environment.guardar(this.id, val.value, val.type,"let",null,null);
                }
                
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","el tipo de dato y el dato asignado no coinciden");
                errores.push(errorN);  
                throw {error: "Semantico: el tipo de dato y el dato asignado no coinciden", linea: this.line, columna : this.column};
            }      

        }
        // environment.imprimirLista();
         return {value : this.id}; 
    }

}