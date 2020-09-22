import { Component,Input,OnInit  } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor/lib/models/code.model';
import { Instruction } from "./Interprete/Abstract/Instruction";
import { Environment } from "./Interprete/Symbol/Environment";
import { errores } from './Interprete/Errores';
import { Error_ } from "./Interprete/Error";
import { Function } from "./Interprete/Instruction/Function";
import { Declaration } from "./Interprete/Instruction/Declaration";
import { DeclarationArray } from "./Interprete/Instruction/DeclarationArray";
//import Parser from "./Grammar/prueba.js";
import Parser from "./Grammar/Grammar.js";
import { Break } from './Interprete/Instruction/Break';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
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
  

  public ejecutar():void{
     
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
          if (instr instanceof Declaration || instr instanceof DeclarationArray) {
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
              if(instr instanceof Function || instr instanceof Declaration || instr instanceof DeclarationArray){

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

      (document.getElementById("consola2") as HTMLInputElement).value= "hola que tal";

    }

    imprimir2(){
     
      alert(this.textoConsola2);

    }



}
