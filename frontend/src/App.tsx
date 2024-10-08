import React from 'react';

import { Editor, Monaco } from '@monaco-editor/react';

import { Client } from './client';
import { defineThemes } from './themes';

import { newScratch, Scratch } from './constants/models';

import { EditorHeader } from './components/EditorHeader';
import { CodeOutput } from './components/CodeOutput';
import { DirectorySidebar } from './components/DirectorySidebar';
import { useTheme } from './components/ThemeProvider';
import { useUser } from './components/UserProvider';
import { debounce } from './constants/utils';
import { insertScratch, updateScratch } from './constants/supabaseClient';

function App() {
  const [output, setOutput] = React.useState<string>("");
  const [scratch, setScratch] = React.useState<Scratch>(newScratch("python"));
  const [code, setCode] = React.useState<string>(scratch.code);
  const [running, setRunning] = React.useState<boolean>(false);

  const isDiff = React.useMemo(() => code !== scratch.code, [code, scratch]);

  const theme = useTheme();
  const user = useUser();

  const resetScratch = React.useMemo(() => {
    return () => {
      const n = newScratch("python");
      setScratch(n);
      setCode(n.code);
    }
  }, []);

  React.useEffect(() => {
    if (user.data === null) {
      resetScratch();
    }
    else {
      // check if the current scratch is still in the list of scratches
      if (!user.data.scratches.find(s => s.id === scratch.id)) {
        resetScratch();
      }
    }
  }, [user.data, scratch.id, resetScratch]);

  const updateCodeDebounce = React.useMemo(() => debounce((scratch: Scratch, code: string) => {
    scratch.code = code;
    if (scratch.id !== null) {
      updateScratch(scratch, true).then(sc => {
        setScratch(sc);
        user.updateScratch(sc);
      }).catch(e => {
        console.error(e);
      });
    }
    else {
      insertScratch(scratch).then(sc => {
        setScratch(sc);
        user.updateScratch(sc);
      }).catch(e => {
        console.error(e);
      });
    }
  }, 3000), [user]);

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
    <>
      <div className="flex flex-row">
        <DirectorySidebar scratch={scratch} setScratch={(scratch: Scratch) => {
          setScratch(_ => scratch);
          setCode(_ => scratch.code);
        }} />
        <div className="h-[100vh] w-full flex flex-col">
          <EditorHeader scratch={scratch} running={running} isSaved={!isDiff} executeCode={executeCode} />
          <div className="grid grid-cols-2 grid-rows-1 flex-grow overflow-auto">
            <div className="flex flex-col">
              <Editor 
                language={scratch.language}
                theme={theme.name}
                height="100%" 
                value={code}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16
                }}
                beforeMount={handleEditorDidMount}
                onChange={(value: string | undefined, _) => {
                  const newCode = value ? value : "";
                  setCode(newCode);
                  updateCodeDebounce(scratch, newCode);
                }}
              />
            </div>
            <CodeOutput output={output} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
