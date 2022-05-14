import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ParsingExpression extends Chanters {
  static get template() {
    return html`
      <div>
        <button on-click="{{handleClick}}">change flag</button>
        <h1>{{flag}}</h1>
        <span if="{{flag}}">show</span>
      </div>
    `;
  }

  static get properties() {
    return {
      flag: false,
    };
  }

  handleClick() {
    this.flag = !this.flag;
  }
}

customElements.define("parsing-expressions", ParsingExpression);
