import React from 'react';

import Node from './Node'

class Object extends Node {

    constructor(props: any) {
        super({
            ...props,
            hasChild: true,
            isOptionExist: false,
        });
    }

    OptionModal(): JSX.Element {
        return (
            <div></div>
        );
    }
}

export default Object;