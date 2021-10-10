import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonProps } from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Alert, { Color } from '@material-ui/lab/Alert';

import Button from '../Button';

interface ShareButtonProps {
  text: string;
  url: string;
}

const ShareButton = ({
  children, text, url, ...rest
}: ShareButtonProps & ButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState<{ type: Color, message: string, error?: unknown }>({
    type: 'error',
    message: 'pages.noteList.shareFailedMessage',
  });

  const handleShare = async () => {
    setSnackbarData({ type: 'error', message: 'pages.noteList.shareFailedMessage' });
    if (navigator.share === undefined) {
      if (navigator.clipboard !== undefined) {
        navigator.clipboard.writeText(url);
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
      setSnackbarData({ type: 'success', message: 'pages.noteList.shareUrlCopiedToClipboard' });
      setSnackbarOpen(true);
      return;
    }

    try {
      await navigator.share({ text, url });
    } catch (error) {
      setSnackbarData({ type: 'error', message: 'pages.noteList.shareError', error });
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button {...rest} onClick={handleShare}>
        {children}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarData.type} elevation={6} variant="filled">{t(snackbarData.message, { error: snackbarData.error })}</Alert>
      </Snackbar>
    </>
  );
};

export default ShareButton;
