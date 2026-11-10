import { validate, type SchemaPath } from "@angular/forms/signals";

export function integer(path: SchemaPath<number>): void {
  validate(path, ({ value }) =>
    Number.isInteger(value())
      ? null
      : {
          kind: "integer",
          message: "Value must be an integer",
        },
  );
}
