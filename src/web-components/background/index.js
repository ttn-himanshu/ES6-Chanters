import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ChantersBackground extends Chanters {
  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";
        :host {
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        img {
          min-width: 100%;
          min-height: 100%;
        }
      </style>
      <div>
        <img id="background" class="{{zIndex}}" src="{{backgroundImg}}" />
      </div>
    `;
  }

  static get properties() {
    return {
      backgroundImg:
        localStorage.getItem("backgroundImgUrl") ||
        "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
      zIndex: "z-index-center",
    };
  }

  handleClick() {
    console.log("onclick function executed", this);
  }
}

customElements.define("chanters-background", ChantersBackground);
