import * as DataType from '../../data_type/DataType';

interface NodeProperty {
    type: keyof typeof DataType.Type;
    isDeleteAble: boolean;
}
export default interface ChildNodesState {
    children: Array<NodeProperty>
};