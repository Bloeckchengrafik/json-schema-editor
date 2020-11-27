import NodeField from "../NodeField";

export default interface NodeState {
    field: NodeField;
    showOptionModal: boolean;
    showDescriptionModal: boolean;
    isOptionExist: boolean;
    isDeleteAble: boolean;
    hasChild: boolean;
    hasSibling: boolean;
};