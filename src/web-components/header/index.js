import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ChantersHeader extends Chanters {
  static get template() {
    return html`
      <style>
        @import "src/web-components/header/logo.css";
        @import "src/style/chanters.css";

        #mode {
          left: 20px;
          height: 20px;
          width: 20px;
          position: relative;
          top: 12px;
          cursor: pointer;
        }
        #analyser {
          height: 38px;
        }
      </style>
      <div
        id="header"
        class="header btm-border dark-div fixed-top z-index-pinnacle"
      >
        <div id="logo" class="border">
          <canvas id="analyser"></canvas>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      firstProperty: "click me",
      item: "custom element",
      primary: "btn-primary",
      default: "btn-size-default",
      emplyeeList: [
        { name: "himanshu", age: 36 },
        { name: "kiran", age: 36 },
        { name: "ivu", age: 3 },
      ],
      deepObject: {
        user: {
          name: "input binding",
        },
      },
    };
  }
}

customElements.define("chanters-header", ChantersHeader);
