import React from 'react';

import { Editor, Monaco } from '@monaco-editor/react';

import { Client } from './client';
import { defineThemes } from './themes';

import { newScratch, Scratch } from './constants/models';

import { EditorHeader } from './components/EditorHeader';
import { CodeOutput } from './components/CodeOutput';
import { ScratchDirectory } from './components/ScratchDirectory';
import { useTheme } from './components/ThemeProvider';

function App() {
  const [output, setOutput] = React.useState<string>("");
  const [scratch, setScratch] = React.useState<Scratch>(newScratch("python"));
  const [code, setCode] = React.useState<string>(scratch.code);
  const [running, setRunning] = React.useState<boolean>(false);

  const [isDirectoryOpen, setDirectoryOpen] = React.useState<boolean>(true);
  const [isCursorToSide, setCursorToSide] = React.useState<boolean>(false);

  const isDiff = React.useMemo(() => code !== scratch.code, [code, scratch]);

  const theme = useTheme();

  const executeCode = async () => {
    setOutput((_) => '');
    const client = new Client({
      onPacket: (message: string) => {
        setOutput(output => output + message);
      }, 
      onExit: (status: number) => {
        setOutput(output => output + `\n === EXITED WITH STATUS ${status} === `);
        setRunning(_ => false);
      }
    });
    await client.awaitConnection();
    setRunning(_ => true);
    client.execute(code, scratch.language);
  }

  const handleEditorDidMount = (monaco: Monaco) => {
    defineThemes(monaco);
  };

  return (
    <div className="flex flex-row" onMouseMove={(ev) => {
      if (ev.screenX < 20) {
        setCursorToSide(_ => true);
      }
      else {
        setCursorToSide(_ => false);
      }
    }}>
      <div className={`h-[100vh] bg-neutral-800 border-r-4 border-r-neutral-950 ${isDirectoryOpen ? "w-[250px]" : isCursorToSide ? "w-[20px]" : "w-[0px]"} transition-all`} onClick={() => setDirectoryOpen(dir => !dir)}>
        <ScratchDirectory />
      </div>
      <div className="h-[100vh] w-full flex flex-col">
        <EditorHeader scratch={scratch} running={running} isSaved={!isDiff} executeCode={executeCode} />
        <div className="grid grid-cols-2 grid-rows-1 flex-grow overflow-auto">
          <div className="flex flex-col border-r-gray-600 border-r-2">
            <Editor 
              defaultLanguage='python' 
              theme={theme.name}
              height="100%" 
              value={scratch.code}
              options={{
                minimap: { enabled: false },
                fontSize: 16
              }}
              beforeMount={handleEditorDidMount}
              onChange={(value: string | undefined, _) => {
                if (value) {
                  setCode(value);
                }
                else {
                  setCode("");
                }
              }}
            />
          </div>
          <CodeOutput output={output} backgroundColor={theme.data.colors["editor.background"]} foregroundColor={theme.data.colors["editor.foreground"]} />
        </div>
      </div>
    </div>
  );
}

export default App;
