import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import { Toaster } from 'react-hot-toast';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import App from './App';
import 'dayjs/locale/en';

dayjs.locale('en');
dayjs.extend(localizedFormat);

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <>
    <Toaster />
    <App />
  </>
);
