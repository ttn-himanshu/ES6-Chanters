import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ParsingExpression extends Chanters {
  static get template() {
    return html`
      <div>
        <input type="text" value="{{user.name}}" />
        <button on-click="{{handleClick}}">change flag value</button>

        <template if="{{user.name}}=='himanshu'">
          <h1>welcome himanshu</h1>
         
        </template>

        <template if="{{user.name}}=='kiran'">
          <h1>welcome Kiran</h1>
          <template if="{{user.age}} === 18">
            <h4>Congrats Kiran you are eligible for viting</h4>
          </template>
        </template>
      </div>
    `;
  }

  // <input type="text" value="{{user.age}}" />
  // <h1>{{user.name}}</h1>

   // <template if="{{user.age}} === 18">
          //   <h4>Congrats Himanshu you are eligible for viting</h4>
          // </template>
  static get properties() {
    return {
      user: {
        name: "himanshu",
        age: 0,
        flag: true,
      },
    };
  }

  handleClick() {
    this.user.age = this.user.age ? 0 : 18;
  }
}

customElements.define("parsing-expressions", ParsingExpression);
