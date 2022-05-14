import {
  forLoop,
  isArray,
  setBindingVariables,
  keys,
  getFunctionParameters,
} from "./utils.js";
import { walkNodes } from "./WebComponent.js";
import Getters from "./Getters.js";
import { executeCondition } from "./ConditionExecuter.js";
export default class Setters {
  constructor(...props) {
    const [node, nodeObject, customElement, proto, observer] = props;
    this.node = node;
    this.nodeObject = nodeObject;
    this.customElement = customElement;
    this.proto = proto;
    this.observer = observer;

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
            case "If":
              this.__Setter__Condition(bindingObject);
              break;
          }
        });
      }
    });
  }

  __Setter__Condition(bindingObject) {
    // console.log("__Setter__Condition", bindingObject);
    const { node, customElement } = this;
    const { keys, values, raw: nodeText, templateClone } = bindingObject;

    const parsedCondition = setBindingVariables(
      nodeText,
      keys,
      values,
      customElement.nodeName
    );
    bindingObject.value = executeCondition(parsedCondition);
    node.setAttribute("if", bindingObject.value);

    if (bindingObject.value) {
      const instance = document.importNode(templateClone.content, true);
      bindingObject.parentNode.insertBefore(
        instance,
        bindingObject.nextSibling
      );
    }
  }

  setRepeaterBoundary(bindingObject, type) {
    const { template, raw } = bindingObject;
    if (template) {
      const comment = document.createComment(`${type} of array ${raw}`);
      bindingObject.parentNode.insertBefore(comment, bindingObject.nextSibling);
      bindingObject[type] = comment;
    }
  }

  __Setter__Repeaters(bindingObject) {
    this.setRepeaterBoundary(bindingObject, "start");
    this.executeRepeaters(bindingObject);
    this.setRepeaterBoundary(bindingObject, "end");
    bindingObject.nextSibling = bindingObject.end;

    /**
     * Observing array changes
     */
    bindingObject.targetArray = this.observer.observeArray(
      bindingObject,
      this.executeRepeaters.bind(this)
    );

    this.customElement[bindingObject.raw] = bindingObject.targetArray;
  }

  /**
   *  below mthod executes on load and
   *  after array length changes
   */
  executeRepeaters(bindingObject, reParsing) {
    if (reParsing) {
      this.cleanUp(bindingObject);
    }
    forLoop(bindingObject.targetArray, (item, index) => {
      const { templateClone } = bindingObject;

      const instance = document.importNode(templateClone.content, true);

      ((instance) => {
        walkNodes(instance, (node) => {
          node.processedNode = true;
          node.setAttribute && node.setAttribute("processed", "yes");
          node.iteratorKey = bindingObject.raw + "." + index;
          node.alias = bindingObject.alias;
          if (reParsing) {
            const nodeObject = new Getters(
              node,
              this.customElement,
              this.proto
            );
            if (keys(nodeObject).length) {
              this.nodeObject = nodeObject;
              this.node = node;
              this.beginWork();
              this.observer.observe(node, nodeObject, reParsing);
            }
          }
        });

        bindingObject.parentNode.insertBefore(
          instance,
          bindingObject.nextSibling
        );
      })(instance);
    });
  }

  cleanUp(bindingObject) {
    const { parentNode, start, end } = bindingObject;
    let canDelete = false;

    /**
     * removing repeaters previously created node
     */
    var prev;
    for (var child = parentNode.lastChild; child; child = prev) {
      prev = child.previousSibling;
      if (child === end) {
        canDelete = true;
        continue;
      }
      if (child === start) {
        canDelete = false;
      }
      if (canDelete) {
        parentNode.removeChild(child);
      }
    }

    /**
     * Cleaning up custom element's
     * template instance.
     */

    for (let key in this.customElement.templateInstance) {
      if (key.startsWith(bindingObject.raw + ".")) {
        delete this.customElement.templateInstance[key];
      }
    }
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
    const { node, customElement } = this;

    node.addEventListener(
      bindingObject.eventName,
      function (event) {
        try {
          event.stopPropagation();
          let arr = [event];

          if (bindingObject.arguments && bindingObject.arguments.length)
            arr = arr.concat(
              getFunctionParameters(
                bindingObject.arguments,
                node,
                customElement
              )
            );

          bindingObject.functionBody.apply(customElement, arr);
          event.preventDefault();
        } catch (error) {
          console.error(
            `${bindingObject?.scopeVariable[0]} function is not defined in ${customElement.nodeName}`
          );
        }
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
