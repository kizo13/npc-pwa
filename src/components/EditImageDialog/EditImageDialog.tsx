import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import Pick from 'lodash-es/pick';
import { MultipleSelect } from 'react-select-material-ui';
import { makeStyles } from '@material-ui/core/styles';

import { DialogProps } from '@material-ui/core';
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
import { UpdateNpcDto } from '../../shared/dtos/api-requests.dto';
import { NpcDto } from '../../shared/dtos/entities.dto';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  formGenderButton: {
    flex: 1,
  },
}));

interface EditImageDialogProps {
  npc: NpcDto;
}

const initialState: UpdateNpcDto = {
  gender: undefined,
  class: undefined,
  age: undefined,
  race: undefined,
  culture: undefined,
};

const EditImageDialog = ({ onClose, npc, ...rest }: DialogProps & EditImageDialogProps): JSX.Element => {
  const npcValues = Pick(npc, 'gender', 'class', 'age', 'race', 'culture');
  const classes = useStyles();
  const { t } = useTranslation();
  const [form, setForm] = useState<UpdateNpcDto>({ ...npcValues });
  const [pending, setPending] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<Array<string>>([]);

  const handleInputChange = (prop: keyof UpdateNpcDto, value: unknown) => {
    setForm({ ...form, [prop]: value });
  };

  const handleClassChange = (value: string[]) => {
    setForm({ ...form, class: [...(value || [])] });
  };

  const handleDialogClose = (needsReload = false) => {
    if (onClose) {
      setForm(initialState);
      onClose({ reload: needsReload }, 'escapeKeyDown');
    }
  };

  const handleUpdateImage = () => {
    setPending(true);
    apiService.updateNpc(npc.id, form)
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
    <NpcDialog {...rest} onClose={() => handleDialogClose()}>
      <DialogTitle id="alert-dialog-slide-title">{t('dialogs.editImage.title')}</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <ToggleButtonGroup
            id="npcfilter-gender"
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
            values={form.class}
            options={availableClasses}
            onChange={handleClassChange}
            SelectProps={{
              isMulti: true,
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
          onClick={handleUpdateImage}
          // disabled={!form.file}
        >
          {t('common.buttons.save')}
        </LoadingButton>
        <Button variant="contained" onClick={() => handleDialogClose()}>{t('common.buttons.cancel')}</Button>
      </DialogActions>
    </NpcDialog>
  );
};

export default EditImageDialog;
