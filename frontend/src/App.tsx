import React from 'react';
import { Client } from './client';

function App() {
  const [output, setOutput] = React.useState<string>("nothing");
  const [code, setCode] = React.useState<string>("");

  const [currentClient, setCurrentClient] = React.useState<Client | null>(null);

  return (
    <>
      <textarea cols={100} rows={50} onChange={(e) => {
        setCode(e.target.value);
      }}>

      </textarea>
      <button onClick={async () => {
        console.log('running', code);
        setOutput((_) => '');
        const client = new Client({
          onPacket: (message: string) => {
            setOutput(output => output + message);
          }, 
          onExit: () => {
            setOutput(output => output + "\n\n === EXITED === ");
          }
        });
        await client.awaitConnection();
        client.execute(code, "python");
        setCurrentClient(client);
      }}>
        Run
      </button>
      <pre>
        {output}
      </pre>
    </>
  );
}

export default App;
