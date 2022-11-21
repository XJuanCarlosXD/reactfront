import React from 'react';
import Player, { Track, PlayerInterface } from 'react-material-music-player';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

const Music = props => {
    const theme = createTheme({
        palette: {
            primary: {
                main: purple[500],
            },
            secondary: {
                main: green[500],
            },
            background: {
                paper: "#0A1929",
            },
            action: {
                active: "#fff",
                hover: "rgba(255, 255, 255, 0.08)",
                hoverOpacity: 0.08,
                selected: "rgba(255, 255, 255, 0.16)",
                selectedOpacity: 0.16,
            },
            text: {
                disabled: "rgba(255, 255, 255, 0.5)",
                icon: "rgba(255, 255, 255, 0.5)",
                primary: "#fff",
                secondary: "#AAB4BE",
            },
        },
        components: {

            // component name
            MuiSlider: {
                styleOverrides: {
                    // slot to target
                    thumb: {
                        width: 8,
                        height: 8,
                        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                        "&:before": {
                            boxShadow: "0 2px 1px 0 rgba(0,0,0,0.4)",
                        },
                        ":hover, &.Mui-focusVisible": {
                            height: 15,
                            width: 15,
                            boxShadow: "0px 0px 0px 8px rgb(0 0 0 / 16%)",
                        },
                        "&.Mui-active": {
                            width: 20,
                            height: 20,
                        },
                    },
                },
            },

            MuiToggleButton: {
                // set default props
                defaultProps: {
                    color: "primary",
                },
            },
        }
    });

    React.useEffect(() => {
        document.querySelector('.left-side').style.display = 'none';
        fetch('https://storage.googleapis.com/uamp/catalog.json')
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => console.log(data));
    }, []);
    const TEST_MEDIA =
        "https://raw.githubusercontent.com/the-maazu/react-material-music-player/master/sample_media/";

    // update playlist with test data and start play
    PlayerInterface.play([
        new Track(
            "1",
            TEST_MEDIA + "bach.jpg",
            "68 Choral",
            "Bach",
            TEST_MEDIA + "Bach%20--%20BWV%20245%20--%2068%20Choral.mp3"
        ),
    ]);

    // wait 3 seconds
    window.setTimeout(
        () =>
            // adds music at end of playlist
            PlayerInterface.playLater([
                new Track(
                    "2",
                    TEST_MEDIA + "emerson.jpeg",
                    "All through the night",
                    "Emerson",
                    TEST_MEDIA +
                    "Emerson%20--%20All%20through%20the%20Night%20(Ar%20Hyd%20y%20Nos).mp3"
                ),
            ]),
        3000 // 3 seconds
    );

    // wait 6 seconds
    window.setTimeout(
        () =>
            // add music after current track
            PlayerInterface.playNext([
                new Track(
                    "3",
                    TEST_MEDIA + "guido.jpg",
                    "Ut queant laxis",
                    "Guido von Arezzo",
                    TEST_MEDIA + "Guido%20von%20Arezzo%20--%20Ut%20queant%20laxis.mp3"
                ),
            ]),
        6000 // 6 seconds
    );

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Player sx={{ width: "93vw", position: "fixed", bottom: 0 }} disableDrawer={true | false} />
            </ThemeProvider >
        </div>
    );
};

export default Music;