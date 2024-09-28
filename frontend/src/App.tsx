import React from 'react';

function App() {
  const [output, setOutput] = React.useState<string>("");

  return (
    <>
      <textarea>

      </textarea>
      <button onClick={() => {
        
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
