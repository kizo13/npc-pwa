import React, { forwardRef } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

interface NpcDialogProps extends DialogProps {
  children: React.ReactNode;
}

const SlideTransition = forwardRef((
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

const NpcDialog = ({ children, ...rest }: NpcDialogProps): JSX.Element => (
  <Dialog {...rest} TransitionComponent={SlideTransition}>
    { children }
  </Dialog>
);

export default NpcDialog;
