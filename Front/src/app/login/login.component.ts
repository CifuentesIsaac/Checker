import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit{
  Login!:FormGroup;
  display: string = 'none'
  registerForm!: FormGroup;

  constructor(private Loginhttp: LoginService,
    private router: Router, private fb: FormBuilder, private toastr: ToastrService,    
   ) {}

   ngOnInit(): void {
    this.LoginForm();     
   }

   LoginForm(){
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
        confirmPassword: ['',Validators.required],
      },
      {}
    );
   }

  verify(){
    this.Loginhttp.login(this.Login.value.NNomina, this.Login.value.contra).subscribe({
      next:(resp) =>{
        if(!resp.user.ItsNew){          
          sessionStorage.setItem('jwt', resp.jwt);
          sessionStorage.setItem('user', JSON.stringify(resp.user));
          sessionStorage.setItem('userName', `${resp.user.Name} ${resp.user.LastName}`);  
          this.toastr.success(`iniciaste sesion como ${resp.user.Name}`,'Bienvenido'); 
          this.router.navigate(['inicio']);                           
        } else {
          console.log(resp);
        }               

      }, error:(err) =>{                
        this.toastr.error('Verfica los datos ingresados','Datos invalidos');        
      }
    })
  }
}
