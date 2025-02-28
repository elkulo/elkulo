import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const AboutContent = ({ children }: { children: ReactNode }) => {
  const { palette } = useTheme();

  return (
    <Box
      component="article"
      sx={{
        maxWidth: '480px',
        padding: '0 0 3rem',
        margin: '0 0 5rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '100%',
          boxShadow:
            palette.mode === 'dark'
              ? '0px 0px 0px 1px #fff'
              : '0px 0px 0px 1px #000',
          background: palette.mode === 'dark' ? '#000' : '#fff',
          width: 'calc(120px + 6px)',
          height: 'calc(120px + 6px)',
          overflow: 'hidden',
          margin: '0 auto 1rem',
        }}
      >
        <Box
          sx={{
            borderRadius: '100%',
            width: '120px',
            height: '120px',
            overflow: 'hidden',
          }}
        >
          <img
            src="/assets/images/avatar.png"
            alt="el.kulo"
            width="100%"
            height="100%"
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>{children}</Box>
    </Box>
  );
};

export default AboutContent;
