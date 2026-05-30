import React from 'react';
import {useDrawRectangle} from './useDrawEffect';

function Draw() {
    const { ref, rectangle } = useDrawRectangle();

    return (
        <div ref={ref} style={{ position: 'absolute', left: 0, top: 0, width: "100%", height: "100%" }}>
            {rectangle.width > 0 && rectangle.height > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${rectangle.x}px`,
                        top: `${rectangle.y}px`,
                        width: `${rectangle.width}px`,
                        height: `${rectangle.height}px`,
                        border: '1px solid black',
                    }}
                />
            )}
        </div>
    );
}

export default Draw;