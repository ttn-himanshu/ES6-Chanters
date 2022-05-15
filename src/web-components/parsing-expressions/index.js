import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ParsingExpression extends Chanters {
  static get template() {
    return html`
      <div>
        <input type="text" value="{{user.age}}" />
        <h1>{{user.name}}</h1>
        <template if="{{user.age}}==0"> hurray1 </template>
        <template if="{{user.age}}==10"> hurray2 </template>
      </div>
    `;
  }

  static get properties() {
    return {
      user: {
        name: "himanshu",
        age: 0,
      },
    };
  }

  handleClick() {
    this.flag = !this.flag;
  }
}

customElements.define("parsing-expressions", ParsingExpression);
