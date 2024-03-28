import Box from '@mui/material/Box';

const AboutContent = ({ children }) => {
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
          borderRadius: '100%',
          width: '120px',
          height: '120px',
          overflow: 'hidden',
          margin: '0 auto 1rem',
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
      <Box sx={{ textAlign: 'center' }}>{children}</Box>
    </Box>
  );
};

export default AboutContent;
