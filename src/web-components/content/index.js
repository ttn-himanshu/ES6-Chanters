import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ChantersContent extends Chanters {
  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";

        :host {
          position: relative;
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
          <chanters-login></chanters-login>
        </wrapper>
      </div>
    `;
  }

  static get properties() {
    return {
        visibility: "show",
    };
  }
}

customElements.define("chanters-content", ChantersContent);
