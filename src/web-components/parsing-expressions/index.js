import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ParsingExpression extends Chanters {
  static get template() {
    return html`
      <div>
        <button on-click="{{handleClick}}">change flag</button>
        <h1>{{flag}}</h1>
        <template if="{{flag}}">
          <span>rendered when {{flag}} is true</span>
        </template>

        <template if="{{flag}} === false && {{flag2}} === 3">
          <span>rendered when {{flag}} {{flag2}} is false</span>
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
