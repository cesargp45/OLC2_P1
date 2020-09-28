import { Instruction } from "../Abstract/Instruction";
import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { env } from "process";
import {Error_} from "../Error";
import {errores} from "../Errores";
import {tiposArr} from "../TiposArr";
import { cont } from "../contador";
import { Aumentar} from "../contador";

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
       let vall;
       if(this.value != null){
         vall= this.value.execute(environment);

         if(vall == undefined){
            let errorN = new Error_(this.line,this.column,"Semantico","no se puede asignar un valor undefined");
            errores.push(errorN);  
            throw {error: "Semantico: no se puede asignar un valor undefined", linea: this.line, columna : this.column};
          }
       }
       

        if (this.tipo == null && this.value == null){  // let id;
           
            if(this.tipoAsig == 2){
                environment.guardarN(this.id, null, Type.ANY,"let",null,null);
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                errores.push(errorN);  
                throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
            }
                      
        }else if(this.tipo == null && this.value != null){ //let id = exp; / const
         
            const val = this.value.execute(environment);
            if(this.tipoAsig == 1){
                if (val.type == Type.ARRAY){

                    let t1 ;
                    let t2;
              
                      for (const iterator of tiposArr) {
                         
                         t1 = iterator.tipo
                         if (t1 != Type.ARRAY){
                              if(t2 == null || t1 == t2){
                                     t2 = t1;
                              }else{
                               while(tiposArr.length > 0){
                                    tiposArr.pop();
                               } 
                               let errorN = new Error_(this.line,this.column,"Semantico","Los arreglos tienen que ser de un mismo tipo de dato");
                               errores.push(errorN);         
                               throw {error: "Semantico: Los arrreglos tienen que ser de un mismo tipo de dato", linea: this.line, columna : this.column};
                              }
                         }
                       }
             
                           while(tiposArr.length > 0){
                           tiposArr.pop();
                       
                         } 

                         environment.guardarN(this.id, val.value, val.type,"const",null,t2);
                }else{
                    environment.guardarN(this.id, val.value, val.type,"const",null,null);
                }
                              
            }else{
                if (val.type == Type.ARRAY){

                    let t1 ;
                    let t2;
              
                      for (const iterator of tiposArr) {
                         
                         t1 = iterator.tipo
                         if (t1 != Type.ARRAY){
                              if(t2 == null || t1 == t2){
                                     t2 = t1;
                              }else{
                               while(tiposArr.length > 0){
                                    tiposArr.pop();
                               } 
                               let errorN = new Error_(this.line,this.column,"Semantico","Los arreglos tienen que ser de un mismo tipo de dato");
                               errores.push(errorN);         
                               throw {error: "Semantico: Los arrreglos tienen que ser de un mismo tipo de dato", linea: this.line, columna : this.column};
                              }
                         }
                       }
             
                           while(tiposArr.length > 0){
                           tiposArr.pop();
                       
                         } 

                         environment.guardarN(this.id, val.value, val.type,"let",null,t2);
                }else{
                    environment.guardarN(this.id, val.value, val.type,"let",null,null);
                }
               
            }
            

        }else if(this.value == null && this.tipo != null){// let id:tipo;
             
            if(this.tipoAsig == 2){
                environment.guardarN(this.id, null, t,"let",null,null);
            }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable const debe estar inicializado");
                errores.push(errorN);  
                throw {error: "Semantico: const debe estar inicializada", linea: this.line, columna : this.column};
            }

        }else if (this.value != null && this.tipo != null){ //let id:tipo = exp; /const
           
            const val = this.value.execute(environment);
            if(t == Type.ANY || val.type == t){
                if(this.tipoAsig == 1){
                    environment.guardarN(this.id, val.value, val.type,"const",null,null);
                }else{
                    environment.guardarN(this.id, val.value, val.type,"let",null,null);
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

         public getDot(ant:string){
             let dot = "";
             let nodo= "Node"+cont;
             dot+=nodo+"[label=Declaracion]; \n";
             dot+= ant+"->"+nodo+'\n';
             Aumentar();

             if(this.tipoAsig == 1){
                let nodoconst= "Node"+cont;
                dot+=nodoconst+"[label=const]; \n";
                dot+= nodo+"->"+nodoconst+'\n';
                Aumentar();
             }else{
                let nodoconst= "Node"+cont;
                dot+=nodoconst+"[label=let]; \n";
                dot+= nodo+"->"+nodoconst+'\n';
                Aumentar();
             }
            
             if (this.tipo == null && this.value == null){  // let id;
                let nodoconst= "Node"+cont;
                dot+=nodoconst+"[label="+this.id+"]; \n";
                dot+= nodo+"->"+nodoconst+'\n';
                Aumentar();
                return dot;
             }else if(this.tipo == null && this.value != null){ //let id = exp; / const
                let nodoconst= "Node"+cont;
                dot+=nodoconst+"[label="+this.id+"]; \n";
                dot+= nodo+"->"+nodoconst+'\n';
                Aumentar();

                let nodoconst2= "Node"+cont;
                dot+=nodoconst2+"[label=\"=\"]; \n";
                dot+= nodo+"->"+nodoconst2+'\n';
                Aumentar();

                let nodoconst3= "Node"+cont;
                dot+=nodoconst3+"[label= Exp]; \n";
                dot+= nodo+"->"+nodoconst3+'\n';
                Aumentar();
                
                 dot+= this.value.getDot(nodoconst3);
                return dot;
             }else if(this.value == null && this.tipo != null){// let id:tipo;
                let nodoconst= "Node"+cont;
                dot+=nodoconst+"[label="+this.id+"]; \n";
                dot+= nodo+"->"+nodoconst+'\n';
                Aumentar();

                let nodoconst2= "Node"+cont;
                dot+=nodoconst2+"[label="+this.getType(this.tipo)+"]; \n";
                dot+= nodo+"->"+nodoconst2+'\n';
                Aumentar();

                return dot;
             }else if (this.value != null && this.tipo != null){ //let id:tipo = exp; /const

                let nodoconst= "Node"+cont;
                dot+=nodoconst+"[label="+this.id+"]; \n";
                dot+= nodo+"->"+nodoconst+'\n';
                Aumentar();

                let nodoconst4= "Node"+cont;
                dot+=nodoconst4+"[label="+this.getType(this.tipo)+"]; \n";
                dot+= nodo+"->"+nodoconst4+'\n';
                Aumentar();

                let nodoconst2= "Node"+cont;
                dot+=nodoconst2+"[label=\"=\"]; \n";
                dot+=nodo+"->"+nodoconst2+'\n';
                Aumentar();

                let nodoconst3= "Node"+cont;
                dot+=nodoconst3+"[label= Exp]; \n";
                dot+= nodo+"->"+nodoconst3+'\n';
                Aumentar();

                dot+= this.value.getDot(nodoconst3);
                
                return dot;
             }
         }


         getType(val:any){
            if(val == Type.NUMBER){
               return "number";
            }else if(val == Type.BOOLEAN){
                return "boolean";
            }else if(val == Type.STRING){
                return "string";
            }else if(val == Type.ANY){
                return "any";
            }else if(val == Type.VOID){
                return "void";
            }else if(val == Type.ARRAY){
                return "array";
            }
            return "any";
    
        }

}