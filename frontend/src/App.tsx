import React from 'react';
import { Client } from './client';

import { Editor, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import { EditorHeader } from './components/EditorHeader';
import { newScratch, Scratch } from './constants/models';
import { CodeOutput } from './components/CodeOutput';
import { defineThemes, getTheme, ThemeName, themeNames } from './themes';

function App() {
  const [output, setOutput] = React.useState<string>("nothing");
  const [scratch, setScratch] = React.useState<Scratch>(newScratch("python"));
  const [running, setRunning] = React.useState<boolean>(false);

  const [themeName, setThemeName] = React.useState<ThemeName>(themeNames[0]);
  const themeData = React.useMemo(() => getTheme(themeName), [themeName]);

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
    <div className="h-[100vh] flex flex-col">
      <EditorHeader scratch={scratch} running={running} executeCode={executeCode} setTheme={(theme: ThemeName) => {
        setThemeName(_ => theme);
      }} />
      <div className="grid grid-cols-2 grid-rows-1 flex-grow overflow-auto">
        <div className="flex flex-col border-r-gray-600 border-r-2">
          <Editor 
            defaultLanguage='python' 
            theme={themeName}
            height="100%" 
            value={scratch.code}
            options={{
              minimap: { enabled: false },
              fontSize: 16
            }}
            beforeMount={handleEditorDidMount}
            onChange={(value: string | undefined, _) => {
              setScratch(scratch => ({...scratch, code: value as string}));
            }}
          />
        </div>
        <CodeOutput output={output} backgroundColor={themeData.colors["editor.background"]} foregroundColor={themeData.colors["editor.foreground"]} />
      </div>
    </div>
  );
}

export default App;
