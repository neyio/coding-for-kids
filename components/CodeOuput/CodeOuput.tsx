import React from 'react';
import { CodeOuputProps } from '.';

const CodeOuput: React.FC<CodeOuputProps> = ({
    value,
}: CodeOuputProps): JSX.Element => {
    return <div className="w-full h-full flex flex-col box-border border border-gray-400">
        <div className="px-2 h-8 flex items-center bg-gray-800 text-gray-300 font-medium">
            <div>output</div>
        </div>
        <div className="screen flex-1 flex flex-col bg-yellow-50 px-3 py-2 overflow-x-auto">
            {
                value ? value.map((str, i) => {
                    let color = 'rgab(0,0,0.85)';
                    let text = '';
                    if (typeof str === 'string') {
                        text = str;
                    } else {
                        text = str.text;
                        color = str.color || color;
                    }
                    return <p key={i} className="inline-block whitespace-nowrap" style={{ color }}>{text}</p>;
                }) : null
            }
        </div>
    </div>;
};

export default CodeOuput;
