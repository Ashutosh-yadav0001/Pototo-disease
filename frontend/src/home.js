import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardActionArea, CardMedia, Grid, Button, CircularProgress } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone';
import Clear from '@material-ui/icons/Clear';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '8px',
    },
    '*::-webkit-scrollbar-track': {
      background: 'rgba(255,255,255,0.1)',
    },
    '*::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(180deg, #10b981, #059669)',
      borderRadius: '4px',
    },
  },
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  appbar: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    fontSize: '2.5rem',
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1.5rem',
    background: 'linear-gradient(90deg, #10b981, #34d399)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  tagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.75rem',
    fontWeight: 400,
  },
  mainContainer: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '1rem',
    '& span': {
      background: 'linear-gradient(90deg, #10b981, #34d399)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.6)',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  uploadCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    maxWidth: '500px',
    margin: '0 auto',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
    },
  },
  cardContent: {
    padding: '2rem',
  },
  dropzone: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '2px dashed rgba(16, 185, 129, 0.5)',
    borderRadius: '16px',
    minHeight: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#10b981',
      background: 'rgba(16, 185, 129, 0.1)',
    },
  },
  previewImage: {
    height: 350,
    borderRadius: '16px',
    objectFit: 'cover',
  },
  resultCard: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    background: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
  },
  resultLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  resultValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#10b981',
    marginBottom: '0.5rem',
  },
  confidenceBar: {
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginTop: '1rem',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: '4px',
    background: 'linear-gradient(90deg, #10b981, #34d399)',
    transition: 'width 0.5s ease',
  },
  confidenceText: {
    color: '#fff',
    fontSize: '1rem',
    marginTop: '0.5rem',
    textAlign: 'right',
  },
  clearButton: {
    marginTop: '1.5rem',
    width: '100%',
    padding: '14px 28px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 10px 30px -10px rgba(239, 68, 68, 0.5)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 35px -10px rgba(239, 68, 68, 0.6)',
    },
  },
  loader: {
    color: '#10b981',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
  },
  diseaseIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  healthyResult: {
    background: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    '& $resultValue': {
      color: '#10b981',
    },
  },
  earlyBlightResult: {
    background: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    '& $resultValue': {
      color: '#f59e0b',
    },
  },
  lateBlightResult: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    '& $resultValue': {
      color: '#ef4444',
    },
  },
  featureGrid: {
    marginTop: '3rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  featureItem: {
    textAlign: 'center',
    padding: '1rem',
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  featureText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
  },
  errorCard: {
    marginTop: '1.5rem',
    padding: '1.5rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  errorTitle: {
    color: '#ef4444',
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  errorMessage: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      try {
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL,
          data: formData,
        });
        if (res.status === 200) {
          setData(res.data);
          setError(null);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Failed to analyze image. Please try again.");
        }
        setData(null);
      }
      setIsloading(false);
    }
  }

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  const getResultClass = () => {
    if (!data) return '';
    if (data.class === 'Healthy') return classes.healthyResult;
    if (data.class === 'Early Blight') return classes.earlyBlightResult;
    if (data.class === 'Late Blight') return classes.lateBlightResult;
    return '';
  };

  const getResultIcon = () => {
    if (!data) return '🥔';
    if (data.class === 'Healthy') return '✅';
    if (data.class === 'Early Blight') return '⚠️';
    if (data.class === 'Late Blight') return '🚨';
    return '🥔';
  };

  const getConfidenceColor = () => {
    if (!data) return '#10b981';
    if (data.class === 'Healthy') return '#10b981';
    if (data.class === 'Early Blight') return '#f59e0b';
    if (data.class === 'Late Blight') return '#ef4444';
    return '#10b981';
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logo}>
            <span className={classes.logoIcon}>🌿</span>
            <div>
              <Typography className={classes.logoText}>
                LeafScan AI
              </Typography>
              <Typography className={classes.tagline}>
                Smart Leaf Analysis
              </Typography>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className={classes.mainContainer}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <div className={classes.heroSection}>
              <Typography className={classes.heroTitle}>
                Protect Your <span>Potato Crops</span>
              </Typography>
              <Typography className={classes.heroSubtitle}>
                Upload a photo of your potato plant leaf and our AI will instantly detect Early Blight, Late Blight, or confirm it's healthy.
              </Typography>
            </div>
          </Grid>

          <Grid item style={{ width: '100%', maxWidth: 500 }}>
            <Card className={classes.uploadCard}>
              <CardContent className={classes.cardContent}>
                {!image && (
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={"Drop your potato leaf image here or click to upload"}
                    onChange={onSelectFile}
                    filesLimit={1}
                    showPreviewsInDropzone={false}
                    showAlerts={false}
                    Icon={CloudUploadIcon}
                    dropzoneClass={classes.dropzone}
                  />
                )}

                {image && (
                  <CardActionArea>
                    <CardMedia
                      className={classes.previewImage}
                      image={preview}
                      component="img"
                      title="Uploaded leaf"
                    />
                  </CardActionArea>
                )}

                {isLoading && (
                  <div className={classes.loadingContainer}>
                    <CircularProgress size={50} className={classes.loader} />
                    <Typography className={classes.loadingText}>
                      Analyzing your image...
                    </Typography>
                  </div>
                )}

                {data && (
                  <div className={`${classes.resultCard} ${getResultClass()}`}>
                    <div className={classes.diseaseIcon}>{getResultIcon()}</div>
                    <Typography className={classes.resultLabel}>
                      Disease Detection Result
                    </Typography>
                    <Typography className={classes.resultValue}>
                      {data.class}
                    </Typography>
                    <div className={classes.confidenceBar}>
                      <div
                        className={classes.confidenceFill}
                        style={{
                          width: `${confidence}%`,
                          background: `linear-gradient(90deg, ${getConfidenceColor()}, ${getConfidenceColor()}aa)`
                        }}
                      />
                    </div>
                    <Typography className={classes.confidenceText}>
                      Confidence: {confidence}%
                    </Typography>
                  </div>
                )}

                {error && (
                  <div className={classes.errorCard}>
                    <div className={classes.errorIcon}>🍃</div>
                    <Typography className={classes.errorTitle}>
                      Not a Potato Leaf
                    </Typography>
                    <Typography className={classes.errorMessage}>
                      {error}
                    </Typography>
                  </div>
                )}

                {(data || error) && (
                  <Button
                    variant="contained"
                    className={classes.clearButton}
                    onClick={clearData}
                    startIcon={<Clear />}
                  >
                    Try Another Image
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          {!image && (
            <Grid item>
              <div className={classes.featureGrid}>
                <div className={classes.featureItem}>
                  <div className={classes.featureIcon}>⚡</div>
                  <Typography className={classes.featureText}>Instant Results</Typography>
                </div>
                <div className={classes.featureItem}>
                  <div className={classes.featureIcon}>🎯</div>
                  <Typography className={classes.featureText}>99% Accuracy</Typography>
                </div>
                <div className={classes.featureItem}>
                  <div className={classes.featureIcon}>🔒</div>
                  <Typography className={classes.featureText}>Secure & Private</Typography>
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </Container>
    </div>
  );
};
