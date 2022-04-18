import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import PlayIcon from 'iconoir-react/dist/PlayOutline';
import Sandbox from '@nyariv/sandboxjs';

import type { CodeOuputProps, OuputContent } from '../../components/CodeOuput';
import type { CodeEditorProps } from '../../components/CodeEditor';

const CodeOuput = dynamic<CodeOuputProps>(() => import('../../components/CodeOuput'), { ssr: false });
const CodeEditor = dynamic<CodeEditorProps>(() => import('../../components/CodeEditor'), { ssr: false });

const Colors = {
    Unactive: 'rgba(0,0,0,0.35)',
    Error: '#ea3323',
    Normal: 'rgba(0,0,0,0.85)'//'rgba(21,128,61,1)'
};

class CourseStore {

    @observable
    output: OuputContent = [];

    @observable
    code: string = 'console.log(1,2,3)';

    constructor() {
        makeObservable(this);
    }

    @action
    setCode(val: string) {
        this.code = val;
    }

    @action
    exec() {
        try {
            this.output = [];
            const ins = this;
            const globals = { 
                ...Sandbox.SAFE_GLOBALS,
                console: {
                    log: (...rest: any[]) => {
                        ins.print.apply(ins, rest);
                    }
                },
            };
            const scope = {};
            const sandbox = new Sandbox({ globals });
            const executor = sandbox.compile(this.code);
            executor(scope);
        } catch (err) {
            this.error(err as Error);
        }
    }

    print(...rest: any[]) {
        const newOutput = [ 
            ...this.output, 
            { text: rest.join(' '), color: Colors.Normal }
        ];
        this.output = newOutput;
    }

    error(err: string | Error) {
        let msg: string = typeof err === 'string' ? err : (err.message || err.toString());
        this.output = [
            { text: 'Compile Error: ', color: Colors.Error },
            { text: msg, color: Colors.Error }  
        ];
    }

    @action
    compling() {
        this.output = [
            { text: 'compling.', color: Colors.Unactive }  
        ];
        let i = 1;
        setInterval(() => {
            i ++;
            if (i > 3) {
                i = 0;
            }
            this.output = [
                { text: 'compling.' + new Array(i).fill('.').join(''), color: Colors.Unactive }  
            ];
        }, 300);
    }

}

const Course: React.FC = (): JSX.Element => {
    const [viewStore] = useState<CourseStore>(new CourseStore());
    const router = useRouter();

    const { output, code } = viewStore;

    return <div className="w-screen min-h-screen flex flex-row">
        <div className="teach-block h-full flex-1">
            Video   
        </div>
        <div className="code-block h-screen md:w-1/3 xl:w-1/4">
            <div className="editor flex flex-col w-full h-3/5 bg-black">
                <div className="px-2 h-8 flex items-center bg-gray-800 text-gray-300">
                    <div className="flex items-center cursor-pointer text-green-700 font-medium"
                        onClick={() => {
                            viewStore.exec();
                        }}
                    >
                        <PlayIcon color="green" width={20} height={20} className="mr-1" />Run
                        </div>
                </div>
                <div className="flex-1 w-full">
                    <CodeEditor 
                        width="100%"
                        height="100%"
                        value={code}
                        onChange={val => viewStore.setCode(val)}
                    />  
                </div>
            </div>
            <div className="output h-2/5">
                <CodeOuput 
                    value={output}
                />
            </div>
        </div>
    </div>;
};

export default observer(Course);