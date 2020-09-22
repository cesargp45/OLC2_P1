import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import {Error_} from "../Error";
import {errores} from "../Errores";



export class AccesoArray extends Expression{

    constructor(private id: string , private index:Expression, private anterior: Expression| null, line:number,column:number){
      super(line,column);
    }
   

    public execute(environment:Environment):Retorno{

        if(this.anterior == null){

            const vari =environment.getVar(this.id); //?.valor as Arreglo;//en vez de este casteo se mira si es arrelo o no
            if(vari == null){
                let errorN = new Error_(this.line,this.column,"Semantico","La variable no existe");
                errores.push(errorN);         
                throw {error: "Semantico:La variable no existe", linea: this.line, columna : this.column};
           }
            

           /* if(vari.type != Type.ARRAY){
                let errorN = new Error_(this.line,this.column,"Semantico","No puede acceder a la variable ya que no es un arreglo");
                errores.push(errorN);         
                throw {error: "Semantico: No puede acceder a la variable ya que no es un arreglo", linea: this.line, columna : this.column};
            }*/
            //console.log("si paso por aqui");
            const array = vari.valor;
            const indice = this.index.execute(environment);
            const value = array.getAtributo(Number(indice.value));

            return {value : value, type: array.tipo};
           

        }
        else{
           
            const anterior = this.anterior.execute(environment);
            const array = anterior.value ;// en vez de este casteo se mira si es arrelo o no
            
            console.log("valor: " +array + " tipo: "+anterior.type);

            if(anterior.type != Type.ARRAY ){
                let errorN = new Error_(this.line,this.column,"Semantico","No puede acceder al indice requerido");
                errores.push(errorN);         
                throw {error: "Semantico: No puede acceder al indice requerido", linea: this.line, columna : this.column};
            }
            const indice = this.index.execute(environment);
            const value = array.getAtributo(Number(indice.value));

            return {value,type:array.tipo};


        }

    }



}