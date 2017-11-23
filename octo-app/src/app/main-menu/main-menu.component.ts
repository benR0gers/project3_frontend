import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie';

import { SystemUser } from '../_model/SystemUser';
import { ScrumBoard } from '../_model/ScrumBoard';
import { BoardService } from '../_service/board.service';
import { LoginService } from '../_service/login.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  user: SystemUser;

  // user: SystemUser = {
  //   id: 1,
  //   username: "im",
  //   password: "dabes",
  //   firstName: "Cool",
  //   lastName: "Guy",
  //   role: 200, 
  //   enabled: true, 
  //   accountNonExpired: true,
  //   accountNonLocked: true,
  //   credentialsNonExpired: true
  // };
  boards: ScrumBoard[];
  constructor(private router: Router, private route: ActivatedRoute, private loginService: LoginService, private boardService: BoardService, private cookieService: CookieService) { }


  ngOnInit() {
    var currentUser = this.cookieService.getObject('user');
    var loggedIn = this.loginService.isLoggedIn(currentUser);

    if(loggedIn){
      this.user = currentUser;
      this.boards = this.boardService.getBoardsByUserID(this.user.id);
    }else{
      this.router.navigate(['/login']);
    }
  }

  percentComplete(b: ScrumBoard): string {
    //insert percentage calculation logic call here
    return 40+"%";
  }

  createScrumBoard() {
    console.log("create scrum board method!");
    this.router.navigate(['/createUpdateBoard', true, 0]); //creating a board shouldn't need a board ID
  }

  viewBoard(b: ScrumBoard) {
    console.log(b.name + "'s view scrum board method! board ID is: "+b.id);
    this.router.navigate(['/boardStoryLanes', b.id]);
  }

  editScrumBoard(b: ScrumBoard){
    console.log(b.name + "'s edit scrum board method! board ID is: "+b.id);
    this.router.navigate(['/createUpdateBoard', false, b.id]); //true means creating, false means editing
  }

  getAllUsers(b: ScrumBoard){
    console.log(b.name + "'s get users view method! board ID is: "+b.id);
    this.router.navigate(['/assignMembers', b.id]);
  }

  triggerModal(b: ScrumBoard){
    console.log(b.name + "'s trigger delete board method!");
  }

}
