import { getValuesFromKeys, getBindingVariables } from "./utils.js";

export const parseCondition = (bindingObject, nodeObject) => {
  const { proto, customElement, template } = bindingObject;
  let keys = getBindingVariables(bindingObject.raw);
  const values = getValuesFromKeys(
    keys,
    proto,
    customElement,
    template,
    nodeObject
  );

  bindingObject.keys = keys;
  bindingObject.values = values;
  bindingObject.valuesType = values.map(val => typeof val)
};

export const executeCondition = (str) => {
  return Function(`'use strict'; return (${str})`)();
};
