import { NgModule, ɵɵclassMapInterpolate1 } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { MainComponent } from './main/main.component'
import { LoginPageComponent } from './login-page/login-page.component'
import { IsUsernameProvidedGuard } from './is-username-provided.guard'

const routes: Routes = [
  {
    path: 'chat',
    component: MainComponent,
    // canActivate: [IsUsernameProvidedGuard],
  },
  {
    path: '**',
    component: LoginPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
