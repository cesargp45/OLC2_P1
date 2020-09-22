import { Environment } from "../Symbol/Environment";
import { Expression } from "../Abstract/Expression";
import { Retorno, Type } from "../Abstract/Retorno";
import { Arreglo } from "../Objects/Array";
import {Error_} from "../Error";
import {errores} from "../Errores";

export class DecArray extends Expression{

    constructor(private values: Expression[] , line: number,column:number){
              super(line,column);
    }


    
    public execute(environment:Environment){

        let arrayValues = new Array;
        let type:Type = Type.ARRAY;
        let dim = 1;
        let tipoDatos;
        let tipoDatos2 = null;
        this.values.forEach((value) => {
            const expr = value.execute(environment);
           // dim = (expr.dim || 0)+1; 
            tipoDatos = expr.type;
             if(tipoDatos != Type.ARRAY){
                 if(tipoDatos2 == null ||tipoDatos2 == tipoDatos){
                       tipoDatos2 = tipoDatos;
                 }else{
                    let errorN = new Error_(this.line,this.column,"Semantico","Los arreglos tienen que ser de un mismo tipo de dato");
                    errores.push(errorN);         
                    throw {error: "Semantico: Los arreglos tienen que ser de un mismo tipo de dato", linea: this.line, columna : this.column};
                    
                 }
                
             }           
            arrayValues.push(expr.value);
            //type = expr.type

        });
               
        type = tipoDatos2;
        let newArray = new Arreglo(type,arrayValues,dim);
        return {value: newArray , type:Type.ARRAY,dim:1};
    }



}