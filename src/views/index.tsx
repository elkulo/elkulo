import { useEffect, useState, useRef, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProfileModal from '../components/ProfileModal';
import AboutContent from '../components/AboutContent';
import { ThemeModeContext } from '../composables/useThemeMode';
import styles from './index.module.scss';

const Index = () => {
  const { palette } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);

  const clickModalOpen = () => setModalVisible(true);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalVisible) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        //descriptionElement.focus();
      }
    }
  }, [isModalVisible]);

  // カラーモード変更.
  const ThemeColor = useContext(ThemeModeContext);
  const clickPaletteToggle = () => ThemeColor.toggle();

  return (
    <Box className={styles.index}>
      <Box
        component="main"
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '0.5rem',
            left: '0',
          }}
        >
          <Button
            onClick={clickPaletteToggle}
            variant="text"
            sx={{
              borderRadius: `0 4px 4px 0`,
              color: palette.grey[600],
            }}
          >
            {palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </Button>
        </Box>
        <AboutContent>
          <h1 className={styles['site-title']}>el.kulo</h1>
          <p>FRONT-END DEVELOPER & DESIGNER.</p>
          <Box
            sx={{
              margin: '1.5rem 0 0.5rem',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<GitHubIcon />}
              href="https://elkulo.github.io/"
              sx={{
                paddingLeft: '3rem',
                paddingRight: '3rem',
                backgroundColor: palette.success.main,
                fontFamily: `"Lato", "Noto Sans JP", sans-serif`,

                '&:hover': {
                  backgroundColor: palette.success.dark,
                },
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  paddingTop: '0.125em',
                  letterSpacing: '-0.05em',
                }}
              >
                ポートフォリオ
              </span>
            </Button>
          </Box>
          <Button
            onClick={clickModalOpen}
            variant="text"
            sx={{
              paddingLeft: '3rem',
              paddingRight: '3rem',
              color: palette.success.main,

              '&:hover': {
                color: palette.success.dark,
              },
            }}
          >
            私について
          </Button>
        </AboutContent>
        <Box
          component="footer"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '0 0 2rem',
            textAlign: 'center',
          }}
        >
          <Box className={styles.copyright} sx={{ marginTop: '0.5rem' }}>
            &copy; Me | el.kulo
          </Box>
        </Box>
      </Box>
      <ProfileModal
        emits={{
          modalEmit: {
            get: isModalVisible,
            set: (_v: boolean) => setModalVisible(_v),
          },
        }}
      />
    </Box>
  );
};

export default Index;
