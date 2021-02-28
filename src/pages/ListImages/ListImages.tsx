import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Schedule from '@material-ui/icons/Schedule';
import Wc from '@material-ui/icons/Wc';
import Publish from '@material-ui/icons/Publish';
import Edit from '@material-ui/icons/Edit';
import NpcFilter from '../../components/NpcFilter/NpcFilter';
import { useUserContext } from '../../contexts/userContext';
import { FilterDto, useFilterContext } from '../../contexts/filterContext';
import apiService from '../../shared/services/api.service';
import { NpcsPaginatedDto } from '../../shared/dtos/api-responses.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

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
  pagination: {
    paddingTop: theme.spacing(2),
  },
}));

const ListImages: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const {
    filter, setFilter, open, setOpen,
  } = useFilterContext();
  const [npcs, setNpcs] = useState<NpcsPaginatedDto | null>(null);
  const [showPaginator, setShowPaginator] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationDto>({ page: 1, limit: 10 });

  useEffect(() => {
    if (user) {
      setPending(true);
      apiService.getNpcs(filter, pagination).then((npcsList) => {
        setNpcs(npcsList);
        setShowPaginator(Math.ceil(npcsList.totalCount / npcsList.limit) > 1);
        setPending(false);
      });
    }
  }, [user, filter, pagination]);

  const handleGetNpcs = (f: FilterDto) => {
    if (open) {
      setOpen(false);
    }
    setFilter(f);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination({ ...pagination, page });
  };

  return (
    <div className={classes.root}>
      <NpcFilter onFilter={handleGetNpcs} />
      {pending && 'Loading...'}
      {!pending && (
        <>
          {(!npcs || npcs.totalCount === 0) && 'No data'}
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
                <Grid item xs={12} sm={6} md={3} key={npc.id}>
                  <Card elevation={4}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        // className={classes.media}
                        src={`data:image/png;base64,${npc.blob}`}
                        title="Contemplative Reptile"
                      />
                      <CardContent>
                        {npc.class?.length !== 0 && (
                          npc.class.map((c) => (
                            <Chip key={`${npc.id}-${c}`} className={classes.chip} label={c} />
                          ))
                        )}
                        <Divider className={classes.divider} />
                        <Typography color="textSecondary" component="p">
                          <Wc className={classes.imageCardRowIcon} fontSize="inherit" />
                          {t(`common.enums.gender.${npc.gender}`)}
                        </Typography>
                        <Typography color="textSecondary" component="p">
                          <Schedule className={classes.imageCardRowIcon} fontSize="inherit" />
                          {format(new Date(npc.createdAt), 'yyyy-MM-dd k:mm')}
                        </Typography>
                        {npc.modifiedAt && (
                          <Typography color="textSecondary" component="p">
                            <Edit className={classes.imageCardRowIcon} fontSize="inherit" />
                            {format(new Date(npc.modifiedAt), 'yyyy-MM-dd k:mm')}
                          </Typography>
                        )}
                        {/* AGE CULTURE RACE */}
                        <Typography color="textSecondary" component="p">
                          <Publish className={classes.imageCardRowIcon} fontSize="inherit" />
                          {npc.uploader.username}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size="small" color="primary">
                        Share
                      </Button>
                      <Button size="small" color="primary">
                        Learn More
                      </Button>
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
    </div>
  );
};

export default ListImages;
