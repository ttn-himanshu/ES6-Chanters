import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ParsingExpression extends Chanters {
  static get template() {
    return html`
      <div>
        <button on-click="{{handleClick}}">change flag</button>
        <h1>{{flag}}</h1>
        <template if="{{flag}}">
          <div>flag = {{flag}}</div>
          <div>flag2 = {{flag2}}</div>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      flag: true,
      flag2: 2,
    };
  }

  handleClick() {
    this.flag = !this.flag;
  }
}

customElements.define("parsing-expressions", ParsingExpression);
