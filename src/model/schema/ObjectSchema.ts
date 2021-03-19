import React from "react";

import { FieldWithoutType, IChildProperty, IObjectEditorField, ISchemaEditorType } from "../../component/schema_editor/type_SchemaEditor";
import { DataType } from "../../type";
import { CloneReturnValue, NextId } from "../utility";
import Schema from "./Schema";
import { IChildrenSchemaType, IObjectSchemaType } from "./type_schema";

class ObjectSchema extends Schema<IObjectSchemaType, IObjectEditorField> {
    protected type = DataType.Object;
    protected currentField: Required<IObjectEditorField>;
    protected defaultField: Required<IObjectEditorField>;
    public readonly childrenProperty?: IChildProperty[];

    constructor(schema?: IObjectSchemaType, field?: FieldWithoutType<IObjectEditorField>) {
        super();

        const genericField = this.getGenericFieldFromSchema(schema, field);

        this.defaultField = {
            ...genericField,

            const: schema && schema.const ? JSON.stringify(schema.const, null, 4) : "{}",
            default: schema && schema.default ? JSON.stringify(schema.default, null, 4) : "{}",

            maxProperties: this.retrieveDefaultOptionValue("maxProperties", NaN, schema),
            minProperties: this.retrieveDefaultOptionValue("minProperties", NaN, schema),
        };

        this.currentField = { ...this.defaultField };

        if (schema) this.childrenProperty = this.generateChildrenPropertyFromSchema(schema);
    }

    @CloneReturnValue
    recordCode(field: "const" | "default", value: string): Required<IObjectEditorField> {
        this.currentField[field] = value;

        return this.currentField;
    }

    generateChildrenPropertyFromSchema(schema: IObjectSchemaType): IChildProperty[] {
        return Object.keys(schema.properties).map(field => {
            return {
                type: schema.properties[field].type,
                selfId: NextId.next("child").toString(),

                hasSibling: true,
                isDeleteable: true,
                isRequiredFieldReadonly: false,
                isNameFieldReadonly: false,

                ref: React.createRef<ISchemaEditorType>(),

                field: {
                    name: field,
                    required: schema.required.find(r => r === field) === undefined ? false : true,
                },

                schema: schema.properties[field],
            };
        });
    }

    @CloneReturnValue
    resetOptionField(): Required<IObjectEditorField> {
        this.currentField.maxProperties = this.defaultField.maxProperties;
        this.currentField.minProperties = this.defaultField.minProperties;

        return this.currentField;
    }

    @CloneReturnValue
    clearOptionField(): Required<IObjectEditorField> {
        this.currentField.maxProperties = NaN;
        this.currentField.minProperties = NaN;

        return this.currentField;
    }

    exportSchema(children?: IChildrenSchemaType): IObjectSchemaType {
        const type = DataType.Object;

        const genericSchema = this.getGenericSchemaFromField(this.currentField);

        const maxProperties = this.exportSchemaWithoutUndefined("maxProperties", NaN);
        const minProperties = this.exportSchemaWithoutUndefined("minProperties", NaN);

        const constant: { const?: Record<string, unknown> } = {};
        const defaultValue: { default?: Record<string, unknown> } = {};

        const constantTemp = JSON.parse(this.currentField.const.replace(/\s/g, "")) as Record<string, unknown>;
        if (Array.isArray(constantTemp) || typeof constantTemp !== "object")
            throw new Error("const field in an Object DataType should be a valid object (array is invalid)");
        else constant.const = constantTemp;

        const defaultTemp = JSON.parse(this.currentField.default.replace(/\s/g, "")) as Record<string, unknown>;
        if (Array.isArray(defaultTemp) || typeof defaultTemp !== "object")
            throw new Error("default field in an Object DataType should be a valid object (array is invalid)");
        else defaultValue.default = defaultTemp;

        const required: IObjectSchemaType["required"] = [];
        const properties: IObjectSchemaType["properties"] = {};

        if (children) {
            for (const child of children) {
                properties[child.name] = child.value;

                if (child.required) {
                    required.push(child.name);
                }
            }
        }

        return {
            type,
            ...genericSchema,
            ...minProperties,
            ...maxProperties,
            required,
            properties,
            ...constant,
            ...defaultValue,
        };
    }
}

export default ObjectSchema;
