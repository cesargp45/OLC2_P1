import { Component,Input,OnInit  } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor/lib/models/code.model';
import { Instruction } from "./Interprete/Abstract/Instruction";
import { Environment } from "./Interprete/Symbol/Environment";
import { errores } from './Interprete/Errores';
import { Error_ } from "./Interprete/Error";
import { Function } from "./Interprete/Instruction/Function";
import { Declaration } from "./Interprete/Instruction/Declaration";
import { DeclarationArray2 } from "./Interprete/Instruction/DeclarationArray2";
 import {resultado} from "./Interprete/traduc"
import Parser from "./Grammar/Grammar.js";
import { Break } from './Interprete/Instruction/Break';
import { Simbolo } from "./Interprete/simbolo";
import { simbolog } from "./Interprete/simboloG";
import { simboloGlobal } from "./Interprete/simboloGlobal";
import { cont } from "./Interprete/contador";
import { Aumentar} from "./Interprete/contador";
import { Reiniciar } from "./Interprete/contador";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit  {
  er : Array<Error_> ;
  graphi : Array<Simbolo> ;
  simglobal : Array<Simbolo> ;
  textoConsola1: string = "";
  textoConsola2: string = "";
  ngOnInit() {
    //var tradut = textoTraducido;
    
  }

  title = 'proyecto1';
  theme = 'vs-dark';


  codeModel: CodeModel = {
    language: 'typescript',
    uri: 'main.ts',
    value: '',
    dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor']
  };
 

  options = {
  "lineNumbers": true,
  "contextmenu": false,
  "minimap": {
  "enabled": true
  }
  };

 
  
  onCodeChanged1(value) {        // recibe el valor de la consola 1
    this.textoConsola1 = value; 
  }
  onCodeChanged2(value2) {       // recibe el valor de la consola 2
    this.textoConsola2 = value2; 
  }
  






  public generarDot():void{
       try{
       Reiniciar();
      let dot:string = "digraph G { \n";
      let nodo= " Node"+cont;
      dot+=nodo+"[label=Global]; \n";
      Aumentar();

      const ast = Parser.parse(this.textoConsola1);
      const env = new Environment(null);
      
      if(ast[0]!= null){


    for (const instr of ast) {
      try {
                 
            if (instr instanceof Instruction) {
             
              dot += instr.getDot(nodo);
                           
            } 
       
      } catch (error) {
        
         console.log(error);
      }
    }
    dot+='}';

     console.log(dot);
   }
   }catch(error){

   }
  }





 public ejecutar():void{
     this.limpiar();
     
     
    try {
      const ast = Parser.parse(this.textoConsola1);
      const env = new Environment(null);
      
      if(ast[0]!= null){

        

         // primera pasada types



        // segunda pasada funciones

        for (const instr of ast) {
          try {
            if (instr instanceof Function) {
              //const instruccionE = instr.execute(env);
              const actual = instr.execute(env);

            } 
          } catch (error) {
            //ErrorTable.push(error);
             console.log(error);
          }
        }

       // tercera pada variables globales 


       for (const instr of ast) {
        try {
          if (instr instanceof Declaration || instr instanceof DeclarationArray2) {
            //const instruccionE = instr.execute(env);
            const actual = instr.execute(env);

          } 
        } catch (error) {
          //ErrorTable.push(error);
           console.log(error);
        }
      }






  // cuarta pasada ejecuta el codigo 

        for (const instr of ast) {
          try {
              if(instr instanceof Function || instr instanceof Declaration || instr instanceof DeclarationArray2){

              }else{

                if (instr instanceof Instruction) {
                  
                  const actual = instr.execute(env);
                  if(actual != null || actual != undefined){
                      
                      if(actual.type == 'Break'){
                       
                        let errorN = new Error_(actual.line,actual.column,"Semantico","Break fuera de ciclo");
                        errores.push(errorN);         
                        throw {error: "Semantico: Break fuera de ciclo", linea: actual.line, columna : actual.column};
                      }else if(actual.type == 'Continue'){
                       
                        let errorN = new Error_(actual.line,actual.column,"Semantico","Continue fuera de ciclo");
                        errores.push(errorN);         
                        throw {error: "Semantico: Continue fuera de ciclo", linea: actual.line, columna : actual.column};
                      }else if(actual.type == 'Return'){
                       
                        let errorN = new Error_(actual.line,actual.column,"Semantico","Return fuera de funcion");
                        errores.push(errorN);         
                        throw {error: "Semantico: Return fuera de funcion", linea: actual.line, columna : actual.column};
                      }
                       
                                         
                    }
                
                } else if (Array.isArray(instr)) {
                  for (const arr of instr) {
                    try {
                      console.log("pasa por el arreglo");
                      arr.execute(env);
                    } catch (error) {
                      // ErrorTable.push(error);
                      console.log(error);
                    }
                  }
                }

              }
            
          } catch (error) {
            //ErrorTable.push(error);
             console.log(error);
          }
        }

         env.imprimirLista();
         
        // imprimir la salida del codigo
         let salida ="";
        for (const it of resultado) {
             salida += it+'\n';
        }

         this.imprimirResult(salida);
       // terminasalida del codigo


        // imprimir errore
       console.log("lista de errores :");
       for (const it of errores) {
            console.log(it);
       }
       console.log("----------------");

       this.er = errores;
       this.graphi = simbolog;
       
        env.guardarSimGlobal();
        env.guardarFunGlobal();
        this.simglobal = simboloGlobal;

      } else{
        alert("No hay nada para analizar");
      }

      
     
  }
  catch (error) {
    console.log(error);
  }
  
   console.log(errores);

  }
  

    imprimir(){    
      alert(this.textoConsola1);       
    }

    imprimirResult(valor:any){
      (document.getElementById("C") as HTMLInputElement).value=valor;
    }
    
    limpiar(){
      (document.getElementById("C") as HTMLInputElement).value= "";
      
      while(resultado.length > 0){
        resultado.pop();   
      } 
      while(errores.length > 0){
         errores.pop();   
      }  
        
      while(simbolog.length > 0){
        simbolog.pop();   
     }

    }




}
