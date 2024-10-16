import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  Login!: FormGroup;
  display: string = 'none'
  registerForm!: FormGroup;
  forgotForm!: FormGroup;

  constructor(private Loginhttp: LoginService,
    private router: Router, private fb: FormBuilder,
    private toastr: ToastrService, private el: ElementRef,
    private render: Renderer2
  ) { }

  ngOnInit(): void {
    this.LoginForm();
  }

  LoginForm() {
    this.Login = new FormGroup({
      NNomina: new FormControl('', [Validators.required]),
      contra: new FormControl('', [Validators.required])
    });

    this.registerForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
            ),
          ],
        ],
        // confirmPassword: ['', Validators.required],
      },      
    );

    this.forgotForm = new FormGroup({
      Nomina: new FormControl('', [Validators.required])
    })
  }

  verify() {
    this.Loginhttp.login(this.Login.value.NNomina, this.Login.value.contra).subscribe({
      next: (resp) => {
        if (!resp.user.ItsNew) {
          sessionStorage.setItem('jwt', resp.jwt);
          sessionStorage.setItem('user', JSON.stringify(resp.user));
          sessionStorage.setItem('userName', `${resp.user.Name} ${resp.user.LastName}`);
          this.toastr.success(`iniciaste sesion como ${resp.user.Name}`, 'Bienvenido');
          this.router.navigate(['inicio']);
        } else {
          const modalElement = this.el.nativeElement.querySelector('#exampleModal2');
          const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }

      }, error: (err) => {
        this.toastr.error('Verfica los datos ingresados', 'Datos invalidos');
      }
    })
  }

  sendMail() {
    this.Loginhttp.forgotPassword(this.forgotForm.get('Nomina')?.value).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.toastr.success('Verifique su correo electronico', 'Correo enviado');
          this.forgotForm.reset();
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Hubo un problema al intentar enviar el correo')
      }
    })
  }

  changePass() {
    this.Loginhttp.changePass(this.Login.get('NNomina')?.value, this.registerForm.get('password')?.value).subscribe({
      next: (resp) => {
        if (resp.ok) {
          this.toastr.success('Contraseña modificada con éxito', 'Contraseña cambiada');
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Error al intentar cambiar la contraseña', "Error")
      }
    })
  }
}
