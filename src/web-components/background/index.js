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

        #backgroundContainer div {
            position: relative;
            width: 94%;
            margin: 0 auto;
            color: white;
        }
      </style>
      <chanters-notification id="notification" data-right="0" data-bottom="0" data-visibility="hide" data-message="Loading..."></chanters-notification>
        <img id="background" class="{{zIndex}}" src="{{backgroundImg}}">
        <section id="backgroundContainer" class="fixed-top z-index-pinnacle" style="display: none;top:50px">
            <div class="">
                <directory-structure></directory-structure>
            </div>
        </section>
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
