import { AstObject } from "json-to-ast";
import { getBlockName, getEntity } from "../../utils";
import { SIZES } from "../../constants";


export const warning = (node: AstObject) => {
  if (getBlockName(node) !== "warning") {
    return;
  }

  const ERRORS: any = [];
  let state: any = { location: node.loc };

  getEntity(node, (e) => ERRORS.push(TEXT_SIZES_SHOULD_BE_EQUAL(e, state)), "text");
  getEntity(node, (e) => ERRORS.push(INVALID_BUTTON_SIZE(e, state)), "button");

  getEntity(node, (e) => { state.placeholder = e; ERRORS.push(INVALID_PLACEHOLDER_SIZE(e, state)); }, "placeholder");
  getEntity(node, (e) => ERRORS.push(INVALID_BUTTON_POSITION(e, state)), "button");

  return ERRORS || [];
};

export const TEXT_SIZES_SHOULD_BE_EQUAL = (node: AstObject, state?: any): void | object => {
  const { children } = node;
  const mods = children.find(child => child.key.value === 'mods');

  let size: any = mods && mods.value.type === "Object" && mods.value.children.find(
    child =>
      child.key.value === 'size'
  );
  if (!size) {
    return;
  }


  size = size.value.value;
  state.size = state.size || size;

  const { start, end } = state.location;
  if (state.size !== size) {
    return {
      code: 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL',
      error: 'Тексты в блоке warning должны быть одного размера',
      location: {
        start: { column: start.column, line: start.line },
        end: { column: end.column, line: end.line }
      }
    };
  }
};

export const INVALID_BUTTON_SIZE = (node: AstObject, state?: any): void | object => {
  if (!state.size) {
    return;
  }

  const { children } = node;
  const mods = children.find(child => child.key.value === 'mods');

  let size: any = mods && mods.value.type === "Object" && mods.value.children.find(
    child =>
      child.key.value === 'size'
  );

  if (!size) {
    return;
  }

  size = size.value.value;

  const index = SIZES.indexOf(state.size);
  if (index === -1 && index === SIZES.length - 1) { return; }
  if (size !== SIZES[index + 1]) {
    const { start, end } = node.loc;
    return {
      code: 'WARNING.INVALID_BUTTON_SIZE',
      error: 'Размер кнопки блока warning должен быть на 1 шаг больше эталонного',
      location: {
        start: { column: start.column, line: start.line },
        end: { column: end.column, line: end.line }
      }
    };
  }
};

export const INVALID_BUTTON_POSITION = (node: AstObject, state?: any): void | object => {
  if (!state.placeholder) {
    return;
  }

  const { start, end } = node.loc;
  const placeholderLoc = state.placeholder.loc;

  if (placeholderLoc.start.line >= start.line && placeholderLoc.start.column >= start.column) {
    return {
      code: 'WARNING.INVALID_BUTTON_POSITION',
      error: 'Блок button в блоке warning не может находиться перед блоком placeholder на том же или более глубоком уровне вложенности',
      location: {
        start: { column: start.column, line: start.line },
        end: { column: end.column, line: end.line }
      }
    };
  }
};

export const INVALID_PLACEHOLDER_SIZE = (node: AstObject, state?: any): void | object => {
  const { children } = node;
  const mods = children.find(child => child.key.value === 'mods');

  let size: any = mods && mods.value.type === "Object" && mods.value.children.find(
    child =>
      child.key.value === 'size'
  );

  if (!size) {
    return;
  }

  size = size.value.value;
  const SIZES = [
    "s",
    "m",
    "l",
  ];

  if (!SIZES.find(item => item === size)) {
    const { start, end } = node.loc;
    return {
      code: 'WARNING.INVALID_PLACEHOLDER_SIZE',
      error: 'Допустимые размеры для блока placeholder в блоке warning: s, m, l',
      location: {
        start: { column: start.column, line: start.line },
        end: { column: end.column, line: end.line }
      }
    };
  }
};