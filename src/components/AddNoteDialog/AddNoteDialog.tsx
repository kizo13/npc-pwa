import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

import FindReplace from '@material-ui/icons/FindReplace';

import Button from '../Button';
import LoadingButton from '../LoadingButton';
import NpcDialog from '../../shared/components/NpcDialog/NpcDialog';

import apiService from '../../shared/services/api.service';
import { CreateNoteDto, NameGeneratorFilter } from '../../shared/dtos/api-requests.dto';
import { NpcDto } from '../../shared/dtos/entities.dto';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  uploader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(1),
  },
}));

interface AddNoteDialogProps {
  npc: NpcDto;
}

const AddNoteDialog = ({ onClose, npc, ...rest }: DialogProps & AddNoteDialogProps): JSX.Element => {
  const initialState: CreateNoteDto = useMemo(() => ({
    npc, name: '', description: '', isPrivate: false,
  }), [npc]);
  const classes = useStyles();
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateNoteDto>(initialState);
  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleInputChange = (prop: string, value: unknown) => {
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

  const handleGenerateName = () => {
    setFetching(true);
    const filter: NameGeneratorFilter = {
      gender: npc.gender,
      culture: npc.culture,
    };
    apiService.getGeneratedName(filter)
      .then((name: string) => {
        handleInputChange('name', name);
        setFetching(false);
      })
      .catch((error: AxiosError) => {
        setFetching(false);
        if (error.response?.status === 403) {
          console.error(error);
        }
      });
  };

  const handleAddNote = () => {
    setPending(true);
    apiService.createNote(form)
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
      <DialogTitle id="alert-dialog-slide-title">{t('dialogs.addNote.title')}</DialogTitle>
      <DialogContent>
        <Card elevation={4}>
          <CardMedia component="img" src={`data:image/png;base64,${npc.blob}`} />
        </Card>
        <FormControl className={classes.formControl}>
          <TextField
            variant="standard"
            size="small"
            id="name"
            type="text"
            label={t('dialogs.addNote.nameLabel')}
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleGenerateName}
                    edge="end"
                  >
                    {fetching ? <CircularProgress color="secondary" /> : <FindReplace />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
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
            control={<Checkbox value={form.isPrivate} onClick={handleCheckboxChange} />}
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
          onClick={handleAddNote}
          disabled={!form.name}
        >
          {t('common.buttons.save')}
        </LoadingButton>
        <Button variant="contained" onClick={() => handleDialogClose()}>{t('common.buttons.cancel')}</Button>
      </DialogActions>
    </NpcDialog>
  );
};

export default AddNoteDialog;
