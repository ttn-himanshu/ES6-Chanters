import { attachEvents, uuidv4 } from './utils.js';

export default class Chanters extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  /**
   * @initialize the new custom Element
   * */
  init = () => {
    this.magicHappened();
    this?.componentDidMount();
  };

  magicHappened() {
    const { constructor: { properties } } = this;

    Object.keys(properties).forEach((key) => {
      this[key] = properties[key];
    });

    const stringHTML = this?.render();
    if (stringHTML && typeof stringHTML === "string")
      this.attachShadowRoot(stringHTML);
  }

  attachShadowRoot = (stringHTML) => {
    const template = document.createElement('template');
    template.innerHTML = stringHTML;
    const clone = document.importNode(template.content, true);

    /**
     * attaching events
     **/
    attachEvents(clone);
    this.attachShadow({ mode: 'open' }).appendChild(clone);
  };
}

export const html = function html(strings, ...values) {
  if (values.length) {
    const ChantersID = uuidv4();
    const identifiers = values.map(() => `$${ChantersID}`);
    return String.raw({ raw: strings }, ...identifiers);
  }

  return String.raw({ raw: strings }, ...values);
  // const clone = [...strings];
  // let iterator = 1;
  // // clone.forEach((item, index) => {
  // //   console.log(item);

  // // });

  // values.forEach((item, index) => {
  //   /**
  //    * todo:: stuck in finding a way how to get the value of input type = text
  //    */
  //   const newItem = typeof item !=="function" ? "<!--?lit$760121965$-->"+item : item;
  //   clone.splice(index + iterator, 0, newItem);
  //   iterator++;
  // });

  // 14feb
  // use below code to get the binding variable names from the render method
  // this.render.toString().match(/\${\s*[\w\.]+\s*}/g)

  // return clone.join("");
};
