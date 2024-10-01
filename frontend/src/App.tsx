import React from 'react';
import { Client } from './client';

import { Editor, useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import BlackboardData from "./themes/Blackboard.json";

const Blackboard = BlackboardData as editor.IStandaloneThemeData;

function App() {
  const [output, setOutput] = React.useState<string>("nothing");
  const [code, setCode] = React.useState<string>("");

  const [currentClient, setCurrentClient] = React.useState<Client | null>(null);

  const monaco = useMonaco();

  React.useEffect(() => {
    // monaco?.
  }, [monaco])

  return (
    <div className="grid grid-cols-2 grid-rows-1">
      <div className="flex flex-col p-4">
        <Editor defaultLanguage='python' theme='vs-dark' height="50vh" onChange={(value: string | undefined, ev: editor.IModelContentChangedEvent) => {
          setCode(value as string);
        }}/>
        <button onClick={async () => {
          console.log('running', code);
          setOutput((_) => '');
          const client = new Client({
            onPacket: (message: string) => {
              setOutput(output => output + message);
            }, 
            onExit: () => {
              setOutput(output => output + "\n === EXITED === ");
            }
          });
          await client.awaitConnection();
          client.execute(code, "python");
          setCurrentClient(client);
        }} className="border border-black rounded w-fit px-4 m-2 self-end">
          Run
        </button>
      </div>
      <div className="p-4">
        <pre>
          {output}
        </pre>
      </div>
    </div>
  );
}

export default App;
