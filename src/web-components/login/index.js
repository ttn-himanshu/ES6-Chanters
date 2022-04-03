import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ChantersLogin extends Chanters {
  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";
        @import "src/style/login.css";
        @import "src/style/media.css";
        :host {
          position: relative;
        }
      </style>
      <div id="login" style="display: {{display}}">
        <div class="login-wrap border light-div box-shadow-inset">
          <div class="dark-div btm-border">
            <button
              class="form-text btn-login txt-shadow cursor-pointer"
              title="Click here to Login"
              on-click="{{goToPlayer}}"
            >
              Login
            </button>
          </div>
          <div class="form-wrap btm-border">
            <input
              type="email"
              value="{{email}}"
              autofocus
              class="form-text email"
              placeholder="Email address"
            />
          </div>
          <div class="form-wrap">
            <input
              type="text"
              value="{{userName}}"
              placeholder="User Name"
              class="form-text password"
            />
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      loggedIn: false,
      display: "block",
      userName: "",
      email: "",
    };
  }

  onReady() {
    if (localStorage && !localStorage.chantersId)
      localStorage.chantersId = Math.random();
  }

  goToPlayer() {
    if (
      this.userName &&
      this.userName.trim() &&
      this.email &&
      this.email.trim()
    ) {
      localStorage.userName = this.userName;
      localStorage.email = this.email;
      this.props.onloginsuccess();
    } else {
      this.$.login.classList.add("loginFalse");

      setTimeout(
        function () {
          this.$.login.classList.remove("loginFalse");
        }.bind(this),
        1000
      );
    }
  }
}

customElements.define("chanters-login", ChantersLogin);
