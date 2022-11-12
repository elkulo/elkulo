import React from 'react';
import MailIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProfileModal from '../components/ProfileModal';
import AboutContent from '../components/AboutContent';
import SiteFooter from '../components/SiteFooter';
import { blue, blueGrey } from '@mui/material/colors';
import 'github-markdown-css/github-markdown-light.css';
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
    <Box className="app" sx={{ background: '#f8f9fa' }}>
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
              variant="outlined"
              startIcon={<MailIcon />}
              size="large"
              href="/forms/elkulo-me/post"
              sx={{
                paddingLeft: '3rem',
                paddingRight: '3rem',
                borderColor: 'currentColor',
                color: blueGrey[700],

                '&:hover': {
                  color: blue[800],
                },
              }}
            >
              <span style={{ display: 'inline-block', paddingTop: '0.25em' }}>
                CONTACT
              </span>
            </Button>
          </Box>
          <Button
            onClick={handleClickOpen}
            sx={{
              paddingLeft: '3rem',
              paddingRight: '3rem',
              color: blueGrey[700],

              '&:hover': {
                color: blue[800],
              },
            }}
          >
            私について
          </Button>
        </AboutContent>
        <SiteFooter />
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
