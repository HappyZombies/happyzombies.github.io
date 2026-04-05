import { Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

function NotFound() {
    return (
        <>
            <Helmet title="Daniel Reguero Blog | Not Found" />
            <Typography variant="h4" align="center" gutterBottom>404 Not Found</Typography>
        </>
    );
}

export default NotFound;
