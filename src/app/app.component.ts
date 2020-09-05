import { Component } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor/lib/models/code.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proyecto1';
  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'typescript',
    uri: 'main.ts',
    value: '',
    dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor'],
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  onCodeChanged(value) {
   // console.log('CODE', value);
  }


    obtenerTexto(){
      alert('que pasa pa');
      const area = document.getElementById('consola1') as HTMLOutputElement;
      alert(area.value);
    }


    







  
}
