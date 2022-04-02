import { cloneObject, isFunction, forLoop } from "./utils.js";
import Setters from "./Setters.js";

export default class Observers {
  constructor(customElement, proto) {
    this.mapper = {};
    this.prototype = proto;
    this.prototypeClone = {};
    this.webComponent = customElement;
    this.__cloneWebCompnent__(customElement);
  }

  __cloneWebCompnent__() {
    let { webComponent, prototype } = this;

    this.prototypeClone = cloneObject(prototype);

    forLoop(prototype, (key) => {
      webComponent[key] = prototype[key];
    });

    forLoop(this.prototypeClone, (key) => {
      if (isFunction(this.prototypeClone[key]))
        webComponent[key] = this.prototypeClone[key];
    });
  }

  __observe__(node, nodeObject) {
    if (nodeObject.Attribute) {
      nodeObject.Attribute.forEach((item) => {
        const { keys } = item;

        keys.forEach((key) => {
          this.__defineProperty__(key);
        });
      });
    }
  }

  /**
   * function to handle two way data binding
   * @param {} key
   */
  __defineProperty__(key) {
    const { prototypeClone, prototype, webComponent } = this;

    const that = this;

    Object.defineProperty(prototype, key, {
      get: function () {
        return prototypeClone[key];
      },
      set: function (val) {
        var change = that.__apply__(prototypeClone, key, val);
        if (!change) return;

        change.templateInstance = webComponent.templateInstance[key];
        prototypeClone[key] = val;
        that.__digest__(change);
      },
      enumerable: true,
    });
  }

  __digest__(change) {
    if (!change.templateInstance) {
      console("unable to process digest for the change object", change);
      return;
    }

    change.templateInstance.forEach((item) => {
      const { node, bindingObject } = item;

      if (bindingObject.Attribute) {
        this.__ObserveAttibuteChanges__(change, bindingObject.Attribute, node);
      }
    });
  }

  __apply__(clone, key, value) {
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

  __ObserveAttibuteChanges__(change, bindingObject, node) {
    const { webComponent, prototypeClone } = this;

    bindingObject.forEach(function (item) {
      var effectedPropertyName = change.name;

      item.keys.forEach(function (key, index) {
        key = key.split(".").pop();
        if (key === effectedPropertyName) item.values[index] = change.newValue;
      });

      // Setters.prototype.__Setter__Attribute(node, item);
    });

    new Setters(
      node,
      { Attribute: bindingObject },
      webComponent,
      prototypeClone
    );
  }
}
