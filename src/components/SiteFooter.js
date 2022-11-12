import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { grey, blueGrey } from '@mui/material/colors';

const SiteFooter = () => {
  return (
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
      <Link
        href="https://github.com/elkulo"
        target="_blank"
        sx={{
          color: grey[900],

          '&:hover': {
            color: blueGrey[800],
          },
        }}
      >
        <GitHubIcon
          sx={{
            fontSize: '2.75rem',
          }}
        />
      </Link>
      <Box className="copyright" sx={{ marginTop: '0.5rem' }}>
        &copy; Me | el.kulo
      </Box>
    </Box>
  );
};

export default SiteFooter;
