export const schemaCamera_style = {
    'style.transform': {
        type: 'string',
        'x-component': 'TransformStyleSetter',
        'x-component-props': {
            hideRotate: true,
        }
    },
    'style.ratio': {
        type: 'string',
        'x-component': 'CameraSetting',
    }
}
export const CameraLocale_info = {
    ratio: '比例',
    transform: '位置',
}
export const cameraDefaultProps = {
    style: {
        width: '202px',
        height: '202px',
        fontSize: '20px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        ratio: '1:1',
        minWidth:'202px',
        maxWidth:'1280px',
        minHeight:'202px',
        maxHeight:'960px',
    },
};
