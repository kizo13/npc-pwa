import React, { forwardRef } from 'react';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';

const SlideTransition = forwardRef((
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

interface ConfirmationDialogProps extends DialogProps {
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}

const ConfirmationDialog = (props: ConfirmationDialogProps): JSX.Element => {
  const {
    title, children, open, setOpen, onConfirm,
  } = props;
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={SlideTransition}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="primary"
        >
          {t('common.buttons.yes')}
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
        >
          {t('common.buttons.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmationDialog;
