import {
  cloneObject,
  isFunction,
  forLoop,
  isNumber,
  isString,
  isObject,
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

    forLoop(this.prototypeClone, (key) => {
      if (isFunction(this.prototypeClone[key]))
        webComponent[key] = this.prototypeClone[key];
    });
  }

  checkValuesFromKeys(o, s, mapper) {
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    var a = s.split(".");

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];

      if (k in o) {
        if (mapper[k] && i === a.length - 1) return false;

        if (isString(o[k]) || isNumber(o[k]) || typeof o[k] === "boolean")
          mapper[k] = true;

        if (isObject(o[k])) {
          if (!mapper[k]) mapper[k] = {};

          mapper = mapper[k];
        }

        o = o[k];
      } else {
        return;
      }
    }

    return true;
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
        var check = this.checkValuesFromKeys(
          this.webComponent,
          key,
          this.mapper
        );
        if (check) this.defineProperty(key);
      });
    });
  }

  getObject(prototype, keys) {
    let splitKeys = keys.split(".");

    for (let i = 0; i < splitKeys.length; i++) {
      const key = splitKeys[i];
      if (key in prototype && typeof prototype[key] === "object") {
        prototype = prototype[key];
      }
    }
    return prototype;
  }

  /**
   * function to handle two way data binding
   * @param {} key
   */
  defineProperty(key) {
    const { prototypeClone, prototype, webComponent } = this;

    const that = this;
    const targetObject = this.getObject(prototype, key);
    key = key.split(".").pop();
    const targetClone = cloneObject(targetObject)
   
    Object.defineProperty(targetObject, key, {
      get: function () {
        return targetClone[key];
      },
      set: function (val) {
        var change = that.apply(prototypeClone, key, val);
        if (!change) return;

        change.templateInstance = webComponent.templateInstance[key];
        prototypeClone[key] = val;
        that.digest(change);
      },
      enumerable: true,
    });
  }

  digest(change) {
    if (!change.templateInstance) {
      console("unable to process digest for the change object", change);
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

    new Setters(
      node,
      { [changeType]: bindingObject },
      webComponent,
      prototypeClone
    );
  }
}
