import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ChantersContent extends Chanters {
  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";

        :host {
          position: relative;
          height: 100vh;
        }

        #view {
          position: relative;
          height: 100%;
          width: 100%;
          top: 40px;
          transition: all 0.5s linear 0.2s;
          overflow: hidden;
        }
      </style>
      <div class="z-index-center" id="view">
        <wrapper class="{{visibility}}">
          <chanters-login
            class="{{isLoggedIn}}"
            data-onloginsuccess="loginHandler"
          ></chanters-login>
          <chanters-menu id="menu"> </chanters-menu>
        </wrapper>
      </div>
    `;
  }

  static get properties() {
    return {
      visibility: "show",
      isLoggedIn: "show",
    };
  }

  onReady() {
    this.isLoggedIn = this.isAuthanticate() ? "hide" : "show";

    document.body.addEventListener("contextmenu", function (event) {
      return false;
    });

    this.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.setPosition(event);
      this.$.menu.visibility = "show";
    });
  }

  setPosition(e) {
    this.$.menu.$.menu.style.left = e.pageX + "px";
    this.$.menu.$.menu.style.top = e.pageY - 70 + "px";
  }

  loginHandler() {
    console.log("loginHandler called");
  }
  isAuthanticate() {
    if (localStorage.userName && localStorage.email) return true;
    else return false;
  }
}

customElements.define("chanters-content", ChantersContent);
