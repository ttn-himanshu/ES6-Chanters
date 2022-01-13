import Chanters from "./Chanters.js";
import { html } from "./utils.js";

class ChantersHeader extends Chanters {
  static get template() {
    return html`
      <h1 on-click="{{handleClick}}" class="{{primary}}">{{item}}</h1>
      <p>this is a paragraph</p>
      this is a text node with id = {{number}}
      <!-- <h1>this is a comment node</h1> -->
    `;
  }

  static get properties() {
    return {
      firstProperty: "values",
      item: "custom element",
    };
  }

  handleClick() {
    console.log("onclick function executed", this);
  }
}

customElements.define("chanters-header", ChantersHeader);
