import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import { PreviewNoteDto } from '../../shared/dtos/entities.dto';

import apiService from '../../shared/services/api.service';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#262626',
    boxShadow: 'inset 0 0 100px black',
  },
  cardContainer: {
    backgroundColor: '#1f1714',
    border: '1px solid #1c0d08',
    width: '500px',
    borderRadius: '12px',
    boxSizing: 'border-box',
    boxShadow: '0 0 0 1px #2e2623, 0 0 0 3px #1f1714, -8px 9px 16px -3px black',
  },
  cardFrame: {
    zIndex: 1,
    padding: '0 10px 30px',
    position: 'relative',
    height: '108%',
    top: '0.5%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  frameArt: {
    boxShadow: `inset 0 0 0 1px #3a3532, 0 2px 3px 4px #171314, 0px 0px 0px 15px #2b201e,
      0px 0px 0px 16px #3a3532, 0px 2px 0px 17px #4b220e, 0 0 8px 24px #171314`,
    marginBottom: '7px',
    borderRadius: '3px',
    width: '410px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  image: {
    borderRadius: '3px',
    width: '100%',
  },
  frameName: {
    boxShadow: '0 0 0 2px #171314, 0px 0px 5px 5px #171314',
    overflow: 'hidden',
    background: 'linear-gradient(90deg, rgba(43,26,18,1) 0%, rgba(69,45,33,1) 50%, rgba(43,26,18,1) 100%)',
    marginTop: '10px',
    marginRight: '5px',
    marginBottom: '24px',
    marginLeft: '-20px',
    padding: '24px 0',
    width: '516px',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '3px',
    alignSelf: 'baseline',
    fontSize: '24px',
    fontWeight: 600,
    color: '#D9B9A2',
    textShadow: '0px 3px 5px rgba(0, 0, 0, 1)',
  },
  frameTextBox: {
    boxShadow: '0 1px 2px 1px #2e2422, inset 0 0 8px 12px #171314',
    overflow: 'hidden',
    margin: '0 10px',
    color: '#D9B9A2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 6px',
    boxSizing: 'border-box',
    fontSize: '1.2em',
    width: '410px',
  },
}));

type PreviewParams = {
  hash: string;
};

const Preview: React.FunctionComponent<{}> = () => {
  const { hash } = useParams<PreviewParams>();
  const classes = useStyles();
  const [notePreview, setNotePreview] = useState<PreviewNoteDto | null>(null);

  const fetchNotes = useCallback(() => {
    apiService.getPreview(hash).then((preview) => {
      setNotePreview(preview);
    });
  }, [hash]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <>
      {!notePreview && 'Loading...'}
      {notePreview && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" className={classes.root}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" m={1}>
            <div className={classes.cardContainer}>
              <div className={classes.cardFrame}>
                <div className={classes.frameArt}>
                  <img className={classes.image} src={`data:image/png;base64,${notePreview.blob}`} alt="preview" />
                </div>
                <div className={classes.frameName}>{ notePreview.name }</div>
                <div className={classes.frameTextBox}>{ notePreview.description }</div>
              </div>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Preview;
