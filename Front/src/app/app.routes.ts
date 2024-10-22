import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { validAccessGuard } from './guards/valid-access.guard';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent, canActivate: [validAccessGuard] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [validAccessGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: LoginComponent }
];
