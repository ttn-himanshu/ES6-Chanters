import Chanters, { html } from "../../index.js";

class TableComponent extends Chanters {
  constructor() {
    super(...arguments);
  }

  static get properties() {
    return {
      list: ['Peas', 'Carrots', 'Tomatoes'],
      condition: true,
      title: "Render content conditionally"
    };
  }

  componentDidMount() {
  }
  
  onChange() {
    this.title = "sdfsfsdfsdf";
  }



  render() {
    return html`
      <p>${this.title}:</p>
      ${this.condition
        ? html`
            <p>Render some HTML if condition is true.</p>
          `
        : html`
            <p>Render some other HTML if condition is false.</p>
          `
      }
      <label>I'm button</label>
      <button @click="${() => { this.condition = !this.condition; }}">Toggle condition1</button>
      <button @click="${() => { this.condition1 = !this.condition1; }}">Toggle condition2</button>
      <div>
        <input type="text" .value="${this.onChange}" />
      </div>
    `;
  }
}

customElements.define("table-component", TableComponent);
// render() {
//   // console.log("render executed");

//   return html`
//     <p>Render a list:</p>
//     <ul>
//       ${this.list.map((item, index) => html`<li>${index}: ${item}</li>`)}
//     </ul>
//   `;`
// }
