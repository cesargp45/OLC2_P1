import { Instruction } from "../Abstract/Instruction";
import { Expression } from "../Abstract/Expression";
import { Environment } from "../Symbol/Environment";
import { Type } from "../Abstract/Retorno";
import {Error_} from "../Error"
import {errores} from "../Errores"

export class For2 extends Instruction{
    // le puse un atributo extra
    constructor(private declaracion : string ,private dec : Instruction,private arreglo : string, private code : Instruction, line : number, column : number,private tipo: number){
        super(line, column);
    }

    public execute(env : Environment) {
        const newEnv = new Environment(env);
       
        if(this.tipo == 1){
            let decla = this.dec.execute(newEnv);
            let varia = newEnv.getVar(decla.value);  
            let arr = newEnv.getVar(this.arreglo);

            if(arr == null ){
                let errorN = new Error_(this.line,this.column,"Semantico","La variable " +this.arreglo+ " no existe");
                console.log("arreglo no existe");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+this.arreglo+" no existe", linea: this.line, columna : this.column}
            } 
 
            if(varia == null ){
             console.log("variable");
             let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" no existe");
             errores.push(errorN);
             throw {error: "Semantico: Semantico:La variable "+decla.value+" no existe", linea: this.line, columna : this.column}
         } 
 
              
             if(varia.type != Type.NUMBER ){
                if(varia.type == Type.ANY){                   
                 newEnv.guardar(varia.id,varia.valor,Type.NUMBER,varia.tipoVar,varia.listaVal,varia.typeArray);
                }else{
                 let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" debe de ser any o number");
                 errores.push(errorN);
                 throw {error: "Semantico: Semantico:La variable "+decla.value+" debe de ser any o number", linea: this.line, columna : this.column}
                }
             }
               varia = newEnv.getVar(decla.value); 
 
             for (let a in arr.valor) {
                 let m = parseInt(a, 10);
                 newEnv.guardar(varia.id,m,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                 const element = this.code.execute(newEnv );//
               if(element != null || element != undefined){
                 console.log(element);
                 if(element.type == 'Break')
                     break;
                 else if(element.type == 'Continue')
                     continue;
              }
              arr = newEnv.getVar(this.arreglo);
            }
 

       
            
        }else if(this.tipo == 2){

            let varia = env.getVar(this.declaracion);         
            let arr = env.getVar(this.arreglo);
           if(arr == null ){
               let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.arreglo+" no existe");
               errores.push(errorN);
               throw {error: "Semantico: Semantico:La variable"+this.arreglo+" no existe", linea: this.line, columna : this.column}
           } 

           if(varia == null ){
            let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" no existe");
            errores.push(errorN);
            throw {error: "Semantico: Semantico:La variable"+this.declaracion+" no existe", linea: this.line, columna : this.column}
        } 

             let bandera = false;
            if(varia.type != Type.NUMBER ){
               if(varia.type == Type.ANY){
                   bandera = true;
                env.guardar(varia.id,varia.valor,Type.NUMBER,varia.tipoVar,varia.listaVal,varia.typeArray);
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" debe de ser any o number");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+this.declaracion+" debe de ser any o number", linea: this.line, columna : this.column}
               }
            }
              varia = env.getVar(this.declaracion); 

            for (let a in arr.valor) {
                let m = parseInt(a, 10);
               env.guardar(varia.id,m,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                const element = this.code.execute(env);//
              if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
             }
             arr = env.getVar(this.arreglo);
           }

           
        }else if(this.tipo == 3){


            let decla = this.dec.execute(newEnv);
            let varia = newEnv.getVar(decla.value);  
            let arr = newEnv.getVar(this.arreglo);

           if(arr == null ){
               let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.arreglo+" no existe");
               errores.push(errorN);
               throw {error: "Semantico: Semantico:La variable "+this.arreglo+" no existe", linea: this.line, columna : this.column}
           } 

           if(varia == null ){
            let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" no existe");
            errores.push(errorN);
            throw {error: "Semantico: Semantico:La variable "+decla.value+" no existe", linea: this.line, columna : this.column}
        } 

             
            if(varia.type != arr.typeArray ){
               if(varia.type == Type.ANY){
                   
                   newEnv.guardar(varia.id,varia.valor,arr.typeArray,varia.tipoVar,varia.listaVal,varia.typeArray);
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable "+decla.value+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+decla.value+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any", linea: this.line, columna : this.column}
               }
            }
              varia = newEnv.getVar(decla.value); 

            for (let a of arr.valor) {
                //let m = parseInt(a, 10);
                newEnv.guardar(varia.id,a,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                const element = this.code.execute(newEnv);//
              if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
             }
             arr = newEnv.getVar(this.arreglo);
           }



        }else if(this.tipo == 4){

            let varia = env.getVar(this.declaracion);         
            let arr = env.getVar(this.arreglo);
           if(arr == null ){
               let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.arreglo+" no existe");
               errores.push(errorN);
               throw {error: "Semantico: Semantico:La variable"+this.arreglo+" no existe", linea: this.line, columna : this.column}
           } 

           if(varia == null ){
            let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" no existe");
            errores.push(errorN);
            throw {error: "Semantico: Semantico:La variable"+this.declaracion+" no existe", linea: this.line, columna : this.column}
        } 

             let bandera = false;
            if(varia.type != arr.typeArray ){
               if(varia.type == Type.ANY){
                   bandera = true;
                env.guardar(varia.id,varia.valor,arr.typeArray,varia.tipoVar,varia.listaVal,varia.typeArray);
               }else{
                let errorN = new Error_(this.line,this.column,"Semantico","La variable "+this.declaracion+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any");
                errores.push(errorN);
                throw {error: "Semantico: Semantico:La variable "+this.declaracion+" debe de ser del mismo tipo que el arreglo a recorrer o de tipo any", linea: this.line, columna : this.column}
               }
            }
              varia = env.getVar(this.declaracion); 

            for (let a of arr.valor) {
                //let m = parseInt(a, 10);
               env.guardar(varia.id,a,varia.type,varia.tipoVar,varia.listaVal,varia.typeArray);
                const element = this.code.execute(env );//
              if(element != null || element != undefined){
                console.log(element);
                if(element.type == 'Break')
                    break;
                else if(element.type == 'Continue')
                    continue;
             }
             arr = env.getVar(this.arreglo);
           }
            
        }
    }
}