import { forLoop, isArray, setBindingVariables } from "./utils.js";
import { walkNodes } from "./WebComponent.js";
export default class Setters {
  constructor(...props) {
    const [node, nodeObject, customElement, proto] = props;
    this.node = node;
    this.nodeObject = nodeObject;
    this.customElement = customElement;
    this.proto = proto;

    this.beginWork();
  }

  beginWork() {
    const { nodeObject } = this;
    // console.log(this.node, nodeObject)
    forLoop(nodeObject, (bindingType, item) => {
      if (isArray(item)) {
        forLoop(item, (bindingObject) => {
          switch (bindingType) {
            case "TextContent":
              this.__SetterTextNodes__(bindingObject);
              break;
            case "Attribute":
              this.__Setter__Attribute(bindingObject);
              break;
            case "Event":
              this.__Setter__Events(bindingObject);
              break;
            case "Repeater":
              this.__Setter__Repeaters(bindingObject);
              break;
          }
        });
      }
    });
  }

  __Setter__Repeaters(bindingObject) {
    forLoop(bindingObject.targetArray, function (item, index) {
      const { templateClone } = bindingObject;

      var instance = document.importNode(templateClone.content, true);

      (function (instance) {
        walkNodes(instance, function (n) {
          n.processedNode = true;
          n.iteratorKey = bindingObject.raw + "." + index;
        });

        bindingObject.parentNode.insertBefore(
          instance,
          bindingObject.nextSibling
        );
      })(instance);
    });
    // WebComponent.templateObject = bindingObject;
  }

  __Setter__Attribute(bindingObject) {
    const { node, customElement } = this;
    const { keys, values, raw: nodeText } = bindingObject;

    const value = setBindingVariables(
      nodeText,
      keys,
      values,
      customElement.nodeName
    );

    node.setAttribute(bindingObject.attributeName, value);
  }

  __Setter__Events(bindingObject) {
    const { node, proto } = this;

    node.addEventListener(
      bindingObject.eventName,
      function (event) {
        event.stopPropagation();
        let arr = [event];
        // if (bindingObject.arguments && bindingObject.arguments.length)
        //   arr = arr.concat(bindingObject.arguments);

        bindingObject.functionBody.apply(proto, arr);
        event.preventDefault();
      },
      true
    );
  }

  __SetterTextNodes__(bindingObject) {
    const { node, customElement } = this;
    const { keys, values, raw } = bindingObject;

    node.textContent = setBindingVariables(
      raw,
      keys,
      values,
      customElement.nodeName
    );
  }
}
