import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import hu from 'date-fns/locale/hu';
import isEqual from 'lodash-es/isEqual';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

import Schedule from '@material-ui/icons/Schedule';
import Wc from '@material-ui/icons/Wc';
import Publish from '@material-ui/icons/Publish';
import Edit from '@material-ui/icons/Edit';
import Panorama from '@material-ui/icons/Panorama';
import ChildCare from '@material-ui/icons/ChildCare';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import LanguageIcon from '@material-ui/icons/Language';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Delete from '@material-ui/icons/Delete';
import ImageSearch from '@material-ui/icons/ImageSearch';
import Clear from '@material-ui/icons/Clear';
import AddPhotoAlternate from '@material-ui/icons/AddPhotoAlternate';

import NpcFilter from '../../components/NpcFilter';
import EmptyState from '../../components/EmptyState';
import AddImageDialog from '../../components/AddImageDialog';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';

import { useUserContext } from '../../contexts/userContext';
import { FilterDto, useFilterContext, initialFilterState } from '../../contexts/filterContext';
import { ToolbarAction, useToolbarContext } from '../../contexts/toolbarContext';
import apiService from '../../shared/services/api.service';
import { NpcsPaginatedDto } from '../../shared/dtos/api-responses.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { NpcDto } from '../../shared/dtos/entities.dto';
import EditImageDialog from '../../components/EditImageDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: `calc(100vh - 48px - ${2 * theme.spacing(2)}px)`,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  imageGrid: {
    flex: 1,
    overflow: 'auto',
  },
  imageCardRowIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'text-top',
  },
  imageCardButtonGroup: {
    justifyContent: 'space-between',
  },
  imageCardButton: {
    margin: theme.spacing(1),
  },
  pagination: {
    paddingTop: theme.spacing(2),
  },
  clearButton: {
    color: red[700],
  },
}));

const ListImages: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const { setActions } = useToolbarContext();
  const {
    filter, setFilter, open, setOpen,
  } = useFilterContext();
  const [npcs, setNpcs] = useState<NpcsPaginatedDto | null>(null);
  const [showPaginator, setShowPaginator] = useState<boolean>(false);
  const [fetchPending, setFetchPending] = useState<boolean>(false);
  const [deletePending, setDeletePending] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationDto>({ page: 1, limit: 10 });
  const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);
  const [editImageDialogOpen, setEditImageDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editNpc, setEditNpc] = useState<NpcDto | null>(null);

  const fetchNpcs = useCallback((f: FilterDto, p: PaginationDto) => {
    setFetchPending(true);
    apiService.getNpcs(f, p).then((npcsList) => {
      setNpcs(npcsList);
      setShowPaginator(Math.ceil(npcsList.totalCount / npcsList.limit) > 1);
      setFetchPending(false);
    });
  }, []);

  const deleteNpc = () => {
    if (!deleteId) {
      return;
    }
    setDeletePending(true);
    apiService.deleteNpc(deleteId).then(() => {
      fetchNpcs(filter, pagination);
      setDeletePending(false);
    });
  };

  const handleAddImageDialogOpen = (): void => {
    setAddImageDialogOpen(true);
  };

  const handleAddImageDialogClose = (event: { reload?: boolean }): void => {
    setAddImageDialogOpen(false);
    if (event.reload) {
      fetchNpcs(filter, pagination);
    }
  };

  const handleEditImageDialogClose = (event: { reload?: boolean }): void => {
    setEditImageDialogOpen(false);
    setEditNpc(null);
    if (event.reload) {
      fetchNpcs(filter, pagination);
    }
  };

  const handleRightDrawerOpen = useCallback((): void => {
    setOpen(true);
  }, [setOpen]);

  const handleClearFilters = useCallback((): void => {
    setFilter(initialFilterState);
  }, [setFilter]);

  const isFilterSet = useMemo(() => !isEqual(filter, initialFilterState), [filter]);

  const setActionButtons: Array<ToolbarAction> = useMemo(() => [
    {
      label: 'Add',
      onClick: handleAddImageDialogOpen,
      icon: AddPhotoAlternate,
    },
    {
      label: 'Clear filter',
      onClick: handleClearFilters,
      icon: Clear,
      className: classes.clearButton,
      isVisible: isFilterSet,
    },
    {
      label: 'Filter',
      onClick: handleRightDrawerOpen,
      icon: ImageSearch,
    },
  ], [classes.clearButton, handleClearFilters, handleRightDrawerOpen, isFilterSet]);

  useEffect(() => {
    const actionList: Array<ToolbarAction> = setActionButtons;
    setActions([...actionList]);

    return () => setActions([]);
  }, [setActionButtons, setActions]);

  useEffect(() => {
    if (user) {
      fetchNpcs(filter, pagination);
    }
  }, [user, filter, pagination, fetchNpcs]);

  const handleGetNpcs = (f: FilterDto) => {
    if (open) {
      setOpen(false);
    }
    setFilter(f);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    event.preventDefault();
    setPagination({ ...pagination, page });
  };

  const handleEditNpc = (npc: NpcDto) => {
    setEditNpc(npc);
    setEditImageDialogOpen(true);
  };

  const handleDeleteNpc = (npcId: number) => {
    setDeleteId(npcId);
    setConfirmDialogOpen(true);
  };

  const emptyStateActions = useMemo(() => [
    {
      label: t('pages.imageList.emptyStateButton'),
      func: handleAddImageDialogOpen,
    },
  ], [t]);

  return (
    <div className={classes.root}>
      <NpcFilter onFilter={handleGetNpcs} />
      {fetchPending && 'Loading...'}
      {!fetchPending && (
        <>
          {(!npcs || npcs.totalCount === 0) && (
            <EmptyState
              icon={Panorama}
              title={t('pages.imageList.emptyStateTitle')}
              subtitle={t('pages.imageList.emptyStateSubtitle')}
              actions={emptyStateActions}
            />
          )}
          {(npcs && npcs.totalCount > 0) && (
            <Grid
              className={classes.imageGrid}
              container
              spacing={2}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              {npcs.data.map((npc) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={npc.id}>
                  <Card elevation={4}>
                    <CardMedia component="img" src={`data:image/png;base64,${npc.blob}`} />
                    <CardContent>
                      {npc.class?.length !== 0 && (
                        npc.class.map((c) => (
                          <Chip key={`${npc.id}-${c}`} className={classes.chip} label={c} />
                        ))
                      )}
                      <Divider className={classes.divider} />
                      {npc.race && (
                        <Typography color="textSecondary" component="p">
                          <LanguageIcon className={classes.imageCardRowIcon} fontSize="inherit" />
                          {t(`common.enums.race.${npc.race}`)}
                        </Typography>
                      )}
                      <Typography color="textSecondary" component="p">
                        <Wc className={classes.imageCardRowIcon} fontSize="inherit" />
                        {t(`common.enums.gender.${npc.gender}`)}
                      </Typography>
                      {npc.age && (
                        <Typography color="textSecondary" component="p">
                          <ChildCare className={classes.imageCardRowIcon} fontSize="inherit" />
                          {t(`common.enums.age.${npc.age}`)}
                        </Typography>
                      )}
                      {npc.culture && (
                        <Typography color="textSecondary" component="p">
                          <SupervisedUserCircle className={classes.imageCardRowIcon} fontSize="inherit" />
                          {t(`common.enums.culture.${npc.culture}`)}
                        </Typography>
                      )}
                      <Divider className={classes.divider} />
                      <Typography color="textSecondary" component="p">
                        <Publish className={classes.imageCardRowIcon} fontSize="inherit" />
                        {npc.uploader.username}
                      </Typography>
                      <Typography color="textSecondary" component="p">
                        <Schedule className={classes.imageCardRowIcon} fontSize="inherit" />
                        <Tooltip title={format(new Date(npc.createdAt), 'yyyy-MM-dd k:mm')}>
                          <span>{formatDistance(new Date(npc.createdAt), Date.now(), { addSuffix: true, locale: hu })}</span>
                        </Tooltip>
                      </Typography>
                      {npc.modifiedAt && (
                        <Typography color="textSecondary" component="p">
                          <Edit className={classes.imageCardRowIcon} fontSize="inherit" />
                          <Tooltip title={format(new Date(npc.modifiedAt), 'yyyy-MM-dd k:mm')}>
                            <span>{formatDistance(new Date(npc.modifiedAt), Date.now(), { addSuffix: true, locale: hu })}</span>
                          </Tooltip>
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions className={classes.imageCardButtonGroup}>
                      <div>
                        <IconButton
                          size="small"
                          color="primary"
                          className={classes.imageCardButton}
                          onClick={() => handleEditNpc(npc)}
                        >
                          {deletePending && <CircularProgress color="secondary" />}
                          {!deletePending && <Edit />}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          className={classes.imageCardButton}
                          onClick={() => handleDeleteNpc(npc.id)}
                        >
                          {deletePending && <CircularProgress color="secondary" />}
                          {!deletePending && <Delete />}
                        </IconButton>
                      </div>
                      <div>
                        <IconButton size="small" color="primary" className={classes.imageCardButton}>
                          <NoteAdd />
                        </IconButton>
                      </div>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {(showPaginator && npcs) && (
            <Pagination
              className={classes.pagination}
              count={Math.ceil(npcs.totalCount / npcs.limit)}
              page={npcs.page}
              onChange={handlePageChange}
            />
          )}
        </>
      )}
      <AddImageDialog fullWidth maxWidth="xs" open={addImageDialogOpen} onClose={handleAddImageDialogClose} />
      {editNpc && (
        <EditImageDialog fullWidth maxWidth="xs" npc={editNpc as NpcDto} open={editImageDialogOpen} onClose={handleEditImageDialogClose} />
      )}
      <ConfirmationDialog
        title={t('dialogs.deleteImage.title')}
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={deleteNpc}
      >
        {t('dialogs.deleteImage.description')}
      </ConfirmationDialog>
    </div>
  );
};

export default ListImages;
