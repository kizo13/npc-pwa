import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import MenuItem from '@material-ui/core/MenuItem';

import ChevronLeft from '@material-ui/icons/ChevronLeft';

import red from '@material-ui/core/colors/red';

import { FilterDto, initialFilterState, useFilterContext } from '../../contexts/filterContext';
import apiService from '../../shared/services/api.service';
import { UserDto } from '../../shared/dtos/entities.dto';
import AgeEnums from '../../shared/enums/age.enum';
import GenderEnums from '../../shared/enums/gender.enum';
import RaceEnums from '../../shared/enums/race.enums';
import CultureEnums from '../../shared/enums/culture.enums';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 300,
  },
  drawerPaper: {
    width: 300,
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterClearAllButton: {
    padding: 12,
    color: red[600],
    cursor: 'pointer',
    fontSize: 13,
  },
  filterCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  filterMainBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  filterFormControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  filterGenderButton: {
    flex: 1,
  },
  filterButton: {
    width: '100%',
  },
}));

interface NpcFilterProps {
  onFilter: (filter: FilterDto) => void
}

const NpcFilter = ({ onFilter }: NpcFilterProps): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { open, setOpen, filter: contextFilter } = useFilterContext();
  const [filter, setFilter] = useState(contextFilter);

  const [openUsers, setOpenUsers] = useState(false);
  const [users, setUsers] = useState<UserDto[] | null>(null);
  const loadingUsers = openUsers && !users;

  const [openClasses, setOpenClasses] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<string[] | null>(null);
  const loadingClasses = openClasses && !availableClasses;

  useEffect(() => {
    let active = true;

    if (!loadingUsers) return undefined;

    (async () => {
      const userList = await apiService.getUsers();
      if (active) setUsers(userList);
    })();

    return () => {
      active = false;
    };
  }, [loadingUsers]);

  useEffect(() => {
    let active = true;

    if (!loadingClasses) return undefined;

    (async () => {
      const classList = await apiService.getAvailableClasses();
      if (active) setAvailableClasses(classList);
    })();

    return () => {
      active = false;
    };
  }, [loadingClasses]);

  useEffect(() => {
    setFilter(contextFilter);
  }, [contextFilter]);

  const handleRightDrawerOpen = (): void => {
    if (!open) {
      setOpen(true);
    }
  };

  const handleRightDrawerClose = (): void => {
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilter(initialFilterState);
  };

  const handleFilterChange = (prop: string, value: unknown) => {
    setFilter({ ...filter, [prop]: value });
  };

  const handleFilterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilter(filter);
  };

  return (
    <SwipeableDrawer
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      anchor="right"
      open={open}
      onOpen={handleRightDrawerOpen}
      onClose={handleRightDrawerClose}
    >
      <div className={classes.filterHeader}>
        <IconButton aria-label="settings" onClick={handleRightDrawerClose}>
          <ChevronLeft />
        </IconButton>
        <Typography className={classes.filterClearAllButton} onClick={handleClearFilters}>
          {t('common.layout.filter.clearAllButton')}
        </Typography>
      </div>
      <Divider />
      <Card elevation={0} className={classes.filterCard}>
        <CardContent className={classes.filterMainBlock}>
          {/* UPLOADER */}
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="npcfilter-uploader-label">{t('common.labels.uploader')}</InputLabel>
            <Select
              labelId="npcfilter-uploader-label"
              id="npcfilter-uploader"
              open={openUsers}
              onOpen={() => { setOpenUsers(true); }}
              onClose={() => { setOpenUsers(false); }}
              value={filter.uploaderId}
              onChange={(e) => handleFilterChange('uploaderId', e.target.value)}
            >
              {(!users === null || !users?.length) && <MenuItem disabled />}
              {users?.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* GENDER */}
          <FormControl className={classes.filterFormControl}>
            <ToggleButtonGroup
              id="npfilter-gender"
              exclusive
              size="small"
              value={filter.gender}
              onChange={(e, v) => handleFilterChange('gender', v)}
              aria-label="Nem"
            >
              <ToggleButton className={classes.filterGenderButton} value={GenderEnums.MALE} aria-label={GenderEnums.MALE}>
                {t(`common.enums.gender.${GenderEnums.MALE}`)}
              </ToggleButton>
              <ToggleButton className={classes.filterGenderButton} value={GenderEnums.FEMALE} aria-label={GenderEnums.FEMALE}>
                {t(`common.enums.gender.${GenderEnums.FEMALE}`)}
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
          {/* CLASSES */}
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="npcfilter-class-label">{t('common.labels.class')}</InputLabel>
            <Select
              labelId="npcfilter-class-label"
              id="npcfilter-class"
              open={openClasses}
              onOpen={() => { setOpenClasses(true); }}
              onClose={() => { setOpenClasses(false); }}
              value={filter.class}
              onChange={(e) => handleFilterChange('class', e.target.value)}
            >
              {(!availableClasses === null || !availableClasses?.length) && <MenuItem disabled />}
              {availableClasses?.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* AGE */}
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="npcfilter-age-label">{t('common.labels.age')}</InputLabel>
            <Select
              labelId="npcfilter-age-label"
              id="npcfilter-age"
              value={filter.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
            >
              {Object.values(AgeEnums).map((age) => (
                <MenuItem key={AgeEnums[age]} value={AgeEnums[age]}>{t(`common.enums.age.${AgeEnums[age]}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* RACE */}
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="npcfilter-race-label">{t('common.labels.race')}</InputLabel>
            <Select
              labelId="npcfilter-race-label"
              id="npcfilter-race"
              value={filter.race}
              onChange={(e) => handleFilterChange('race', e.target.value)}
            >
              {Object.values(RaceEnums).map((race) => (
                <MenuItem key={RaceEnums[race]} value={RaceEnums[race]}>{t(`common.enums.race.${RaceEnums[race]}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* CULTURE */}
          <FormControl className={classes.filterFormControl}>
            <InputLabel id="npcfilter-culture-label">{t('common.labels.culture')}</InputLabel>
            <Select
              labelId="npcfilter-culture-label"
              id="npcfilter-culture"
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
        </CardContent>
        <CardContent>
          <Button
            className={classes.filterButton}
            color="primary"
            variant="contained"
            disableElevation
            onClick={handleFilterClick}
          >
            {t('common.layout.filter.filterButton')}
          </Button>
        </CardContent>
      </Card>
    </SwipeableDrawer>
  );
};

export default NpcFilter;
