import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { RouterLink } from '@angular/router';
import { numParte } from '../../interfaces/interfaces';
import { NumPartesService } from '../../services/num-partes.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    NgIf
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  info: any = null
  listProyectos: numParte[] = [];
  nameUser = sessionStorage.getItem('userName');

  constructor(
    public logService: LoginService, 
    private ServiceNumParte: NumPartesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerProyectos()
  }

  obtenerProyectos() {
    this.ServiceNumParte.getNumParte().subscribe({
      next: (res) => {
        this.listProyectos = res
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible obtener la informacion', 'Error')
      }
    })
  }

  obtenerInfoProject(id: any) {
    this.ServiceNumParte.getNumParteID(id).subscribe({
      next: (res) => {
        this.info = res
        sessionStorage.setItem('id', id)
      }
    })
  }
}
