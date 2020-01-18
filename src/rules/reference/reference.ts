import { AstObject } from "json-to-ast";
import { getEntity } from "../../utils";

export const reference = (node: AstObject) => {
  const ERRORS: any = [];

  getEntity(node, (e) => ERRORS.push(BlockNameIsRequired(e)));
  getEntity(node, (e) => ERRORS.push(UppercaseNamesIsForbidden(e)));

  return ERRORS;
};

export const BlockNameIsRequired = (node: AstObject, state?: any): void | object => {

  if (!node.children.some(p => p.key.value === "block")) {
    return {
      code: "blockNameIsRequired",
      location: node.loc,
      error: 'Same text',
    };
  }

};

export const UppercaseNamesIsForbidden = (node: AstObject, state?: any) => {
  let error: any;
  node.children.forEach(item => {
    if (item.type === "Property" && /^[A-Z]+$/.test(item.key.value)) {
      error = {
        code: "uppercaseNamesIsForbidden",
        location: item.loc,
        error: 'Same text',
      };
    }
  });


  return error;
};

