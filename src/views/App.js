import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProfileModal from '../components/ProfileModal';
import AboutContent from '../components/AboutContent';
import { lime, amber } from '@mui/material/colors';
import 'github-markdown-css/github-markdown.css';
import './App.css';

const App = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const handleClickOpen = () => setModalVisible(true);

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (isModalVisible) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalVisible]);

  return (
    <Box className="app">
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
        <AboutContent>
          <h1 className="site-title">el.kulo</h1>
          <p>FRONT-END DEVELOPER & DESIGNER.</p>
          <Box
            sx={{
              margin: '1.5rem 0 0.5rem',
            }}
          >
            <Button
              variant="contained"
              startIcon={<GitHubIcon />}
              href="https://elkulo.github.io/"
              sx={{
                paddingLeft: '3rem',
                paddingRight: '3rem',
                backgroundColor: lime[400],

                '&:hover': {
                  backgroundColor: lime[600],
                },
              }}
            >
              <span style={{ display: 'inline-block', paddingTop: '0.25em' }}>
                ポートフォリオ
              </span>
            </Button>
          </Box>
          <Button
            onClick={handleClickOpen}
            variant="text"
            sx={{
              paddingLeft: '3rem',
              paddingRight: '3rem',
              color: amber[200],

              '&:hover': {
                color: amber[200],
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
            padding: '0 0 3rem',
            textAlign: 'center',
          }}
        >
          <Box className="copyright" sx={{ marginTop: '0.5rem' }}>
            &copy; Me | el.kulo
          </Box>
        </Box>
      </Box>
      <ProfileModal
        emits={{
          modalEmit: {
            get: isModalVisible,
            set: (_v) => setModalVisible(_v),
          },
        }}
      />
    </Box>
  );
};

export default App;
