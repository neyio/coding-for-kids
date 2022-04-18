import React from 'react';

import AceEditor, { IAceEditorProps } from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

export type CodeEditorProps = {} & IAceEditorProps;

const CodeEditor: React.FC<CodeEditorProps> = (props): JSX.Element => {
    return <AceEditor
        mode="javascript"
        theme="terminal"
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
            fontSize: 15,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: true,
            tabSize: 4,
        }}
        {...props}
    />;
};

export default CodeEditor;
