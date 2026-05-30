import React from 'react';
import { RenderRoot } from './index';
import { useResourceStore, useInstanceStore } from './models/context';
import { nodeSchema, nodeSchemaToSchema, schema } from './schema';

const Test = React.memo(function () {
    const { resourceList, dispatch } = useResourceStore();
    const { instanceMap } = useInstanceStore();
    return <>
        Test: {resourceList.length}
    </>;
});

const App = function () {
    const info = nodeSchemaToSchema(schema);
    return (
        // 这一层可以视为画布 Root，可以取出 schema 的第一层样式【画布样式】置于此层
        <div style={schema.props.style}>
            <RenderRoot
                schema={info}
                widgets={{}}
                methods={{}}
                globalProps={{}}
                globalConfig={{}}
            >
                <Test />
            </RenderRoot>
        </div>
    );
};
export default App;

