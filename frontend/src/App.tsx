import React from 'react';
import { Client } from './client';

import { Editor, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import { EditorHeader } from './components/EditorHeader';
import { newScratch, Scratch } from './constants/models';
import { CodeOutput } from './components/CodeOutput';
import { defineThemes, Theme } from './themes';

function App() {
  const [output, setOutput] = React.useState<string>("nothing");
  const [scratch, setScratch] = React.useState<Scratch>(newScratch("python"));
  const [running, setRunning] = React.useState<boolean>(false);

  const [theme, setTheme] = React.useState<Theme>("SpaceCadet");

  const executeCode = async () => {
    setOutput((_) => '');
    const client = new Client({
      onPacket: (message: string) => {
        setOutput(output => output + message);
      }, 
      onExit: () => {
        setOutput(output => output + "\n === EXITED === ");
        setRunning(_ => false);
      }
    });
    await client.awaitConnection();
    setRunning(_ => true);
    client.execute(scratch.code, scratch.language);
  }

  const handleEditorDidMount = (monaco: Monaco) => {
    defineThemes(monaco);
  };

  return (
    <div className="m-4 rounded">
      <EditorHeader scratch={scratch} running={running} executeCode={executeCode} setTheme={(theme: Theme) => {
        setTheme(_ => theme);
      }} />
      <div className="grid grid-cols-2 grid-rows-1 h-[80vh]">
        <div className="flex flex-col">
          <Editor 
            defaultLanguage='python' 
            theme={theme}
            height="100%" 
            value={scratch.code}
            options={{
              minimap: { enabled: false }
            }}
            beforeMount={handleEditorDidMount}
            onChange={(value: string | undefined, ev: editor.IModelContentChangedEvent) => {
              setScratch(scratch => ({...scratch, code: value as string}));
            }}
          />
        </div>
        <CodeOutput output={output} />
      </div>
    </div>
  );
}

export default App;
