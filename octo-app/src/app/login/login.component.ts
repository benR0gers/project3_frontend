import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CookieService} from 'angular2-cookie';

import { LoginService } from '../_service/login.service';
import { SystemUser } from '../_model/SystemUser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
  }

  login(username: string, password: string) {
    var c = this.cookieService;
    var r = this.router;

    this.loginService.login(username, password).then(function(user) {
      c.putObject('user', user);
      r.navigate(['/mainMenu']);
    });
    
  }
}
