import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { numParte } from '../../interfaces/interfaces';
import { NumPartesService } from '../../services/num-partes.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-num-partes',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './num-partes.component.html',
  styleUrl: './num-partes.component.css'
})

export class NumPartesComponent implements OnInit{

  titulo = 'Nuevo numero de parte'
  numParteForm: FormGroup; //Crea formulario para agregar numero de parte
  listNumPartes: numParte[] = []; //Llamada de la interface para listar numeros de parte activados
  listNumPartDes: numParte[] = []; //Llamada de la interface para listar numeros de parte desactivados
  nameUser = sessionStorage.getItem('userName');

  constructor(private _numParteService: NumPartesService, public logService: LoginService,
    private fb: FormBuilder, private toastr: ToastrService, private aRoute: ActivatedRoute
  ) {
    this.numParteForm = this.fb.group({
      NIssue: ['', Validators.required],
      Npart: ['', Validators.required],
      Qty: ['', Validators.required],
      Desc: ['', Validators.required],
      DNFP: ['', Validators.required],
      TCode: ['', Validators.required],
      Project: ['', Validators.required],     //Constructor del formulario para agregar nuevo numero de parte
      IWeight: ['', Validators.required],
      Customer: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.obtenerNumPartes();  //Inicializa la funcion que obtiene los numeros de parte
    this.disabledNumPart(); //Inicializa la funcion que obtiene los numeros de parte desactivados  
  }

  //Agrega nuevo numero de parte
  agregarNumPart() {
    const idNumPart = sessionStorage.getItem('id'); //Obtiene el id del numero de parte 
    const NumParte: numParte = {
      NumIssue: this.numParteForm.get('NIssue')?.value,
      NumPart: this.numParteForm.get('Npart')?.value,
      Qty: this.numParteForm.get('Qty')?.value,
      Description: this.numParteForm.get('Desc')?.value,
      DNFP: this.numParteForm.get('DNFP')?.value,
      TestCode: this.numParteForm.get('TCode')?.value,
      Project: this.numParteForm.get('Project')?.value,
      IndividualWeight: this.numParteForm.get('IWeight')?.value,
      customer: this.numParteForm.get('Customer')?.value,
      Status: true
    };

    //Comprueba si el numero de parte ya existe por medio del id almacenado
    if (idNumPart !== null) {
      //Si ya existe lo actualiza
      this._numParteService.editNumpart(idNumPart, NumParte).subscribe({
        next: () => {
          this.toastr.success('', 'Numero de parte actualizado');
          this.obtenerNumPartes();  //Recarga el listado de numeros de parte para ver los cambios
          this.numParteForm.reset();  //Limpia el formulario
        }, error: (err) => {
          console.log(err);
          this.toastr.error('No fue posible actualizar los datos', 'Error');
        }
      })
    } else {  //Si no existe lo guarda como nuevo
      console.log(NumParte);
      //Guarda el nuevo numero de parte
      this._numParteService.saveNumPart(NumParte).subscribe({
        next: () => {
          this.toastr.success('', 'Nuevo numero de parte guardado');
          this.obtenerNumPartes();  //Recarga el listado de numeros de parte para ver los cambios
          this.numParteForm.reset();  //Limpia el formulario
        }, error: (err) => {
          console.log(err);
          this.toastr.error('No fue posible guardar los datos', 'Error')
          // this.numParteForm.reset() //Limpia el formulario para agregar numero de parte
        }
      })
    }
  };

  //Borra los datos de formulario al cerrar un modal
  closeForm() {
    this.numParteForm.reset();
    sessionStorage.removeItem('id');
  }

  //Desactiva numeros de parte modificando su status a false
  desactivarNumParte(id: any) {
    this._numParteService.disableNumPart(id).subscribe({
      next: () => {
        this.toastr.warning('El numero de parte se desactivo', 'Desactivado');
        this.obtenerNumPartes();   //Recarga el listado de numeros de parte para ver los cambios
        this.toggleButton();  //Oculta la columna de editado despues de recargado el listado
        this.disabledNumPart(); //Recarga el listado de numeros de parte desactivados para mostrar cambios
      }, error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible desactivar el numero de parte', 'Error')
      }
    })
  }

  //Activa de nuevo numero de parte modificando su status a true
  activNumParte(id: any) {
    this._numParteService.enableNumPart(id).subscribe({
      next: () => {
        this.toastr.success('El numero de parte fue activado', 'Activado');
        this.obtenerNumPartes(); //Recarga el listado de numeros de parte para ver los cambios
        this.disabledNumPart(); //Recarga el listado de numeros de parte desactivados para mostrar cambios
      }, error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible activar el numero de parte', 'Error')
      }
    })
  }

  //Esconde la columna para editar el numero de parte
  toggleButton() {
    $("#toggleCol").toggle();
    $("td:nth-child(1)").toggle();
  }

  //Lista todos los numeros de parte habilitados
  obtenerNumPartes() {
    this._numParteService.getNumParte().subscribe({
      next: (res) => {
        this.listNumPartes = res
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('No fue posible obtener la informacion', 'Error')
      }
    })
  }

  //Obtiene el numero de parte por su id
  obtenerNumParteID(id: any) {
    this.titulo = 'Editar numero de parte';
    sessionStorage.setItem('id', id);
    this._numParteService.getNumParteID(id).subscribe({
      next: (res) => {
        this.numParteForm.setValue({
          NIssue: res[0].NumIssue,
          Npart: res[0].NumPart,
          Qty: res[0].Qty,
          Desc: res[0].Description,
          DNFP: res[0].DNFP,
          TCode: res[0].TestCode,
          Project: res[0].Project,
          IWeight: res[0].IndividualWeight,
          Customer: res[0].customer
        })
      },
      error: (err) => {
        console.log(err)
        this.toastr.error('No fue posible obtener la informacion', 'Error')
      }
    })
  }

  //Lista todos los numeros de parte deshabilitados
  disabledNumPart() {
    this._numParteService.getNumParteDisable().subscribe({
      next: (res) => {
        this.listNumPartDes = res
      },
      error: (err) => {
        console.log(err)
        this.toastr.error('No fue posible obtener la informacion', 'Error')
      }
    })
  }

}
