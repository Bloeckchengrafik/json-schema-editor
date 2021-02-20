// I think there is some bugs  in either eslint or react to use forwardref
// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import BooleanSchema from "../../model/schema/BooleanSchema";
import { IBooleanSchemaType } from "../../model/schema/type_schema";
import EditorOptionModal from "../node_component/EditorOptionModal";
import GenericField from "../node_component/GenericField";
import HintText from "../node_component/HintText";
import OptionsButtons from "../node_component/OptionsButtons";
import SpaceFront from "../node_component/SpaceFront";
import { IGenericFieldOptions, IOptionsButtonsAttr } from "../node_component/type_NodeComponent";
import SchemaEditor from "./SchemaEditor";
import { IBooleanEditorField, ISchemaEditorProps } from "./type_SchemaEditor";

class BooleanSchemaEditor extends SchemaEditor<IBooleanSchemaType, IBooleanEditorField> {
    protected optionsButtonsAttr: IOptionsButtonsAttr;
    protected genericFieldOptions: IGenericFieldOptions;
    public schema: BooleanSchema;

    protected optionModalRef: React.RefObject<EditorOptionModal>;
    protected genericFieldRef: React.RefObject<GenericField>;

    constructor(props: ISchemaEditorProps<IBooleanSchemaType>) {
        super(props);

        this.optionModalRef = React.createRef<EditorOptionModal>();
        this.genericFieldRef = React.createRef<GenericField>();

        this.schema = new BooleanSchema(props.schema, props.field);

        this.optionsButtonsAttr = {
            hasChild: false,
            hasSibling: true,
            isDeleteable: true,
            isOptionExist: true,
            ...props, // override hasSibling, isDeleteable
        };

        this.genericFieldOptions = {
            ...props, // override isRequiredFieldReadonly, isNameFieldReadonly
        };

        this.state = {
            currentField: this.schema.getDefaultField(),
        };
    }

    exportSchema(): IBooleanSchemaType {
        return this.schema.exportSchema();
    }

    render(): JSX.Element {
        return (
            <div className="my-1">
                <Row>
                    <SpaceFront depth={this.props.depth} />

                    <Col>
                        <HintText hint={this.state.hint} />

                        <Form>
                            <Form.Row>
                                <Col lg={11}>
                                    <GenericField
                                        ref={this.genericFieldRef}
                                        schemaType={this.schema}
                                        options={this.genericFieldOptions}
                                        changeType={this.props.changeType}
                                        changeName={this.props.changeName}
                                    />
                                </Col>
                                <Col lg={1}>
                                    <OptionsButtons
                                        buttonOptions={this.optionsButtonsAttr}
                                        delete={this.delete.bind(this)}
                                        addChild={this.addChild.bind(this)}
                                        addSibling={this.addSibling.bind(this)}
                                        showOptionModal={this.showOptionModal.bind(this, true)}
                                    />
                                </Col>
                                <EditorOptionModal
                                    clearOptionFieldForm={this.clearOptionField.bind(this)}
                                    resetOptionFiledForm={this.resetOptionField.bind(this)}
                                    ref={this.optionModalRef}
                                >
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label column lg="auto" htmlFor="default">
                                                Default
                                            </Form.Label>
                                            <Col lg={4}>
                                                <Form.Control
                                                    as="select"
                                                    custom
                                                    onChange={this.recordField.bind(this, "default")}
                                                    value={
                                                        this.state.currentField.default === undefined
                                                            ? "undefined"
                                                            : this.state.currentField.default.toString()
                                                    }
                                                >
                                                    <option
                                                        disabled
                                                        hidden
                                                        selected={this.state.currentField.default === undefined ? true : false}
                                                        value="undefined"
                                                    >
                                                        {" "}
                                                    </option>
                                                    <option value={"true"}>True</option>
                                                    <option value={"false"}>False</option>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </EditorOptionModal>
                            </Form.Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BooleanSchemaEditor;