export const isArray = Array.isArray;

export const isFunction = (value) => {
  return typeof value === "function";
};
export const isNumber = (value) => {
  return typeof value === "number";
};
export const isString = (value) => {
  return typeof value === "string";
};

/**
 * To check if a node contains text content or not
 **/
export const hasTextContent = (n) => {
  if (n.textContent.trim().length) return true;
  else return false;
};

/**
 * A template literal tag that creates an HTML <template> element from the
 * contents of the string.
 *
 * This allows you to write a Polymer Template in JavaScript.
 **/
export const html = function html(strings, ...values) {
  const template = document.createElement("template");
  template.innerHTML = strings[0];
  return template;
};
/**
 return object keys
  **/
export const keys = (obj) => {
  return isObject(obj) && Object.keys(obj);
};
/**
 * generic for loop
 **/
export const forLoop = (arr, callback) => {
  if (!arr) return;

  if (isArray(arr))
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && typeof callback === "function") callback(arr[i], i);
    }
  else if (isObject(arr))
    Object.keys(arr).forEach(function (key, index, object) {
      if (arr[key] && typeof callback === "function")
        callback(key, arr[key], index);
    });
};
/**
 * function to check is object
 **/
export const isObject = (value) => {
  return value !== null && value !== undefined && typeof value === "object";
};

/**
 * function to get binding variables
 **/
export const getBindingVariables = (str) => {
  if (str.indexOf("{{") !== -1)
    return str
      .trim()
      .match(/{{\s*[\w\.]+\s*}}/g)
      .map(function (x) {
        return x.match(/[\w\.]+/)[0];
      });
};

/**
 * function to set binding variables
 **/
export const setBindingVariables = (
  textContent,
  from,
  With,
  customElementName
) => {
  var str = textContent;
  for (var i = 0; i < from.length; i++) {
    if (With[i]) {
      // if try to print object
      if (isObject(With[i])) With[i] = JSON.stringify(With[i]);

      str = str.replace(new RegExp("{{" + from[i] + "}}", "gi"), With[i]);
    } else {
      console.error(
        `${from[i]} property is not defined in ${customElementName}`
      );
    }
  }

  return str;
};

/**
 * function to get binding variable
 * values from custom element prototype
 **/

export const getValuesFromKeys = (
  keys,
  proto,
  customElement,
  node,
  nodeObject
) => {
  var values = [];

  forLoop(keys, function (key, i) {
    values.push(byString(proto, key, customElement, node, nodeObject));
  });
  return values;
};

const byString = (proto, str, customElement, node, nodeObject) => {
  const { templateInstance } = customElement;
  let prototype = { ...proto };
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const nthStr = str.split(".");

  for (var i = 0, n = nthStr.length; i < n; ++i) {
    var k = nthStr[i];

    if (k in prototype) {
      prototype = prototype[k];
      mapNodes(node, nodeObject, templateInstance, k);
    } else if (k in customElement) {
      prototype = customElement[k];
    } else {
      return;
    }
  }

  return prototype;
};

const mapNodes = (n, bindingObject, templateInstance, key) => {
  if (!templateInstance[key]) {
    templateInstance[key] = [];
  }

  templateInstance[key].push({
    node: n,
    bindingObject: bindingObject,
  });
};

// creates bindingObject from Getters class
export const createBindingObject = (nodeObject, bindingObject) => {
  var bindingType = bindingObject.bindingType;

  if (!nodeObject[bindingType]) nodeObject[bindingType] = [];

  nodeObject[bindingType].push(bindingObject);
};

export const attributeIterator = (
  node,
  proto,
  nodeObject,
  customElement,
  callback
) => {
  if (!node.attributes) return;

  forLoop(node.attributes, function (index, attr) {
    if (attr.value.indexOf("{{") !== -1) {
      const _keys = getBindingVariables(attr.value);

      if (isFunction(callback) && keys(_keys).length) callback(attr, _keys);
    } else if (attr.name === "items" && node.nodeName === "TEMPLATE") {
      // todo add below check in above if conditoin
      // && node.nodeName === "template-repeat"
      if (isFunction(callback)) callback(attr, null, true);
    }
  });
};

export const cloneObject = (obj) => {
  if (isObject(obj)) return JSON.parse(JSON.stringify(obj));
};
