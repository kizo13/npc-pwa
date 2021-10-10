import React, {
  useCallback, useState, useMemo, useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import isEqual from 'lodash-es/isEqual';
import format from 'date-fns/format';
import hu from 'date-fns/locale/hu';
import formatDistance from 'date-fns/formatDistance';
import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

import Delete from '@material-ui/icons/Delete';
import Description from '@material-ui/icons/Description';
import Publish from '@material-ui/icons/Publish';
import Schedule from '@material-ui/icons/Schedule';
import Edit from '@material-ui/icons/Edit';
import ImageSearch from '@material-ui/icons/ImageSearch';
import Clear from '@material-ui/icons/Clear';
import Share from '@material-ui/icons/Share';
import Lock from '@material-ui/icons/Lock';

import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';

import { useUserContext } from '../../contexts/userContext';
import apiService from '../../shared/services/api.service';
import { PaginatedDto, PaginationDto } from '../../shared/dtos/pagination.dto';
import { NoteDto } from '../../shared/dtos/entities.dto';
import { LIMIT_TO_PAGE, ROUTES } from '../../shared/constants';
import {
  FilterDto, initialFilterState, NoteFilterDto, useFilterContext,
} from '../../contexts/filterContext';
import { ToolbarAction, useToolbarContext } from '../../contexts/toolbarContext';
import NoteFilter from '../../components/NoteFilter';
import ShareButton from '../../components/ShareButton';
import EditNoteDialog from '../../components/EditNoteDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: `calc(100vh - 48px - ${2 * theme.spacing(3)}px)`,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  noteGrid: {
    flex: 1,
    overflow: 'auto',
  },
  noteCardRowIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'text-top',
  },
  noteCardButtonGroup: {
    justifyContent: 'space-between',
  },
  noteCardButton: {
    margin: theme.spacing(1),
  },
  pagination: {
    paddingTop: theme.spacing(2),
  },
  clearButton: {
    color: red[700],
  },
  privateCard: {
    backgroundColor: amber[100],
  },
  privateButton: {
    color: amber[700],
  },
}));

const ListNotes: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const history = useHistory();
  const { setActions } = useToolbarContext();
  const {
    filter, setFilter, open, setOpen,
  } = useFilterContext();
  const [notes, setNotes] = useState<PaginatedDto<NoteDto> | null>(null);
  const [showPaginator, setShowPaginator] = useState<boolean>(false);
  const [fetchPending, setFetchPending] = useState<boolean>(false);
  const [deletePending, setDeletePending] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<NoteDto | null>(null);
  const [deleteNote, setDeleteNote] = useState<NoteDto | null>(null);
  const [pagination, setPagination] = useState<PaginationDto>({ page: 1, limit: LIMIT_TO_PAGE });

  const fetchNotes = useCallback((f: NoteFilterDto, p: PaginationDto) => {
    setFetchPending(true);
    apiService.getNotes(f, p).then((noteList) => {
      setNotes(noteList);
      setShowPaginator(Math.ceil(noteList.totalCount / noteList.limit) > 1);
      setFetchPending(false);
    });
  }, []);

  const deleteNoteRemote = () => {
    if (!deleteNote) {
      return;
    }
    setDeletePending(true);
    apiService.deleteNote(deleteNote.id).then(() => {
      // TODO: add snackbar
      fetchNotes(filter, pagination);
      setDeletePending(false);
    });
  };

  useEffect(() => {
    if (user) {
      fetchNotes(filter, pagination);
    }
  }, [user, filter, pagination, fetchNotes]);

  const handleGetNotes = (f: FilterDto) => {
    if (open) {
      setOpen(false);
    }
    setFilter(f);
  };

  const handleNavigateToImages = useCallback((): void => {
    history.push(ROUTES.images);
  }, [history]);

  const handleDeleteNpc = (note: NoteDto) => {
    setDeleteNote(note);
    setConfirmDialogOpen(true);
  };

  const handleEditNote = (note: NoteDto) => {
    setEditNote(note);
    setEditNoteDialogOpen(true);
  };

  const handleEditImageDialogClose = (event: { reload?: boolean }): void => {
    setEditNoteDialogOpen(false);
    setEditNote(null);
    if (event.reload) {
      // TODO: add snackbar
      fetchNotes(filter, pagination);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    event.preventDefault();
    setPagination({ ...pagination, page });
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

  const emptyStateActions = useMemo(() => [
    {
      label: t('pages.noteList.emptyStateButton'),
      func: handleNavigateToImages,
    },
  ], [t, handleNavigateToImages]);

  useEffect(() => {
    handleClearFilters();
  }, [handleClearFilters]);

  useEffect(() => {
    const actionList: Array<ToolbarAction> = setActionButtons;
    setActions([...actionList]);

    return () => setActions([]);
  }, [setActionButtons, setActions]);

  return (
    <div className={classes.root}>
      <NoteFilter onFilter={handleGetNotes} />
      {fetchPending && 'Loading...'}
      {!fetchPending && (
        <>
          {(!notes || notes.totalCount === 0) && (
            <EmptyState
              icon={Description}
              title={t('pages.noteList.emptyStateTitle')}
              subtitle={t('pages.noteList.emptyStateSubtitle')}
              actions={emptyStateActions}
            />
          )}
          {(notes && notes.totalCount > 0) && (
            <Grid
              className={classes.noteGrid}
              container
              spacing={2}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              {notes.data.map((note) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                  <Card elevation={4} className={`${note.isPrivate ? classes.privateCard : ''}`}>
                    <CardMedia component="img" src={`data:image/png;base64,${note.npc.blob}`} />
                    <CardContent>
                      <Typography color="textSecondary" component="h3">
                        {note.isPrivate && (
                          <Lock className={`${classes.noteCardRowIcon} ${classes.privateButton}`} fontSize="inherit" />
                        )}
                        {note.name}
                      </Typography>
                      {note.description && (
                        <Typography color="textSecondary" component="p">
                          {note.description}
                        </Typography>
                      )}
                      <Divider className={classes.divider} />
                      <Typography color="textSecondary" component="p">
                        <Publish className={classes.noteCardRowIcon} fontSize="inherit" />
                        {note.createdBy.username}
                      </Typography>
                      <Typography color="textSecondary" component="p">
                        <Schedule className={classes.noteCardRowIcon} fontSize="inherit" />
                        <Tooltip title={format(new Date(note.createdAt), 'yyyy-MM-dd k:mm')}>
                          <span>{formatDistance(new Date(note.createdAt), Date.now(), { addSuffix: true, locale: hu })}</span>
                        </Tooltip>
                      </Typography>
                      {note.modifiedAt && (
                        <Typography color="textSecondary" component="p">
                          <Edit className={classes.noteCardRowIcon} fontSize="inherit" />
                          <Tooltip title={format(new Date(note.modifiedAt), 'yyyy-MM-dd k:mm')}>
                            <span>{formatDistance(new Date(note.modifiedAt), Date.now(), { addSuffix: true, locale: hu })}</span>
                          </Tooltip>
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions className={classes.noteCardButtonGroup}>
                      <div>
                        <IconButton
                          size="small"
                          color="primary"
                          className={classes.noteCardButton}
                          onClick={() => handleEditNote(note)}
                        >
                          {deletePending && <CircularProgress color="secondary" />}
                          {!deletePending && <Edit />}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          className={classes.noteCardButton}
                          onClick={() => handleDeleteNpc(note)}
                        >
                          {deletePending && <CircularProgress color="secondary" />}
                          {!deletePending && <Delete />}
                        </IconButton>
                      </div>
                      <div>
                        <ShareButton
                          color="primary"
                          size="small"
                          text={note.name}
                          url={`${window.location.protocol}//${window.location.host}/preview/${note.hash}`}
                        >
                          <Share />
                        </ShareButton>
                      </div>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {(showPaginator && notes) && (
            <Pagination
              className={classes.pagination}
              count={Math.ceil(notes.totalCount / notes.limit)}
              page={notes.page}
              onChange={handlePageChange}
            />
          )}
        </>
      )}
      {editNote && (
        <EditNoteDialog fullWidth maxWidth="xs" note={editNote as NoteDto} open={editNoteDialogOpen} onClose={handleEditImageDialogClose} />
      )}
      {deleteNote && (
        <ConfirmationDialog
          title={t('dialogs.deleteImage.title')}
          open={confirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          onConfirm={deleteNoteRemote}
        >
          {t('dialogs.deleteNote.description')}
        </ConfirmationDialog>
      )}
    </div>
  );
};

export default ListNotes;
