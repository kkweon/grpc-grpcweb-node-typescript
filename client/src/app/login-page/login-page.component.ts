import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService } from '../user.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  username: string
  constructor(private router: Router, private userService: UserService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.userService.username = this.username
      this.router.navigate(['/chat'])
    }
  }
}
