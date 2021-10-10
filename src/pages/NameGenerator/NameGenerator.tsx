import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import grey from '@material-ui/core/colors/grey';

import LoadingButton from '../../components/LoadingButton';

import GenderEnums from '../../shared/enums/gender.enum';
import CultureEnums from '../../shared/enums/culture.enums';

import apiService from '../../shared/services/api.service';
import { NameGeneratorFilter } from '../../shared/dtos/api-requests.dto';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: `calc(100vh - 48px - ${2 * theme.spacing(2)}px)`,
  },
  filterContainer: {
    marginBottom: theme.spacing(2),
    backgroundColor: grey[200],
  },
  filterContent: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  filterGender: {
    width: '100px',
    marginRight: theme.spacing(2),
  },
  filterCulture: {
    width: '100px',
    marginRight: theme.spacing(2),
  },
  nameContainer: {
    backgroundColor: grey[100],
  },
  nameContent: {
    columnCount: 3,
    columnGap: theme.spacing(3),
  },
  names: {
    padding: `${theme.spacing(2)}px 0`,
  },
  emptyStateTitle: {
    color: grey[700],
    textAlign: 'center',
  },
}));

const initialState: NameGeneratorFilter = {
  gender: GenderEnums.MALE,
  culture: CultureEnums.pyarroni,
};

const NameGenerator: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<NameGeneratorFilter>(initialState);
  const [names, setNames] = useState<Array<string>>([]);
  const [pending, setPending] = useState<boolean>(false);

  const handleFilterChange = (prop: keyof NameGeneratorFilter, value: unknown) => {
    setFilter({ ...filter, [prop]: value });
  };

  const handleNameGenerate = () => {
    setPending(true);
    apiService.getGeneratedNames(filter)
      .then((generatedNames: string[]) => {
        setPending(false);
        setNames(generatedNames);
      })
      .catch((error: AxiosError) => {
        setPending(false);
        if (error.response?.status === 403) {
          console.error(error);
        }
      });
  };

  return (
    <div className={classes.root}>
      <Card elevation={0}>
        <CardContent>
          {/* GENDER */}
          <Card elevation={1} className={classes.filterContainer}>
            <CardContent className={classes.filterContent}>
              <FormControl className={classes.filterGender}>
                <InputLabel id="namegenerator-gender-label">{t('common.labels.gender')}</InputLabel>
                <Select
                  labelId="namegenerator-gender-label"
                  id="namegenerator-gender"
                  value={filter.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                  {Object.values(GenderEnums).map((gender) => (
                    <MenuItem key={GenderEnums[gender]} value={GenderEnums[gender]}>
                      {t(`common.enums.gender.${GenderEnums[gender]}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* CULTURE */}
              <FormControl className={classes.filterCulture}>
                <InputLabel id="namegenerator-culture-label">{t('common.labels.culture')}</InputLabel>
                <Select
                  labelId="namegenerator-culture-label"
                  id="namegenerator-culture"
                  value={filter.culture}
                  onChange={(e) => handleFilterChange('culture', e.target.value)}
                >
                  {Object.values(CultureEnums).map((culture) => (
                    <MenuItem key={CultureEnums[culture]} value={CultureEnums[culture]}>
                      {t(`common.enums.culture.${CultureEnums[culture]}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LoadingButton
                loading={pending}
                color="primary"
                variant="contained"
                disableElevation
                onClick={handleNameGenerate}
              >
                {t('common.buttons.search')}
              </LoadingButton>
            </CardContent>
          </Card>
          <Card elevation={1} className={classes.nameContainer}>
            {!names.length && (
              <CardContent>
                <h2 className={classes.emptyStateTitle}>{t('pages.nameGenerator.emptyStateTitle')}</h2>
              </CardContent>
            )}
            {!!names.length && (
              <CardContent className={classes.nameContent}>
                {names.map((name, i) => <div key={JSON.stringify({ key: i, name })} className={classes.names}>{name}</div>)}
              </CardContent>
            )}
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default NameGenerator;
