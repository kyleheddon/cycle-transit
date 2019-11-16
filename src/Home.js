import React, { Component } from 'react';
import BikeTransit from './BikeTransit';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';

function Home() {
    return (
        <div>
            <CssBaseline />
            <AppBar color="default">
                <Typography variant="h3" component="h1">
                    <Link href="/" color="inherit">
                        Atl Bike + Transit
                    </Link>
                </Typography>
            </AppBar>
            <Container
                style={{
                    paddingTop: 70,
                }}
            >
                <BikeTransit />
            </Container>
        </div>
    );
}

export default Home;
