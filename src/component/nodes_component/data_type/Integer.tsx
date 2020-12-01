import React from 'react';
import { Form, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

import { IntegerField } from '../interface/NodeField';
import { Type } from './DataType';
import Node from './Node'

class Integer extends Node {

    protected readonly selfType = Type.Integer;

    recordField(fieldName: keyof IntegerField, event: React.ChangeEvent<HTMLInputElement>): void {

        if (fieldName === "default" || fieldName === "constant" || fieldName === "min_value" || fieldName === "max_value" || fieldName === "multiple_of") {

            this.field[fieldName] = Number(event.target.value);

        } else if (fieldName === "max_exclusive" || fieldName === "min_exclusive") {

            this.field[fieldName] = event.target.checked;

        }
    }

    recordEnumField(key: number, event: React.ChangeEvent<HTMLInputElement>): void {

        this.field.enum![key] = parseInt(event.target.value);
    }

    addEnum(): void {

        if (!this.field.enum)
            this.field.enum = [];

        this.field.enum!.push("");

        this.forceUpdate();
    }

    exportSchemaObj(): any {

        return {
            type: "integer",
            title: this.field.title,
            description: this.field.description,

            constant: this.field.constant,
            default: this.field.default,
            minimum: this.field.min_value,
            exclusiveMinimum: this.field.min_exclusive,
            maximum: this.field.max_value,
            exclusiveMaximum: this.field.max_exclusive,
            multipleOf: this.field.multiple_of,

            enum: this.field.enum,
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
                        <Form.Control type="number" onChange={this.recordField.bind(this, "min_value")} />
                    </Col>
                    <Col lg="6">
                        <Form.Check id="ExclusiveMin" inline
                            label="Exclusive" type="checkbox" style={{ height: "100%" }} onChange={this.recordField.bind(this, "min_exclusive")} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="MaxValue">
                    <Form.Label column lg="2">
                        Max Value
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" onChange={this.recordField.bind(this, "max_value")} />
                    </Col>
                    <Col lg="6">
                        <Form.Check id="ExclusiveMax" inline label="Exclusive" type="checkbox" style={{ height: "100%" }} onChange={this.recordField.bind(this, "max_exclusive")} />
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
                        <Form.Control type="number" id="MultipleOf" onChange={this.recordField.bind(this, "multiple_of")} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column lg="2" htmlFor="Constant">
                        Constant
                    </Form.Label>
                    <Col lg="4">
                        <Form.Control type="number" id="Constant" placeholder="Restricted Value" onChange={this.recordField.bind(this, "constant")} />
                    </Col>

                </Form.Group>

                <Form.Group>
                    {
                        this.field.enum
                            ?
                            (
                                (this.field.enum as Array<number | string>).map((enumeration, index: number) => (
                                    <Form.Group as={Row} key={index}>
                                        <Form.Label column lg="2">
                                            {index === 0 ? "Enum" : ""}
                                        </Form.Label>
                                        <Col lg="4">
                                            {
                                                index === this.field.enum!.length - 1
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