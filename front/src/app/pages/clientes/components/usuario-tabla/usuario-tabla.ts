import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'usuario-tabla',
  imports: [],
  templateUrl: './usuario-tabla.html',
  styleUrl: './usuario-tabla.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioTabla {
  listaUsuarios = input<any[]>([]);

  // 2. Definimos los outputs por si el padre tiene que reaccionar al Ver/Editar
  onVer = output<any>();
  onEditar = output<any>();

  verUsuario(usuario: any) {
    this.onVer.emit(usuario);
  }

  editarUsuario(usuario: any) {
    this.onEditar.emit(usuario);
  }

}
