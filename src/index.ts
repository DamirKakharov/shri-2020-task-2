import * as jsonToAst from "json-to-ast";
import { warning, header, grid, reference } from "./rules";


export type JsonAST = jsonToAst.AstJsonEntity | undefined;

const globalObject: any = globalThis || global;

function parseJson(json: string): JsonAST {
  return jsonToAst(json);
}


globalObject.lint = (json: string) => {
  let errors: any[] = [];
  const ast: JsonAST = parseJson(json);


  if (ast && ast.type === "Object") {
    errors = [
      ...errors,
      ...(warning(ast) || []),
      ...(header(ast) || []),
      ...grid(ast) || [],
      ...reference(ast) || []
    ];

    errors = errors.filter(Boolean);
    return errors;
  }
  return errors;
}

