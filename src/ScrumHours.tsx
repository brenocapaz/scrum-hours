import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Paper, Container, Card, CardHeader, Typography, CardContent, Grid } from '@material-ui/core';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        width: '100%',
        height: '95vh',
        margin: '0.5rem auto',
    },
    mainPaper: {
        width: '90%',
        height: '90%',
        margin: '0.5rem auto',
        padding: '1rem',
    },
    mainCard: {
        width: '90%',
        height: '90%',
        margin: '1rem auto',
    },
    gridContainer: {
        marginTop: '15px',
    },
    eveningContainer: {
        backgroundColor: 'silver',
    }

}));

const ScrumHours: React.FC = () => {


    const classes = useStyles();
    const [state, setState] = useState({
        sprintNumber: 0,
        sprintStartDate: moment(),
        sprintEndDate: moment(),
        sprintLength: 0,
        sprintDay: 0,
        remainingDays: 0,
        hoursPerDay: 6,
        toDo: {
            morning: 0,
            evening: 0,
        },
        actual: {
            morning: 0,
            evening: 0,
        },
        vacationDates: [

        ]

    });
    const knownSprint = { startDate: moment("04/01/2020", "MM/DD/YYYY"), endDate: moment("04/14/2020", "MM/DD/YYYY"), sprintNumber: 7 };

    useEffect(() => {
        const sprintLength = knownSprint.endDate.diff(knownSprint.startDate, 'days');
        const daysFromLastKnownSprintEnd = moment().diff(knownSprint.endDate, 'days');
        const numberOfSprints = Math.floor(daysFromLastKnownSprintEnd / sprintLength);

        const currentSprintNumber = knownSprint.sprintNumber + numberOfSprints + 1;


        const sprintStartDate = knownSprint.startDate.add((sprintLength + 1) * (numberOfSprints + 1), 'days');
        const sprintEndDate = moment(sprintStartDate).add(sprintLength, 'days');
        let currentDay = moment(sprintStartDate);
        let sprintDay = 0;
        while (currentDay.isBefore(moment())) {
            // do not count weekend
            if (currentDay.isoWeekday() !== 6 && currentDay.isoWeekday() !== 7) {
                sprintDay++;
            }
            currentDay = currentDay.add(1, 'days');
        }
        let remainingDays = 1;
        while (currentDay.isBefore(sprintEndDate)) {
            // do not count weekend
            if (currentDay.isoWeekday() !== 6 && currentDay.isoWeekday() !== 7) {
                remainingDays++;
            }
            currentDay = currentDay.add(1, 'days');
        }

        const toDoThisEvening = remainingDays * state.hoursPerDay;
        const toDoThisMorning = toDoThisEvening + state.hoursPerDay;
        const actualsThisEvening = sprintDay * state.hoursPerDay;
        const actualsThisMorning = actualsThisEvening - state.hoursPerDay;

        setState({
            ...state, sprintNumber: currentSprintNumber,
            sprintStartDate,
            sprintEndDate,
            sprintLength,
            sprintDay,
            remainingDays,
            actual: { morning: actualsThisMorning, evening: actualsThisEvening }, toDo: { morning: toDoThisMorning, evening: toDoThisEvening }
        });

    }, [state, knownSprint]);


    return (
        <Container className={classes.mainContainer}>
            <Paper elevation={5} className={classes.mainPaper}>
                <Typography variant="h5">
                    {`Today is: ${moment().format('dddd MMMM Do YYYY')}`}
                </Typography>
                <Grid container spacing={3} className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <Card raised>
                            <CardHeader
                                title={`Sprint ${state.sprintNumber}, ${state.sprintStartDate.format('dddd MMMM Do YYYY')}-${state.sprintEndDate.format('dddd MMMM Do YYYY')}`}
                                subheader={`Day: ${state.sprintDay}, Remaining: ${state.remainingDays}`}
                            >
                            </CardHeader>
                            <CardContent>
                                <Grid container xs={12}>
                                    <Grid item xs={6}>
                                        <div>Morning</div>
                                        <Brightness5Icon />
                                        <div>{`To do ${state.toDo.morning} hrs`}</div>
                                        <div>{`Actual ${state.actual.morning} hrs`}</div>
                                    </Grid>
                                    <Grid item xs={6} >
                                        <div className={classes.eveningContainer}>Evening</div>
                                        <Brightness3Icon />
                                        <div>{`To do ${state.toDo.evening} hrs`}</div>
                                        <div>{`Actual ${state.actual.evening} hrs`}</div>
                                    </Grid>
                                </Grid>

                                <div>
                                    {`Capacity: ${(state.sprintDay + state.remainingDays) * 6}`}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.gridContainer}>
                    <Grid item xs={6}>
                        <Card  >
                            <CardHeader
                                title={`with a coming dayoff`}
                                subheader={`Day: ${state.sprintDay}, Remaining: ${state.remainingDays - 1}`}
                            >
                            </CardHeader>
                            <CardContent>
                                <Grid container xs={12}>
                                    <Grid item xs={6}>
                                        <div>Morning</div>
                                        <Brightness5Icon />
                                        <div>{`To do ${state.toDo.morning - state.hoursPerDay} hrs`}</div>
                                        <div>{`Actual ${state.actual.morning} hrs`}</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div className={classes.eveningContainer}>Evening</div>
                                        <Brightness3Icon />
                                        <div>{`To do ${state.toDo.evening - state.hoursPerDay} hrs`}</div>
                                        <div>{`Actual ${state.actual.evening} hrs`}</div>
                                    </Grid>
                                </Grid>

                                <div>
                                    {`Capacity: ${(state.sprintDay + state.remainingDays - 1) * 6}`}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6}>
                        <Card  >
                            <CardHeader
                                title={`with a lost dayoff`}
                                subheader={`Day: ${state.sprintDay - 1}, Remaining: ${state.remainingDays}`}
                            >
                            </CardHeader>
                            <CardContent>
                                <Grid container xs={12}>
                                    <Grid item xs={6}>
                                        <div>Morning</div>
                                        <Brightness5Icon />
                                        <div>{`To do ${state.toDo.morning} hrs`}</div>
                                        <div>{`Actual ${state.actual.morning - state.hoursPerDay} hrs`}</div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div className={classes.eveningContainer}>Evening</div>
                                        <Brightness3Icon />
                                        <div>{`To do ${state.toDo.evening} hrs`}</div>
                                        <div>{`Actual ${state.actual.evening - state.hoursPerDay} hrs`}</div>
                                    </Grid>
                                </Grid>

                                <div>
                                    {`Capacity: ${(state.sprintDay + state.remainingDays - 1) * 6}`}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

        </Container>
    )

}

export default ScrumHours;