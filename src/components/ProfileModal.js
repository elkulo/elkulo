import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import muiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { indigo, blueGrey } from '@mui/material/colors';
import Styled from '@emotion/styled';

const Dialog = Styled(muiDialog)`
  .MuiBackdrop-root {
    background: rgba(255,255,255,1);
  }

  .MuiPaper-root.MuiDialog-paperScrollBody {
    box-shadow: none;
    margin: 0;
    max-width: 100%;
    width: 100%;

    @media (min-width: 600px) {
      margin: 1rem;
      max-width: calc(100% - 2rem);
      width: calc(100% - 2rem);
    }
    @media (min-width: 900px) {
      margin: 2rem;
      max-width: 900px;
      width: calc(100% - 4rem);
    }
  }
`;

const CloseButton = Styled(IconButton)`
  position: fixed;
  right: 0.5rem;
  top: 0.5rem;
  color: ${indigo[100]};
  background: ${blueGrey[900]};
  transition: all 200ms ease-in;

  @media (min-width: 600px) {
    position: absolute;
    background: #fff;
  }

  &:hover {
    background: ${blueGrey[700]};

    @media (min-width: 600px) {
      color: ${indigo[300]};
      background: #fff;
    }
  }

  .MuiSvgIcon-root {
    font-size: 1.25rem;

    @media (min-width: 600px) {
      font-size: 2.5rem;
    }
  }
`;

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
        <CloseButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
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
