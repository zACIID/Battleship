import { Component, OnInit } from '@angular/core';
import { faAnchor } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'game-button',
  templateUrl: './game-button.component.html',
  styleUrls: ['./game-button.component.css']
})
export class GameButtonComponent implements OnInit {


  faAnchor = faAnchor;

  constructor() { }

  ngOnInit(): void {
  }

}
