import 'normalize.css';
import './styles/global.scss';
import { ThemeProvider } from '@mui/material/styles';
import { useThemeMode, ThemeModeContext } from './composables/useThemeMode';
import CssBaseline from '@mui/material/CssBaseline';
import Index from './views/index.tsx';

const App = () => {
  const themeMode = useThemeMode();
  return (
    <ThemeModeContext.Provider value={themeMode.colorMode}>
      <ThemeProvider theme={themeMode.colorTheme}>
        <CssBaseline />
        <Index />
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
