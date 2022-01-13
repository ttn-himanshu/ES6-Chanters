import { forLoop, keys } from "./utils.js";
import Getters from "./Getters.js";
import Setters from "./Setters.js";

export default class WebComponent {
  constructor(customElement, proto) {
    this.customElement = customElement;
    this.proto = proto;
    this.initializeComponent();
    this.beginWork();
    // console.log("proto/state", this.proto);
  }

  beginWork = () => {
    const { customElement, proto } = this;
    this.walkNodes(customElement.shadowRoot, (node) => {
      /**
       * Get all the binding in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      const nodeObject = new Getters(node, customElement, proto);

      /**
       * Set all the bindings in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      if (keys(nodeObject).length) {
        new Setters(node, nodeObject, customElement, proto);
      }
    });
  };

  /**
   *  Recursive loop for html node
   *  node parser
   **/
  walkNodes = (node, callback) => {
    if (node.childNodes.length > 0) {
      let child = node.firstChild;
      while (child) {
        if (callback && typeof callback === "function") callback(child);

        this.walkNodes(child, callback);
        child = child.nextSibling;
      }
    }
  };

  initializeComponent = () => {
    const { customElement, proto } = this;
    customElement.$ = {};
    if (keys(customElement.dataset).length)
      forLoop(customElement.dataset, function (key, value) {
        proto[key] = value;
      });
  };
}
