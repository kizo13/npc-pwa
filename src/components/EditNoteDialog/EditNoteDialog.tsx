import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pick from 'lodash-es/pick';
import { AxiosError } from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Button from '../Button';
import LoadingButton from '../LoadingButton';
import NpcDialog from '../../shared/components/NpcDialog/NpcDialog';
import apiService from '../../shared/services/api.service';
import { UpdateNoteDto } from '../../shared/dtos/api-requests.dto';
import { NoteDto } from '../../shared/dtos/entities.dto';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
}));

interface EditNoteDialogProps {
  note: NoteDto;
}

const initialState: UpdateNoteDto = {
  description: '',
  isPrivate: false,
};

const EditNoteDialog = ({ onClose, note, ...rest }: DialogProps & EditNoteDialogProps): JSX.Element => {
  const noteValues = Pick(note, 'description', 'isPrivate');
  const classes = useStyles();
  const { t } = useTranslation();
  const [form, setForm] = useState<UpdateNoteDto>({ ...noteValues });
  const [pending, setPending] = useState(false);

  const handleInputChange = (prop: keyof UpdateNoteDto, value: unknown) => {
    setForm({ ...form, [prop]: value });
  };

  const handleCheckboxChange = () => {
    setForm({ ...form, isPrivate: !form.isPrivate });
  };

  const handleDialogClose = (needsReload = false) => {
    if (onClose) {
      setForm(initialState);
      onClose({ reload: needsReload }, 'escapeKeyDown');
    }
  };

  const handleUpdateNote = () => {
    setPending(true);
    apiService.updateNote(note.id, form)
      .then(() => {
        handleDialogClose(true);
        setPending(false);
      })
      .catch((error: AxiosError) => {
        setPending(false);
        if (error.response?.status === 403) {
          console.error(error);
        }
      });
  };

  return (
    <NpcDialog {...rest} onClose={() => handleDialogClose()}>
      <DialogTitle id="alert-dialog-slide-title">{t('dialogs.editNote.title')}</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <TextField
            variant="standard"
            size="small"
            id="description"
            multiline
            rows={4}
            label={t('dialogs.addNote.descriptionLabel')}
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            margin="normal"
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <FormControlLabel
            control={<Checkbox value={form.isPrivate} checked={form.isPrivate} onClick={handleCheckboxChange} />}
            label={t('dialogs.addNote.isPrivateLabel')}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={pending}
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleUpdateNote}
        >
          {t('common.buttons.save')}
        </LoadingButton>
        <Button variant="contained" onClick={() => handleDialogClose()}>{t('common.buttons.cancel')}</Button>
      </DialogActions>
    </NpcDialog>
  );
};

export default EditNoteDialog;
