import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { indigo } from '@mui/material/colors';

const ProfileModal = ({ emits }) => {
  const [getEntry, setEntry] = React.useState('Now Loading...');
  const { modalEmit } = emits;

  const handleClose = () => modalEmit.set(false);

  React.useEffect(() => {
    axios
      .get(encodeURI('/README.md'), {
        responseType: 'text',
        headers: { Accept: 'text/plain' },
      })
      .then(({ data }) => {
        setEntry(data);
      })
      .catch((error) => {
        if (error.response) {
          // console.debug(error.response);
        }
        setEntry(`# 404 Not Found.\n This content failed to load.`);
      });
  }, [modalEmit.get]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={modalEmit.get}
      onClose={handleClose}
      scroll={'body'}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogContent dividers={false}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: indigo[100],

            '&:hover': {
              color: indigo[300],
            },
          }}
        >
          <CloseIcon
            sx={{
              fontSize: '2.5rem',
            }}
          />
        </IconButton>
        <ReactMarkdown
          className="markdown-body"
          linkTarget={'_blank'}
          remarkPlugins={[remarkGFM]}
          children={getEntry}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
