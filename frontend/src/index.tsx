import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { UserProvider } from './components/UserProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <UserProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </UserProvider>
);
