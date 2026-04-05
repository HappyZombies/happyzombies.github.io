import { Typography, Link, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";

const StyledContainer = styled(Container)(() => ({
    "& .MuiTypography-root": {
        margin: "1em 0"
    }
}));

function About() {
    return (
        <>
            <Helmet title="Daniel Reguero Blog | About" />
            <Typography variant="h4" align="center" gutterBottom>About</Typography>
            <StyledContainer maxWidth="md">
                <Typography gutterBottom>
                    Hey there, I'm Daniel, a software engineer primarily focused on web development.
                </Typography>
                <Typography gutterBottom>This blog is where I share my knowledge on topics I'm passionate about, as well as document my problem-solving journey.</Typography>
                <Typography gutterBottom>
                    I enjoying developing in Node.js and often use it along with relational databases in my personal projects. I also occasionally dabble in Unity and contribute to open-source projects when I have the chance.
                </Typography>
                <Typography gutterBottom>
                    Follow me on <Link color="secondary" href="https://github.com/HappyZombies" target="_blank" rel="noopener noreferrer">GitHub</Link> where I come up with my latest ideas and projects!
                </Typography>
            </StyledContainer>
        </>
    );
}

export default About;
