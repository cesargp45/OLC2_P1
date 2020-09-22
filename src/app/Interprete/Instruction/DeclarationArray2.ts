import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
//import { env } from "process";
import {Error_} from "../Error";
import {errores} from "../Errores";
import { Arreglo } from "../Objects/Array";

export class DeclarationArray2 extends Instruction{

    private id : string;
    private value : Expression;
    private  tipo : number;
    private  tipoAsig : number;
    private  Llaves : any;

    constructor(id: string, value : Expression | null , line : number, column: number, tipo:number | null, tipoAsig : number,Llaves: any){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        this.tipoAsig = tipoAsig;
        this.Llaves = Llaves;
    }
    // tipoAsign = 2 = let
    // tipoAsign = 1 = const
    public execute(environment: Environment) {

        const v = environment.getVarEnv(this.id);
        if(v != null){
             let errorN = new Error_(this.line,this.column,"Semantico","La variable ya existe en este ambito");
             errores.push(errorN);
            throw {error: "Semantico: la variable ya existe en este abito", linea: this.line, columna : this.column}
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
            let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser void");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser void", linea: this.line, columna : this.column};
        }
        else if(this.tipo == 6){
            t= Type.ANY;

            let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser any");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser any", linea: this.line, columna : this.column};
        }

       }
       
       
       //if(this.Llaves.length == 1){

       let ex;

        if(this.value != null){
 
          ex = this.value.execute(environment); //
 
         if(ex.type != Type.ARRAY ){//
             let errorN = new Error_(this.line,this.column,"Semantico","Se debe asignar un dato de tipo array");
              errores.push(errorN);
             throw {error: "Semantico: Se debe asignar un dato de tipo array", linea: this.line, columna : this.column}
         }
 
      }
         ex.value.imprimir();
 
           if(this.value == null && this.tipo != null){// let id:tipo[];/let id:tipo[] = [];
              
             if(this.tipoAsig == 2){
                let arreglo = new Array;
                let newArray = new Arreglo(Type.ARRAY,arreglo,this.Llaves.lengthdim);
                 environment.guardar(this.id, newArray, Type.ARRAY,"let",arreglo,t);
             }else{
                 let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                 errores.push(errorN);  
                 throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
             }
 
         }else if (this.value != null && this.tipo != null){ //let id:tipo = [lista]; /const
                    
                 if(this.tipoAsig == 1){
                     environment.guardar(this.id, ex.value, Type.ARRAY,"const",ex.value,t);
                 }else{
                     //console.log("tipooo: "+ex.value.tipo);
                     environment.guardar(this.id, ex.value, Type.ARRAY,"let",ex.value,t);
                 }
                 
         }
       
        
    }

}