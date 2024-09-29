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
      <button onClick={() => {
        console.log('running', code);
        setCurrentClient(new Client()); 
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
