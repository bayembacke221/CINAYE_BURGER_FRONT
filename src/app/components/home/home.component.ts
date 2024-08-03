import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    this.setupMobileMenu();
  }

  setupMobileMenu() {
    const btn = document.querySelector("button.mobile-menu-button");
    const menu = document.querySelector(".mobile-menu");

    if (btn && menu) {
      btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
    }
  }
}
