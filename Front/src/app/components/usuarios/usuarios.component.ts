import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { user } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, NgFor, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{

  listUsers: user[] = [];
  userForm: FormGroup;
  display = 'none'

  nameUser = sessionStorage.getItem('userName');

  constructor( public logService: LoginService, 
    private usrService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.userForm = fb.group({
      Employee_ID: ['', Validators.required],
      Role: ['', Validators.required],
      Department: ['', Validators.required],
      Name: ['', Validators.required],
      LastName: ['', Validators.required],    
      Mail: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getUsuarios()
  }

  closeForm(){
    this.userForm.reset();
    this.display = 'none'
    sessionStorage.removeItem('usID')
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

  agregarUsuario(){
    const usID = sessionStorage.getItem('usID');
    const newUser: user = {
      Employee_ID: this.userForm.get('Employee_ID')?.value,
      Role: this.userForm.get('Role')?.value,
      Department: this.userForm.get('Department')?.value,
      Name: this.userForm.get('Name')?.value,
      LastName: this.userForm.get('LastName')?.value,
      Password: 'Vantec22',
      Mail: this.userForm.get('Mail')?.value,
      Active: true,
      ItsNew: true
    };

    if(usID !== null) {
      newUser.ItsNew = false
      this.usrService.editarUsuario(usID, newUser).subscribe({
        next: () => {
          this.toastr.success('','Informacion de usuario actualizado');
          this.getUsuarios();
          this.userForm.reset();
          sessionStorage.removeItem('usID');
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('No fue posible actualizar los datos', 'Error')
        }
      })
    } else {
      console.log(newUser);
      this.usrService.crearUsuario(newUser).subscribe({
        next: () => {
          this.toastr.success('', 'Usuario creado');
          this.getUsuarios();
          this.userForm.reset();
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('No fue posible crear el nuevo usuario', 'Error')
        }
      })
    }
  }

  getUserByID(id: any){
    this.display = 'block'
    sessionStorage.setItem('usID', id);
    this.usrService.obtenerUsuarioID(id).subscribe({
      next: (res) => {
        this.userForm.setValue({
          Employee_ID: res.result.Employee_ID,
          Role: res.result.Role,
          Department: res.result.Department,
          Name: res.result.Name,
          LastName: res.result.LastName,
          Mail: res.result.Mail,
        })
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible obtener la informacion', 'Error')
      }
    })
  }

  deleteUser(){
    this.usrService.eliminarUsuario(sessionStorage.getItem('usID')).subscribe({
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
