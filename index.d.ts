/**
 * Traverse JSON Schema passing each schema object to callback
 * @param schema
 * @param opts
 * @param [cb]
 */
declare function traverse(
  schema: traverse.SchemaObject,
  opts: traverse.Options,
  cb?: traverse.Callback
): void;

/**
 * Traverse JSON Schema passing each schema object to callback
 * @param schema
 * @param cb
 */
declare function traverse(
  schema: traverse.SchemaObject,
  cb: traverse.Callback
): void;

declare namespace traverse {
  interface SchemaObject {
    $id?: string;
    $schema?: string;
    [x: string]: any;
  }

  type Callback = (
    schema: SchemaObject,
    jsonPtr: string,
    rootSchema: SchemaObject,
    parentJsonPtr?: string,
    parentKeyword?: string,
    parentSchema?: SchemaObject,
    keyIndex?: string | number
  ) => void;

  interface Options {
    allKeys?: boolean;
    cb?:
      | Callback
      | {
          pre?: Callback;
          post?: Callback;
        };
  }

  type Keywords =
    | "additionalItems"
    | "additionalProperties"
    | "contains"
    | "else"
    | "if"
    | "items"
    | "not"
    | "propertyNames"
    | "then";

  type ArrayKeywords = "allOf" | "anyOf" | "items" | "oneOf";

  type PropsKeywords =
    | "$defs"
    | "definitions"
    | "dependencies"
    | "patternProperties"
    | "properties";

  type SkipKeywords =
    | "const"
    | "default"
    | "enum"
    | "exclusiveMaximum"
    | "exclusiveMinimum"
    | "format"
    | "maximum"
    | "maxItems"
    | "maxLength"
    | "maxProperties"
    | "minimum"
    | "minItems"
    | "minLength"
    | "minProperties"
    | "multipleOf"
    | "pattern"
    | "required"
    | "uniqueItems";

  const keywords: Record<Keywords, true>;

  const arrayKeywords: Record<ArrayKeywords, true>;

  const propsKeywords: Record<PropsKeywords, true>;

  const skipKeywords: Record<SkipKeywords, true>;
}

export = traverse;
