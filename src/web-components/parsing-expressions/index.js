import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ParsingExpression extends Chanters {
  static get template() {
    return html`
      <div>
       
        <template if="{{user.name}}=='himanshu'"> hurray1 </template>
        <template if="{{user.age}}==10"> hurray2 </template>
        <template if="{{user.flag}}"> hurray3 </template>
        <button on-click="{{handleClick}}">change flag value</button>
      </div>
    `;
  }

   // <input type="text" value="{{user.age}}" />
        // <h1>{{user.name}}</h1>
  static get properties() {
    return {
      user: {
        name: "himanshu",
        age: 0,
        flag: true
      },
    };
  }

  handleClick() {
    this.user.flag = !this.user.flag;
    this.user.age = this.user.age? 0:10;
    this.user.name ="sfdsfsd"
  }
}

customElements.define("parsing-expressions", ParsingExpression);
