import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { MultipleSelect } from 'react-select-material-ui';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps, Divider } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Button from '../Button';
import LoadingButton from '../LoadingButton';
import NpcDialog from '../../shared/components/NpcDialog/NpcDialog';

import AgeEnums from '../../shared/enums/age.enum';
import GenderEnums from '../../shared/enums/gender.enum';
import RaceEnums from '../../shared/enums/race.enums';
import CultureEnums from '../../shared/enums/culture.enums';
import apiService from '../../shared/services/api.service';
import { CreateNpcDto } from '../../shared/dtos/api-requests.dto';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  divider: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  uploader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing(1),
  },
  uploaderImage: {
    width: '100%',
    borderRadius: theme.spacing(0.5),
  },
  uploaderLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    cursor: 'pointer',
  },
  uploadLabelText: {
    width: '100%',
    textAlign: 'center',
    padding: '10px 0',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  uploadLabelButton: {
    marginLeft: '10px',
  },
  formGenderButton: {
    flex: 1,
  },
}));

const initialState: CreateNpcDto = {
  file: undefined,
  gender: undefined,
  class: [],
  age: undefined,
  race: undefined,
  culture: undefined,
};

const AddImageDialog = ({ onClose, ...rest }: DialogProps): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState<string>();
  const [pending, setPending] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<Array<string>>([]);

  const handleInputChange = (prop: string, value: unknown) => {
    setForm({ ...form, [prop]: value });
  };

  const handleClassChange = (value: string[]) => {
    setForm({ ...form, class: [...(value || [])] });
  };

  const handleFileChange = (filelist: FileList | null) => {
    if (filelist && filelist.length > 0) {
      setForm({ ...form, file: filelist[0] });
      setPreview(URL.createObjectURL(filelist[0]));
    }
  };

  const handleClearImage = () => {
    setForm({ ...form, file: undefined });
    setPreview(undefined);
  };

  const handleDialogClose = () => {
    if (onClose) {
      setForm(initialState);
      setPreview(undefined);
      onClose({ reload: pending }, 'escapeKeyDown');
    }
  };

  const handleAddImage = () => {
    setPending(true);
    apiService.createNpc(form)
      .then(() => {
        handleDialogClose();
        setPending(false);
      })
      .catch((error: AxiosError) => {
        setPending(false);
        if (error.response?.status === 403) {
          console.error(error);
        }
      });
  };

  useEffect(() => {
    let active = true;

    if (rest.open) {
      (async () => {
        const classList = await apiService.getAvailableClasses();
        if (active) setAvailableClasses(classList);
      })();
    }

    return () => {
      active = false;
    };
  }, [rest.open]);

  return (
    <NpcDialog {...rest} onClose={handleDialogClose}>
      <DialogTitle id="alert-dialog-slide-title">{t('dialogs.addImage.title')}</DialogTitle>
      <DialogContent>
        <div className={classes.uploader}>
          <label htmlFor="contained-button-file" className={classes.uploaderLabel}>
            {preview && <img className={classes.uploaderImage} src={preview} alt="preview" />}
            <input
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              name="file"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            {!form.file && (
              <div className={classes.uploadLabelText}>{t('dialogs.addImage.selectFileLabel')}</div>
            )}
          </label>
          {preview && (
            <Button
              variant="contained"
              style={{ width: '100%' }}
              onClick={handleClearImage}
            >
              {t('dialogs.addImage.clearImageButton')}
            </Button>
          )}
        </div>
        <Divider className={classes.divider} />
        <FormControl className={classes.formControl}>
          <ToggleButtonGroup
            id="npfilter-gender"
            exclusive
            size="small"
            value={form.gender}
            onChange={(_e, v) => handleInputChange('gender', v)}
            aria-label="Nem"
          >
            <ToggleButton className={classes.formGenderButton} value={GenderEnums.MALE} aria-label={GenderEnums.MALE}>
              {t(`common.enums.gender.${GenderEnums.MALE}`)}
            </ToggleButton>
            <ToggleButton className={classes.formGenderButton} value={GenderEnums.FEMALE} aria-label={GenderEnums.FEMALE}>
              {t(`common.enums.gender.${GenderEnums.FEMALE}`)}
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        <FormControl className={classes.formControl}>
          <MultipleSelect
            label={t('common.labels.class')}
            values={['London', 'Vienna']}
            options={availableClasses}
            onChange={handleClassChange}
            SelectProps={{
              isCreatable: true,
              msgNoOptionsAvailable: t('dialogs.addImage.allClassesSeelctedLabel'),
            }}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="form-age-label">{t('common.labels.age')}</InputLabel>
          <Select
            labelId="form-age-label"
            id="form-age"
            value={form.age || ''}
            defaultValue=""
            onChange={(e) => handleInputChange('age', e.target.value)}
          >
            <MenuItem value="">{t('dialogs.addImage.selectLabel')}</MenuItem>
            {Object.values(AgeEnums).map((age) => (
              <MenuItem key={AgeEnums[age]} value={AgeEnums[age]}>{t(`common.enums.age.${AgeEnums[age]}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="form-race-label">{t('common.labels.race')}</InputLabel>
          <Select
            labelId="form-race-label"
            id="form-race"
            value={form.race || ''}
            defaultValue=""
            onChange={(e) => handleInputChange('race', e.target.value)}
          >
            <MenuItem value="">{t('dialogs.addImage.selectLabel')}</MenuItem>
            {Object.values(RaceEnums).map((race) => (
              <MenuItem key={RaceEnums[race]} value={RaceEnums[race]}>{t(`common.enums.race.${RaceEnums[race]}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="form-culture-label">{t('common.labels.culture')}</InputLabel>
          <Select
            labelId="form-culture-label"
            id="form-culture"
            value={form.culture || ''}
            defaultValue=""
            onChange={(e) => handleInputChange('culture', e.target.value)}
          >
            <MenuItem value="">{t('dialogs.addImage.selectLabel')}</MenuItem>
            {Object.values(CultureEnums).map((culture) => (
              <MenuItem key={CultureEnums[culture]} value={CultureEnums[culture]}>
                {t(`common.enums.culture.${CultureEnums[culture]}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={pending}
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleAddImage}
          disabled={!form.file}
        >
          {t('common.buttons.save')}
        </LoadingButton>
        <Button variant="contained" onClick={handleDialogClose}>{t('common.buttons.cancel')}</Button>
      </DialogActions>
    </NpcDialog>
  );
};

export default AddImageDialog;
