import CodeOuput from './CodeOuput';

export type OuputText = {
    text: string;
    color?: string;
};

export type OuputContent = (string | OuputText)[];

export type CodeOuputProps = {
    value?: OuputContent;
};

export default CodeOuput;