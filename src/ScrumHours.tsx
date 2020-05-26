import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Paper, Container, Card, CardHeader, Typography, CardContent, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Divider, TextField } from '@material-ui/core';
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
        sprintLengthBusiness: 0,
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
        vacationDates: ['']

    });
    const [vacation, setVacation] = useState('');
    const knownSprint = { startDate: moment("04/01/2020", "MM/DD/YYYY"), endDate: moment("04/14/2020", "MM/DD/YYYY"), sprintNumber: 7 };

    useEffect(() => calculatePage(), []);

    const calculatePage = () => {
        const vacationsString = localStorage.getItem('vacations');
        let vacations = []
        if (vacationsString) {
            vacations = JSON.parse(vacationsString);
        }
        const sprintLength = knownSprint.endDate.diff(knownSprint.startDate, 'days') + 1;
        const daysFromLastKnownSprintEnd = moment().diff(knownSprint.endDate, 'days');
        const numberOfSprints = Math.floor(daysFromLastKnownSprintEnd / sprintLength);

        const currentSprintNumber = knownSprint.sprintNumber + numberOfSprints;


        const sprintStartDate = knownSprint.startDate.add((sprintLength) * (numberOfSprints), 'days');
        const sprintEndDate = moment(sprintStartDate).add(sprintLength - 1, 'days');
        let daysSpent = 0;
        let totalSprintDays = 0;
        let daysRemaining = 0;

        for (let day = moment(sprintStartDate); day.isSameOrBefore(sprintEndDate); day = moment(day).add(1, 'days')) {
            const isVacationDay = vacations.filter((x: string) => moment(x).isSame(day));
            if (isVacationDay.length || day.isoWeekday() === 6 || day.isoWeekday() === 7) {
                continue;
            };

            //End of day numbers
            totalSprintDays++;
            if (day.isSameOrBefore(moment())) {
                daysSpent++;
            } else {
                daysRemaining++;
            }

        }
        const toDoThisEvening = daysRemaining * state.hoursPerDay;
        const toDoThisMorning = toDoThisEvening + state.hoursPerDay;
        const actualsThisEvening = daysSpent * state.hoursPerDay;
        const actualsThisMorning = actualsThisEvening - state.hoursPerDay;

        setState({
            ...state, sprintNumber: currentSprintNumber,
            sprintStartDate,
            sprintEndDate,
            sprintLength,
            sprintLengthBusiness: totalSprintDays,
            sprintDay: daysSpent,
            remainingDays: daysRemaining,
            vacationDates: vacations,
            actual: { morning: actualsThisMorning, evening: actualsThisEvening }, toDo: { morning: toDoThisMorning, evening: toDoThisEvening }
        });

    }

    const handleRemoveVacation = (day: string) => {
        let vacations = [...state.vacationDates];
        vacations = vacations.filter(x => !moment(x).isSame(moment(day)));
        localStorage.setItem('vacations', JSON.stringify(vacations));
        setState({ ...state, vacationDates: vacations });
        calculatePage();
    };

    const handleAddVacation = () => {
        const vacations: string[] = [...state.vacationDates];
        if (vacation){
            vacations.push(vacation);
            localStorage.setItem('vacations', JSON.stringify(vacations));
            setState({ ...state, vacationDates: vacations });
            calculatePage();
        }
    }

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
                                title={`Sprint ${state.sprintNumber}, ${state.sprintStartDate.format('dddd MMMM Do YYYY')}-${state.sprintEndDate.format('dddd MMMM Do YYYY')} [${state.sprintLengthBusiness} Business days]`}
                                subheader={`Day: ${state.sprintDay}, Remaining: ${state.remainingDays}`}
                            >
                            </CardHeader>
                            <CardContent>
                                <Grid container xs={12} justify="space-between">
                                    <Grid item xs={2}>
                                        <div>Morning</div>
                                        <Brightness5Icon />
                                        <div>{`To do ${state.toDo.morning} hrs`}</div>
                                        <div>{`Actual ${state.actual.morning} hrs`}</div>
                                    </Grid>
                                    <Grid item xs={2} >
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
                <Grid container justify="space-between" style={{ marginTop: '32px' }}>
                    <Grid xs={3}>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            StoryPoints
            </TableCell>
                                        <TableCell>
                                            Hours Range
            </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            1
                </TableCell>
                                        <TableCell>
                                            0-8
                </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            2
                </TableCell>
                                        <TableCell>
                                            8-20
                </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            3
                </TableCell>
                                        <TableCell>
                                            18-35
                </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            5
                </TableCell>
                                        <TableCell>
                                            30-55
                </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            8
                </TableCell>
                                        <TableCell>
                                            50-85
                </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            13
                </TableCell>
                                        <TableCell>
                                            > 85
                </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid xs={3}>
                        <Grid>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextField
                                    label="Vacations"
                                    type="date"
                                    value={vacation}
                                    onChange={(e) => setVacation(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <Button color="secondary" onClick={handleAddVacation}>Add</Button>

                            </div>
                        </Grid>
                        <Grid>
                            {state.vacationDates.map(v => {
                                return (
                                    <React.Fragment>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                            <div>{moment(v).format('ddd DD MMM YYYY')}</div>
                                            <Button onClick={() => {
                                                return handleRemoveVacation(v);
                                            }}>X</Button>
                                        </div>
                                        <Divider></Divider>
                                    </React.Fragment>
                                )
                            })}

                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )

}

export default ScrumHours;