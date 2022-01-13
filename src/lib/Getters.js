import {
  hasTextContent,
  getBindingVariables,
  getValuesFromKeys,
  createBindingObject,
  attributeIterator,
} from "./utils.js";
import { ChantersConstants } from "./Chanter_schema.js";

export default class Getters {
  constructor(...props) {
    const [node, customElement, proto] = props;
    this.node = node;
    this.nodeObject = new Object();
    this.customElement = customElement;
    this.proto = proto;
    this.__FilterNode__();
    return this.nodeObject;
  }

  __FilterNode__() {
    const { node } = this;

    if (node.nodeType === 8) {
      // ignore comment nodes
      return;
    }
    /**
     * only textNodes are available here
     * this part is important for text Binding
     **/
    if (hasTextContent(node) && node.childNodes.length < 1) {
      this.__GetterTextNodes__();
    } else if (node.nodeType === 1) {
      /**
       * non-textNodes
       * this part is important for attributes Binding and template repeat and conditions
       * this section is for attribute binding such as events and binding attribute with scope object
       *  node type===1
       **/
      if (node.attributes.length) {
        this.__GetterAttributes__();
      }
    }
  }

  /**
   * Create binding object for text nodes
   */
  __GetterTextNodes__() {
    const { node } = this;
    const keys = getBindingVariables(node.textContent);

    if (!keys) return;

    this.__CreateTextBindingObject__(keys);
  }
  /**
   * Create binding object for attributes
   */
  __GetterAttributes__() {
    const { node, customElement, proto, nodeObject } = this;

    // setting reference to node inside webcomponent
    if (node.id) webComponent.$[node.id] = node;

    attributeIterator(node, proto, nodeObject, customElement, (attr, keys) => {
      let bindingObject = this.__getAttributeSchema__(attr.name);
      bindingObject.values = getValuesFromKeys(keys, proto, customElement);

      bindingObject =
        bindingObject.bindingType === "Attribute"
          ? this.__CreateAttributeObject__(attr, keys, bindingObject)
          : this.__CreateEventObject__(attr, keys, bindingObject);

      createBindingObject(nodeObject, bindingObject);
    });
  }
  __CreateEventObject__(attr, keys, bindingObject, eventType) {
    const { node, nodeObject, customElement, proto } = this;
    let eventName = eventType || attr.name.split("on-")[1];

    (bindingObject.eventName = eventName),
      (bindingObject.functionBody = bindingObject.values[0]),
      (bindingObject.scopeVariable = keys),
      (bindingObject.raw = attr.value);

    return bindingObject;
  }

  __CreateAttributeObject__(attr, keys, bindingObject) {
    const { node, nodeObject, customElement, proto } = this;

    (bindingObject.raw = attr.value),
      (bindingObject.keys = keys),
      (bindingObject.attributeName = attr.name);

    return bindingObject;
  }

  __getAttributeSchema__(attrName) {
    const schemaName =
      attrName.indexOf("on-") !== -1 ? "EventObject" : "AttributeObject";
    return ChantersConstants(schemaName);
  }

  __CreateTextBindingObject__(keys) {
    const { node, proto, nodeObject } = this;
    const bindingObject = ChantersConstants("TextObect");

    bindingObject.keys = keys;
    bindingObject.raw = node.textContent.trim();
    bindingObject.values = getValuesFromKeys(keys, proto);

    createBindingObject(nodeObject, bindingObject);
  }
}
