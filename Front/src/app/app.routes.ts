import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { validAccessGuard } from './guards/valid-access.guard';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { NumPartesComponent } from './components/num-partes/num-partes.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent, canActivate: [validAccessGuard] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [validAccessGuard] },
    { path: 'checklist', component: ChecklistComponent, canActivate: [validAccessGuard] },
    { path: 'num-partes', component: NumPartesComponent, canActivate: [validAccessGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: LoginComponent }
];
