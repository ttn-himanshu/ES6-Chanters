import { forLoop, keys } from "./utils.js";
import Getters from "./Getters.js";
import Setters from "./Setters.js";

export default class WebComponent {
  constructor(customElement, proto) {
    this.customElement = customElement;
    this.proto = proto;
    this.initializeComponent();
    this.beginWork();
  }

  beginWork = () => {
    const { customElement, proto } = this;
    walkNodes(customElement.shadowRoot, (node) => {
      // if (
      //   this.repeaterNode &&
      //   this.ifParentIsAReapeater(this.repeaterNode, node)
      // ) {
      //   return;
      // }

      /**
       * Get all the binding in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      const nodeObject = new Getters(node, customElement, proto);

      if (node.repeater) {
        this.repeaterNode = node;
        // node.parentCustomElemnt = customElement;
        // node.nodeObject = nodeObject;
      }

      node.setAttribute && node.setAttribute("processed", "yes");
      /**
       * Set all the bindings in a node
       * @textBinding @attributeBinding - like @events, @id(ref)
       */
      if (keys(nodeObject).length) {
        new Setters(node, nodeObject, customElement, proto);
      }
    });
  };

  ifParentIsAReapeater = (parent, child) => {
    if (parent.contains(child)) return true;
    return false;
  };

  /**
   *  Recursive loop for html node
   *  node parser
   **/
  // walkNodes = (node, callback) => {
  //   if (node.childNodes.length > 0) {
  //     let child = node.firstChild;
  //     while (child) {
  //       if (callback && typeof callback === "function") callback(child);

  //       this.walkNodes(child, callback);
  //       child = child.nextSibling;
  //     }
  //   }
  // };

  initializeComponent = () => {
    const { customElement, proto } = this;
    customElement.$ = {};
    if (keys(customElement.dataset).length)
      forLoop(customElement.dataset, function (key, value) {
        proto[key] = value;
      });
  };
}

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
