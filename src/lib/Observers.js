import {
  cloneObject,
  forLoop,
  getObject,
  checkValuesFromKeys,
} from "./utils.js";
import Setters from "./Setters.js";

export default class Observers {
  constructor(customElement, proto) {
    this.mapper = {};
    this.prototype = proto;
    this.prototypeClone = {};
    this.webComponent = customElement;
    this.cloneWebCompnent(customElement);
  }

  cloneWebCompnent() {
    let { webComponent, prototype } = this;
    this.prototypeClone = cloneObject(prototype);

    forLoop(prototype, (key) => {
      webComponent[key] = prototype[key];
    });
  }

  observe(node, nodeObject) {
    if (nodeObject.Attribute) {
      this.createMappings(nodeObject, "Attribute");
    } else if (nodeObject.TextContent) {
      this.createMappings(nodeObject, "TextContent");
    }
  }

  createMappings(nodeObject, observeType) {
    nodeObject[observeType].forEach((item) => {
      const { keys } = item;

      keys.forEach((key) => {
        var check = checkValuesFromKeys(
          this.webComponent,
          key,
          this.mapper
        );
        if (check) this.defineProperty(key);
      });
    });
  }

  /**
   * function to handle two way data binding
   * @param {} key
   */
  defineProperty(key) {
    const { webComponent } = this;
    const that = this;
    const targetObject = getObject(webComponent, key);
    const keyClone = key.split(".").pop();
    const targetClone = cloneObject(targetObject);
    
    try {
      Object.defineProperty(targetObject, keyClone, {
        get: function () {
          return targetClone[keyClone];
        },
        set: function (val) {
          var change = that.apply(targetClone, keyClone, val);
          if (!change) return;

          change.templateInstance = webComponent.templateInstance[key];
          targetClone[keyClone] = val;
          that.digest(change);
        },
        enumerable: true,
      });
    } catch (error) {
      // console.log(error);
    }
  }

  observeArray(bindingObject, executeRepeaters) {
    const { targetArray } = bindingObject;
    const that = this;

    // a proxy for our array
    var proxy = new Proxy(targetArray, {
      apply: function (target, thisArg, argumentsList) {
        return thisArg[target].apply(this, argumentsList);
      },
      deleteProperty: function (target, index) {
        // console.log("Deleted %s", index);
        return true;
      },
      set: function (target, property, value, receiver) {
        // console.log("Set %s to %o", property, value, targetArray);
        target[property] = value;
        if (property === "length") {
          executeRepeaters(bindingObject, true);
        }
        return true;
      },
    });
    window.abc = proxy;
    return proxy;
  }

  digest(change) {
    if (!change.templateInstance) {
      console.error("unable to process digest for the change object", change);
      return;
    }

    change.templateInstance.forEach((item) => {
      const { node, bindingObject } = item;

      if (bindingObject.Attribute) {
        this.ObserveChanges(change, bindingObject.Attribute, node, "Attribute");
      } else if (bindingObject.TextContent) {
        this.ObserveChanges(
          change,
          bindingObject.TextContent,
          node,
          "TextContent"
        );
      }
    });
  }

  apply(clone, key, value) {
    var newValue = value;
    var oldValue = clone[key];

    if (oldValue !== newValue) {
      return {
        name: key,
        newValue: newValue,
        oldValue: oldValue,
        type: "updated",
      };
    }
  }

  ObserveChanges(change, bindingObject, node, changeType) {
    const { webComponent, prototypeClone } = this;

    bindingObject.forEach(function (item) {
      var effectedPropertyName = change.name;

      item.keys.forEach(function (key, index) {
        key = key.split(".").pop();
        if (key === effectedPropertyName) item.values[index] = change.newValue;
      });
    });

    if (node.nodeName === "INPUT") {
      node.value = change.newValue;
    }

    new Setters(
      node,
      { [changeType]: bindingObject },
      webComponent,
      prototypeClone
    );
  }
}
