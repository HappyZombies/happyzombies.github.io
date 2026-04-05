import { AppBar, Link, Toolbar, Typography, Container } from "@mui/material"
import { Outlet } from "react-router-dom";
import { Link as LinkRouter } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledTypography = styled(Typography)(() => ({
    padding: "6px 10px",
    textTransform: "lowercase",
    fontSize: "1.1rem"
}));

const Nav = () => {
    return (
        <Container maxWidth="md">
            <AppBar color="transparent" position="static" elevation={0} sx={{ paddingBottom: "0.5rem" }}>
                <Toolbar sx={{ padding: "0!important", justifyContent: "flex-end" }}>
                    <StyledTypography>
                        <Link component={LinkRouter} to="/" color="secondary" underline="always">
                            /home
                        </Link>
                    </StyledTypography>
                    <StyledTypography>
                        <Link component={LinkRouter} to="/blogs" color="secondary" underline="always">
                            /blogs
                        </Link>
                    </StyledTypography>
                    <StyledTypography>
                        <Link component={LinkRouter} to="/projects" color="secondary" underline="always">
                            /projects
                        </Link>
                    </StyledTypography>
                    <StyledTypography sx={{ paddingRight: 0 }}>
                        <Link component={LinkRouter} to="https://github.com/HappyZombies" color="secondary" underline="always" target="_blank" rel="noopener noreferrer">
                            /github
                        </Link>
                    </StyledTypography>
                </Toolbar>
            </AppBar>
            <Container sx={{ paddingBottom: "2em" }}>
                <Outlet />
            </Container>
        </Container>
    )
}

export default Nav;
