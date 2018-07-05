import React from 'react';

const Panel = (props) => (
    <div className="panel" style={{ ...props.style }}>{props.value}</div>
)

export default Panel;
