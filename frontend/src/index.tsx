import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { UserProvider } from './components/UserProvider';
import { ModalProvider } from './components/ModalProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <UserProvider>
    <ThemeProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ThemeProvider>
  </UserProvider>
);
