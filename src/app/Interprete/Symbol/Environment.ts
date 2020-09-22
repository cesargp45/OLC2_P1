import { env } from "process"
import { Symbol } from "./Symbol";
import { Type } from "../Abstract/Retorno";
import { Function } from "../Instruction/Function";

export class Environment{
    
    private variables : Map<string, Symbol>;
    public funciones : Map<string, Function>;

    constructor(public anterior : Environment | null){
        this.variables = new Map();
        this.funciones = new Map();
    }

    public guardar(id: string, valor: any, type: Type,tipoVar:string,listaVal:Array<any>, typeArray: Type){
        let env : Environment | null = this;
        while(env != null){
            if(env.variables.has(id)){
                env.variables.set(id, new Symbol(valor, id, type,tipoVar,listaVal,typeArray));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new Symbol(valor, id, type,tipoVar,listaVal,typeArray));
    }

    public guardarN(id: string, valor: any, type: Type,tipoVar:string,listaVal:Array<any>, typeArray: Type){
     
        this.variables.set(id, new Symbol(valor, id, type,tipoVar,listaVal,typeArray));
    }



    public guardarFuncion(id: string, funcion : Function){
        //TODO ver si la funcion ya existe, reportar error
        this.funciones.set(id, funcion);
    }

    public getVar(id: string) : Symbol | undefined | null{
        let env : Environment | null = this;
        while(env != null){
            if(env.variables.has(id)){
                return env.variables.get(id);
            }
            env = env.anterior;
        }
        return null;
    }   


    public getVarEnv(id: string) : Symbol | undefined | null{
        let env : Environment | null = this;       
            if(env.variables.has(id)){
                return env.variables.get(id);
            }     
        return null;
    }   

    public getFuncion(id: string) : Function | undefined{
        let env : Environment | null = this;
        while(env != null){
            if(env.funciones.has(id)){
                return env.funciones.get(id);
            }
            env = env.anterior;
        }
        return undefined;
    }


    public getGlobal() : Environment{
        let env : Environment | null = this;
        while(env.anterior != null){ //le quite el ?
            env = env.anterior;
        }
        return env;
    }


    public imprimirLista(){
        
        console.log("inicio --- \n");  
        for (var [clave, valor] of this.variables) {
            console.log(clave + " = " + valor.valor +"\n");
          }
           
          console.log("fin --- \n"); 
        
    }
}