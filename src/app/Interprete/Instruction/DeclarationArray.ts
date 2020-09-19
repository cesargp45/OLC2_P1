import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { env } from "process";
import {Error_} from "../Error"
import {errores} from "../Errores"

export class DeclarationArray extends Instruction{

    private id : string;
    private value : Expression;
    private  tipo : number;
    private  tipoAsig : number;

    constructor(id: string, value : Expression | null , line : number, column: number, tipo:number | null, tipoAsig : number){
        super(line, column);
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        this.tipoAsig = tipoAsig;
    }
    // tipoAsign = 2 = let
    // tipoAsign = 1 = const
    public execute(environment: Environment) {

        const v = environment.getVar(this.id);
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
        }
        else if(this.tipo == 6){
            t= Type.ANY;

            let errorN = new Error_(this.line,this.column,"Semantico","El tipo no puede ser any");
             errores.push(errorN);  
            throw {error: "Semantico: el tipo no puede ser any", linea: this.line, columna : this.column};
        }

       }
       
       let arreglo:Array<any>=[];

       if(this.value != null){

        let ex = this.value.execute(environment); //

        if(ex.type != Type.ARRAY ){//
            let errorN = new Error_(this.line,this.column,"Semantico","Se debe asignar un dato de tipo array");
             errores.push(errorN);
            throw {error: "Semantico: Se debe asignar un dato de tipo array", linea: this.line, columna : this.column}
        }

        for (const c of ex.value) {//
            let valor = c.execute(env);
             
           if(valor.type != t ){
            
            let errorN = new Error_(this.line,this.column,"Semantico","el valor"+ valor.value +"no coincide con el tipo del arreglo");
            errores.push(errorN);  
            throw {error: "Semantico: el valor"+ valor.value +"no coincide con el tipo del arreglo", linea: this.line, columna : this.column};
             
           }
       }
       

       for (const a of ex.value) {//
        let valor = a.execute(env);
         arreglo.push(valor.value);
       }

     }


          if(this.value == null && this.tipo != null){// let id:tipo[];/let id:tipo[] = [];
             
            if(this.tipoAsig == 2){
                environment.guardar(this.id, arreglo, Type.ARRAY,"let",arreglo,t);
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                errores.push(errorN);  
                throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
            }

        }else if (this.value != null && this.tipo != null){ //let id:tipo = [lista]; /const
                   
                if(this.tipoAsig == 1){
                    environment.guardar(this.id, arreglo, Type.ARRAY,"const",arreglo,t);
                }else{
                    environment.guardar(this.id, arreglo, Type.ARRAY,"let",arreglo,t);
                }
                
        }
        
    }

}