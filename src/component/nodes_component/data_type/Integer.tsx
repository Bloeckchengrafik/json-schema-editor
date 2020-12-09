import React from 'react';
import { Form, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import { NodeProps } from '../interface/Props';
import { IntegerField } from '../interface/NodeField';
import { Type } from './DataType';
import Node from './Node'

class Integer extends Node {

    protected readonly selfType = Type.Integer;
    private readonly minExclusiveCheckedRef: React.RefObject<HTMLInputElement>;
    private readonly maxExclusiveCheckedRef: React.RefObject<HTMLInputElement>;

    constructor(props: NodeProps) {
        super(props);

        this.minExclusiveCheckedRef = React.createRef<HTMLInputElement>();
        this.maxExclusiveCheckedRef = React.createRef<HTMLInputElement>();
    }

    recordField(fieldName: keyof IntegerField, event: React.ChangeEvent<HTMLInputElement>): void {

        event.preventDefault();

        if (fieldName === "default" || fieldName === "const" || fieldName === "multipleOf") {

            this.setField<number>(fieldName, parseInt(event.target.value))

        } else if (fieldName === "minimum") {

            if (this.minExclusiveCheckedRef.current!.checked) {

                this.setField<number>("exclusiveMinimum", parseInt(event.target.value))
                this.setField<undefined>("minimum", undefined)

            } else {

                this.setField<number>("minimum", parseInt(event.target.value))
                this.setField<undefined>("exclusiveMinimum", undefined)
            }

        } else if (fieldName === "maximum") {


            if (this.maxExclusiveCheckedRef.current!.checked) {

                this.setField<number>("exclusiveMaximum", parseInt(event.target.value))
                this.setField<undefined>("maximum", undefined)

            } else {

                this.setField<number>("maximum", parseInt(event.target.value))
                this.setField<undefined>("exclusiveMaximum", undefined)
            }
        } else if (fieldName === "exclusiveMinimum") {

            if (event.target.checked && this.state.field.minimum) {

                this.setField<number>("exclusiveMinimum", this.state.field.minimum)
                this.setField<undefined>("minimum", undefined)

            } else if (!event.target.checked && this.state.field.exclusiveMinimum) {

                this.setField<number>("minimum", this.state.field.exclusiveMinimum)
                this.setField<undefined>("exclusiveMinimum", undefined)
            }
        } else if (fieldName === "exclusiveMaximum") {

            if (event.target.checked && this.state.field.maximum) {

                this.setField<number>("exclusiveMaximum", this.state.field.maximum)
                this.setField<undefined>("maximum", undefined)

            } else if (!event.target.checked && this.state.field.exclusiveMaximum) {

                this.setField<number>("maximum", this.state.field.exclusiveMaximum)
                this.setField<undefined>("exclusiveMaximum", undefined)
            }
        }
    }

    recordEnumField(key: number, event: React.ChangeEvent<HTMLInputElement>): void {

        event.preventDefault();

        this.setField<(number | string)[]>("enum", this.state.field.enum!.map((e, i) => i === key ? parseInt(event.target.value) : e))
    }

    addEnum(event: React.MouseEvent<HTMLButtonElement>): void {

        event.preventDefault();

        let e: (number | string)[];

        if (!this.state.field.enum)
            e = [""]
        else
            e = [...this.state.field.enum, ""];

        this.setField<(number | string)[]>("enum", e)
    }

    exportSchemaObj(): any {

        return {
            type: "integer",
            ...{ ...this.state.field, required: undefined, name: undefined }
        };
    }

    OptionModal(): JSX.Element {
        return (
            <>
                <Form.Group as={Row} controlId="MinValue">
                    <Form.Label column lg="2">
                        Min Value
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" onChange={this.recordField.bind(this, "minimum")} />
                    </Col>
                    <Col lg="6">
                        <Form.Check id="ExclusiveMin" inline
                            ref={this.minExclusiveCheckedRef}
                            onChange={this.recordField.bind(this, "exclusiveMinimum")}
                            defaultChecked={this.state.field.exclusiveMinimum ? true : false}
                            label="Exclusive" type="checkbox" style={{ height: "100%" }} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="MaxValue">
                    <Form.Label column lg="2">
                        Max Value
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" onChange={this.recordField.bind(this, "maximum")} />
                    </Col>
                    <Col lg="6">
                        <Form.Check id="ExclusiveMax" inline
                            ref={this.maxExclusiveCheckedRef}
                            onChange={this.recordField.bind(this, "exclusiveMinimum")}
                            defaultChecked={this.state.field.exclusiveMaximum ? true : false}
                            label="Exclusive" type="checkbox" style={{ height: "100%" }} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column lg="2" htmlFor="Default">
                        Default
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" id="Default" onChange={this.recordField.bind(this, "default")} />
                    </Col>
                    <Form.Label column lg="2" htmlFor="MultipleOf">
                        Multiple Of
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" id="MultipleOf" onChange={this.recordField.bind(this, "multipleOf")} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column lg="2" htmlFor="const">
                        Constant
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" id="const" placeholder="Restricted Value" onChange={this.recordField.bind(this, "const")} />
                    </Col>

                </Form.Group>

                <Form.Group>
                    {
                        this.state.field.enum
                            ?
                            (
                                (this.state.field.enum as Array<number | string>).map((enumeration, index: number) => (
                                    <Form.Group as={Row} key={index}>
                                        <Form.Label column lg="2">
                                            {index === 0 ? "Enum" : ""}
                                        </Form.Label>
                                        <Col lg="4">
                                            {
                                                index === this.state.field.enum!.length - 1
                                                    ?
                                                    (
                                                        <InputGroup>
                                                            <FormControl type="number" id={index.toString()} onChange={this.recordEnumField.bind(this, index)} defaultValue={enumeration} />
                                                            <InputGroup.Append>
                                                                <Button variant="outline-success" onClick={this.addEnum.bind(this)}>
                                                                    <FaPlus />
                                                                </Button>
                                                            </InputGroup.Append>
                                                        </InputGroup>
                                                    )
                                                    :
                                                    (
                                                        <FormControl type="number" id={index.toString()} onChange={this.recordEnumField.bind(this, index)} defaultValue={enumeration} />
                                                    )
                                            }
                                        </Col>
                                    </Form.Group>
                                ))
                            )
                            :
                            (
                                <Form.Group as={Row}>
                                    <Form.Label column lg="2">
                                        Enum
                                </Form.Label>
                                    <Col lg="10">
                                        <Row>
                                            <Col lg="12">
                                                <Button variant="outline-success" onClick={this.addEnum.bind(this)}>
                                                    <FaPlus color="green" />
                                                </Button>

                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                            )
                    }
                </Form.Group>

            </>
        );
    }
}

export default Integer;