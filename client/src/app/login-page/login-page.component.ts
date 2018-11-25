import {Component, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {User} from "../shared/interfaces";

import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  password: string = '';
  fail = false;
  constructor(private  auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  aSub: Subscription;

  ngOnInit() {
  }

  onSubmit() {
      const user = {
        email: 'admin',
        password: this.password
      };
      this.aSub = this.auth.login(user).subscribe(
        () => {
          // редирект
          this.router.navigate(['/control'])
        },
        error => {
          this.fail = true;
          console.warn(error);
        }
      );
    }

}
