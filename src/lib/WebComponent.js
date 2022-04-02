import { forLoop, keys } from "./utils.js";
import Getters from "./Getters.js";
import Setters from "./Setters.js";
import Observers from "./Observers.js";

export default class WebComponent {
  constructor(customElement, proto) {
    this.customElement = customElement;
    this.proto = proto;
    this.initializeComponent();
    this.beginWork();
  }

  beginWork = () => {
    const { customElement, proto } = this;
    var observer = new Observers(customElement, proto);
    customElement.templateInstance = new Object();

    walkNodes(customElement.shadowRoot, (node) => {
      /**
       * Get all the binding in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      const nodeObject = new Getters(node, customElement, proto);

      node.setAttribute && node.setAttribute("processed", "yes");
      /**
       * Set all the bindings in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      if (keys(nodeObject).length) {
        new Setters(node, nodeObject, customElement, proto);
        observer.__observe__(node, nodeObject);
      }
    });
  };

  ifParentIsAReapeater = (parent, child) => {
    if (parent.contains(child)) return true;
    return false;
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

/**
 *  Recursive loop for html node
 *  node parser
 **/
export const walkNodes = (node, callback) => {
  if (node.childNodes.length > 0) {
    let child = node.firstChild;
    while (child) {
      if (callback && typeof callback === "function") callback(child);

      walkNodes(child, callback);
      child = child.nextSibling;
    }
  }
};
