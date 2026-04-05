import { Container, Grid, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link as LinkRouter } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import routes from "../routes";

const RouteLinkList = ({ route }) => {
    const { name, path, newTab } = route;
    const extraProps = {};
    if(newTab) {
        extraProps.target="_blank";
        extraProps.rel="noopener noreferrer"
    }
    return (
        <ListItem sx={{paddingTop: 0, paddingBottom: 0}}>
            <ListItemText
                primaryTypographyProps={{ variant: 'h6', style: { fontWeight: 'normal' } }}
                primary={
                    <Link component={LinkRouter} to={`${path}`} color="secondary" underline="always" {...extraProps}>
                        {name}
                    </Link>
                }
            />
        </ListItem>
    )
}

const Home = () => {
    return (
        <Container>
            <Helmet title='Daniel Reguero Blog' />
            <Grid sx={{minHeight: "100vh"}} container spacing={0} alignItems="center" justifyItems="center">
                <Grid item xs={12}>
                    <Typography variant="h3" align="center" gutterBottom>Daniel Reguero</Typography>
                    <Typography variant="h6" align="center" gutterBottom>&gt; I just wanna make stuff</Typography>
                    <Typography variant="body1" align="center" gutterBottom><i>Isaiah 40:31</i></Typography>
                    <List sx={{display: "table", margin: "0 auto"}}>
                        {routes.map((route, i) => <RouteLinkList route={route} key={i} />)}
                    </List>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home;