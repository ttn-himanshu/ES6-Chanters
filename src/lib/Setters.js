import { forLoop, isArray, setBindingVariables } from "./utils.js";
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
          }
        });
      }
    });
  }

  __Setter__Attribute(bindingObject) {
    // console.log(bindingObject);
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
