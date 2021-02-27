import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Schedule from '@material-ui/icons/Schedule';
import Typography from '@material-ui/core/Typography';
import NpcFilter from '../../components/NpcFilter/NpcFilter';
import { useUserContext } from '../../contexts/userContext';
import { FilterDto, useFilterContext } from '../../contexts/filterContext';
import apiService from '../../shared/services/api.service';
import { NpcsPaginatedDto } from '../../shared/dtos/api-responses.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  images: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  imageCardRowIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: 'text-top',
  },
}));

const ListImages: React.FunctionComponent<{}> = () => {
  const classes = useStyles();
  const { user } = useUserContext();
  const {
    filter, setFilter, open, setOpen,
  } = useFilterContext();
  const [npcs, setNpcs] = useState<NpcsPaginatedDto | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [pagination] = useState<PaginationDto>({ page: 1, limit: 10 }); // TODO: , setPagination

  useEffect(() => {
    if (user) {
      setPending(true);
      apiService.getNpcs(filter, pagination).then((npcsList) => {
        setNpcs(npcsList);
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

  return (
    <div className={classes.root}>
      <NpcFilter onFilter={handleGetNpcs} />
      {pending && 'Loading...'}
      {!pending && (
        <>
          {(!npcs || npcs.totalCount === 0) && 'No data'}
          {(npcs && npcs.totalCount > 0) && (
            <Grid
              // className={classes.images}
              container
              spacing={2}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              {npcs.data.map((npc) => (
                <Grid item xs={12} sm={6} md={3} key={npc.id}>
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        // className={classes.media}
                        src={`data:image/png;base64,${npc.blob}`}
                        title="Contemplative Reptile"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          Lizard
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                          across all continents except Antarctica
                        </Typography>
                        <Divider className={classes.divider} />
                        <Typography color="textSecondary" component="p">
                          <Schedule className={classes.imageCardRowIcon} fontSize="inherit" />
                          {format(new Date(npc.createdAt), 'yyyy-MM-dd k:mm')}
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

                // <div key={npc.id}><img src={`data:image/png;base64,${npc.blob}`} alt={`${npc.id}`} /></div>
              ))}
            </Grid>
            // <div className={classes.images}>
            //   {npcs.data.map((npc) => (
            //     <div key={npc.id}><img src={`data:image/png;base64,${npc.blob}`} alt={`${npc.id}`} /></div>
            //   ))}
            // </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListImages;
