import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from './parts/Button';
import Typography from './parts/Typography';
import ProductLayout from './ProductLayout';

const backgroundImage =
    'https://firebasestorage.googleapis.com/v0/b/learn-firebase-masalib.appspot.com/o/images%2Fsite%2Fs-DSC00571.jpg?alt=media';

const styles = (theme) => ({
    background: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
    },
    button: {
        minWidth: 200,
    },
    h5: {
        marginBottom: theme.spacing(4),
        marginTop: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(10),
        },
    },
    more: {
        marginTop: theme.spacing(2),
    },
});

function Product(props) {
const { classes } = props;

    return (
        <ProductLayout backgroundClassName={classes.background}>
            {/* Increase the network loading priority of the background image. */}
            <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" />
            <Typography color="inherit" align="center" variant="h2" marked="center">
                Firebaseの勉強用のサイトです。
            </Typography>
            <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
                無料なのでよかったら試していってください
            </Typography>
            <Button
                color="secondary"
                variant="contained"
                size="large"
                className={classes.button}
                component="a"
                href="/signup"
            >
                Register
            </Button>
            <Typography variant="body2" color="inherit" className={classes.more}>
                経験を発見してください
            </Typography>
        </ProductLayout>
    );
}

Product.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Product);