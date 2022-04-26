import {
  hasTextContent,
  getBindingVariables,
  getValuesFromKeys,
  createBindingObject,
  attributeIterator,
  html,
  setBindingVariables,
  getAttributeByName,
  getObject,
  getFunctionArguments,
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
    const { node, nodeObject } = this;
    let keys = getBindingVariables(node.textContent);

    if (!keys) return;

    if (node.processedNode){
      keys = this.handleRepeaterKeys(keys, node, nodeObject, "textContent");
    }

    this.__CreateTextBindingObject__(keys);
  }

  __GetterInput__(node, prototype, nodeObject, webComponent) {
    var key = getBindingVariables(node.value)[0];
    if (key) {
      var attr = getAttributeByName("value", node);

      let bindingObject = ChantersConstants("EventObject");
      bindingObject.values = [inputCallback];
      bindingObject = this.__CreateEventObject__(
        attr[0],
        key,
        bindingObject,
        "input"
      );

      createBindingObject(nodeObject, bindingObject);

      function inputCallback(event) {
        webComponent.target = event.target;
        const key = bindingObject.scopeVariable;
        const obj = getObject(webComponent, key);
        obj[key.split(".").pop()] = node.value;
      }
    }
  }

  /**
   * Create binding object for attributes
   */
  __GetterAttributes__() {
    const { node, customElement, proto, nodeObject } = this;

    // setting reference to node inside webcomponent
    if (node.id) customElement.$[node.id] = node;

    if (node.nodeName === "INPUT" && node.value.indexOf("{{") !== -1) {
      this.__GetterInput__(node, proto, nodeObject, customElement);
    }

    attributeIterator(
      node,
      proto,
      nodeObject,
      customElement,
      (attr, keys, isRepeater) => {
        /**
         * handling for repeaters, now custom element
         * template repeat will handle by template repeat
         * first custome element of the library
         */
        if (isRepeater) {
          node.repeater = true;
          this.__CreateRepeater__Object(attr);
          return;
        }

        if (node.processedNode){
          keys = this.handleRepeaterKeys(keys, node, nodeObject, "attribute", attr);
        }

        let bindingObject = this.__getAttributeSchema__(attr.name);
        bindingObject.values = getValuesFromKeys(
          keys,
          proto,
          customElement,
          node,
          nodeObject
        );

        bindingObject =
          bindingObject.bindingType === "Attribute"
            ? this.__CreateAttributeObject__(attr, keys, bindingObject)
            : this.__CreateEventObject__(attr, keys, bindingObject);

        createBindingObject(nodeObject, bindingObject);
      }
    );
  }

  __CreateRepeater__Object(attr) {
    const { proto, node, nodeObject, customElement } = this;
    const bindingObject = ChantersConstants("repeaterObject").parsingLevel;
    bindingObject.raw = attr.nodeValue;
    bindingObject.targetKey = attr.nodeName;
    bindingObject.targetArray = proto[attr.nodeValue];
    bindingObject.proto = proto;
    bindingObject.template = node;
    bindingObject.templateClone = html([node.innerHTML]);
    bindingObject.parentCustomElemnt = customElement;
    bindingObject.nextSibling = node.nextSibling;
    bindingObject.parentNode = node.parentNode;
    createBindingObject(nodeObject, bindingObject);
  }

  __CreateEventObject__(attr, keys, bindingObject, eventType) {
    const { node, nodeObject, customElement, proto } = this;
    let eventName = eventType || attr.name.split("on-")[1];

    (bindingObject.eventName = eventName),
      (bindingObject.functionBody = bindingObject.values[0]),
      (bindingObject.scopeVariable = keys),
      (bindingObject.raw = attr.value);

    if (attr.value.indexOf("(") !== -1) {
      bindingObject.arguments = getFunctionArguments(attr.value);
    }

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
    const { node, proto, nodeObject, customElement } = this;
    const bindingObject = ChantersConstants("TextObect");

    bindingObject.keys = keys;
    bindingObject.raw = node.textContent.trim();
    bindingObject.values = getValuesFromKeys(
      keys,
      proto,
      customElement,
      node,
      nodeObject
    );

    createBindingObject(nodeObject, bindingObject);
  }

  handleRepeaterKeys(keys, node, nodeObject, type, attr) {
    var _from = keys;
    var _with = [];
    let _keys = [];
    var iteratorKey = node.iteratorKey;

    _with = keys.map((item) => {
      item = item.replace("item", iteratorKey);
      _keys.push(item);
      return "{{" + item + "}}";
    });

    if (type === "textContent")
      node.textContent = setBindingVariables(node.textContent, _from, _with);
    else if (type === "attribute") {
      node.setAttribute(
        attr.name,
        setBindingVariables(attr.value, _from, _with)
      );
    }

    return _keys;
  }
}
