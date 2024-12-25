import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import muiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { blueGrey } from '@mui/material/colors';
import Styled from '@emotion/styled';
import $readme from '@docs/readme/README.md';

const Dialog = Styled(muiDialog)`
  .MuiBackdrop-root {
    background: rgba(0,0,0,0.9);
  }
  .MuiDialogContent-root {
    background: #0d1117;
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
  color: #fff;
  background: ${blueGrey[900]};
  transition: all 200ms ease-in;

  @media (min-width: 600px) {
    position: absolute;
  }

  &:hover {
    background: ${blueGrey[700]};
  }

  .MuiSvgIcon-root {
    font-size: 1.25rem;

    @media (min-width: 600px) {
      font-size: 2.5rem;
    }
  }
`;

type propType = {
  emits: {
    modalEmit: {
      get: boolean,
      set: (is: boolean) => void,
    }
  }
};

const ProfileModal = ({ emits } : propType) => {
  const [getEntry, setEntry] = useState('Now Loading...');
  const { modalEmit } = emits;

  const handleClose = () => modalEmit.set(false);

  useEffect(() => setEntry($readme), [modalEmit.get]);

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
          remarkPlugins={[remarkGFM]}
          children={getEntry}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
