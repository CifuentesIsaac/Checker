import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { user } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{

  listUsers: user[] = [];

  nameUser = sessionStorage.getItem('userName');

  constructor( public logService: LoginService, 
    private usrService: UsuarioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUsuarios()
  }

  getUsuarios(){
    this.usrService.obtenerUsuarios().subscribe({
      next: (res) => {
        this.listUsers = res;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible obtener la informacion', 'Error interno')
      }
    })
  }

  getUserByID(id: any){
    sessionStorage.setItem('usID', id);
    this.usrService.obtenerUsuarioID
  }

  deleteUser(id: any){
    this.usrService.eliminarUsuario(id).subscribe({
      next: () => {
        this.toastr.warning('','Usuario eliminado');
        this.getUsuarios();
      }, 
      error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible eliminar el usuario', 'Error interno')
      }
    })
  }

}
