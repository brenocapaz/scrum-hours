import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Paper, Container, Card, CardHeader, Typography, CardContent, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Divider, TextField, Theme, InputAdornment } from '@material-ui/core';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import ArrowForwardSharpIcon from '@material-ui/icons/ArrowForwardSharp';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';
import moment from 'moment';

const useStyles = makeStyles((theme: Theme) => ({
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
    },
    dayForeward: {
        color: theme.palette.primary.dark,
    },
    dayBack: {
        color: theme.palette.secondary.dark,
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
        capacity: 60,
        toDo: {
            morning: 0,
            evening: 0,
        },
        actual: {
            morning: 0,
            evening: 0,
        },
        vacationDates: [''],
        stories: []

    });
    const [vacation, setVacation] = useState('');
    const [todayDate, setTodayDate] = useState(moment());
    const [story, setStory] = useState({ name: '', points: 1 });
    const [editCapacity, setEditCapacity] = useState(false);
    const [newCapacity, setNewCapacity] = useState(state.capacity);
    const knownSprint = { startDate: moment("04/01/2020", "MM/DD/YYYY"), endDate: moment("04/14/2020", "MM/DD/YYYY"), sprintNumber: 7 };

    useEffect(() => calculatePage(), [todayDate]);


    const calculatePage = () => {
        const vacationsString = localStorage.getItem('vacations');
        let savedCapacity = localStorage.getItem('capacity');
        if (!savedCapacity) {
            savedCapacity = "60";
        }
        setNewCapacity(parseInt(savedCapacity));
        let vacations = []
        if (vacationsString) {
            vacations = JSON.parse(vacationsString);
        }
        const storiesString = localStorage.getItem('stories');
        let stories: any = []
        if (storiesString) {
            stories = JSON.parse(storiesString);
        }
        const sprintLength = knownSprint.endDate.diff(knownSprint.startDate, 'days') + 1;
        const daysFromLastKnownSprintEnd = todayDate.diff(knownSprint.endDate, 'days');
        let numberOfSprints = Math.floor(daysFromLastKnownSprintEnd / sprintLength);

        let currentSprintNumber = knownSprint.sprintNumber + numberOfSprints;
        if ((numberOfSprints * sprintLength) < daysFromLastKnownSprintEnd) {
            currentSprintNumber++;
            numberOfSprints++;
        }

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
            if (day.isSameOrBefore(todayDate)) {
                daysSpent++;
            } else {
                daysRemaining++;
            }

        }
        const hoursPerDay = parseInt(savedCapacity) / totalSprintDays;
        const toDoThisEvening = Math.round(daysRemaining * hoursPerDay);
        const toDoThisMorning = Math.round(toDoThisEvening + hoursPerDay);
        const actualsThisEvening = Math.round(daysSpent * hoursPerDay);
        const actualsThisMorning = Math.round(actualsThisEvening - hoursPerDay);

        setState({
            ...state, sprintNumber: currentSprintNumber,
            sprintStartDate,
            sprintEndDate,
            sprintLength,
            hoursPerDay,
            capacity: parseInt(savedCapacity),
            sprintLengthBusiness: totalSprintDays,
            sprintDay: daysSpent,
            remainingDays: daysRemaining,
            vacationDates: vacations,
            stories,

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
        if (vacation) {
            vacations.push(vacation);
            localStorage.setItem('vacations', JSON.stringify(vacations));
            setState({ ...state, vacationDates: vacations });
            calculatePage();
        }
    }

    const handleRemoveStory = (name: string) => {
        let stories = [...state.stories];
        stories = stories.filter((x: any) => x.name !== name);
        localStorage.setItem('stories', JSON.stringify(stories));
        setState({ ...state, stories });
    };

    const handleAddStory = () => {
        const stories: any = [...state.stories];
        if (story) {
            stories.push(story);
            localStorage.setItem('stories', JSON.stringify(stories));
            setState({ ...state, stories });
            setStory({ name: '', points: 1 });
        }
    }

    const handleBackOneDay = () => {
        setTodayDate((s: any) => {
            return moment(s).add(-1, 'days');
        });
    };


    const handleForewardOneDay = () => {
        setTodayDate((s) => {
            return moment(s).add(1, 'days');
        });
    };

    const handleStartEdit = () => {
        setEditCapacity(true);
    }

    const handleOnCapacityChange = (e: any) => {
        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
        setNewCapacity(e.target.value);
    }
    const handleCommitEdit = () => {
        setState(p => ({ ...p, capacity: newCapacity }));
        setEditCapacity(false);
        localStorage.setItem('capacity',newCapacity.toString() );
        calculatePage();

    }

    return (
        <Container className={classes.mainContainer}>
            <Paper elevation={5} className={classes.mainPaper}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        color="secondary"
                        onClick={handleBackOneDay}
                        startIcon={<ArrowBackSharpIcon />}
                    >
                        -1
      </Button>
                    {
                        moment().isSame(todayDate, 'day') &&
                        <Typography variant="h5" >
                            {`Today is: ${todayDate.format('dddd MMMM Do YYYY')}`}
                        </Typography>
                    }

                    {
                        moment().isBefore(todayDate, 'day') &&
                        <Typography variant="h5" className={classes.dayForeward}>
                            {`If today is: ${todayDate.format('dddd MMMM Do YYYY')}`}
                        </Typography>
                    }

                    {
                        moment().isAfter(todayDate, 'day') &&
                        <Typography variant="h5" className={classes.dayBack}>
                            {`If today is: ${todayDate.format('dddd MMMM Do YYYY')}`}
                        </Typography>
                    }

                    <Button
                        color="primary"
                        onClick={handleForewardOneDay}
                        endIcon={<ArrowForwardSharpIcon />}
                    >
                        +1
      </Button>
                </header>
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
                                <TextField label="Capacity" disabled={!editCapacity} style={{width: '150px'}}
                                    variant="standard"
                                    autoFocus
                                    size="small"
                                    type="number"
                                    onChange={handleOnCapacityChange}
                                    value={newCapacity}
                                    InputProps={{
                                        disableUnderline: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {!editCapacity &&

                                                    <Button size="small" onClick={handleStartEdit}>
                                                        <CreateOutlinedIcon />
                                                    </Button>
                                                }
                                                {editCapacity &&
                                                    <Button size="small" onClick={handleCommitEdit}>
                                                        <DoneOutlinedIcon />
                                                    </Button>
                                                }
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>

                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
                <Grid container justify="space-between" style={{ marginTop: '32px' }}>
                    <Grid xs={3}>
                        <Card>
                            <CardContent>


                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Points
            </TableCell>
                                                <TableCell>
                                                    Hours
            </TableCell>
                                                <TableCell>
                                                    ~Days
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
                                                <TableCell>
                                                    1
                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    2
                </TableCell>
                                                <TableCell>
                                                    8-20
                </TableCell>
                                                <TableCell>
                                                    3
                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    3
                </TableCell>
                                                <TableCell>
                                                    18-35
                </TableCell>
                                                <TableCell>
                                                    6
                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    5
                </TableCell>
                                                <TableCell>
                                                    30-55
                </TableCell>
                                                <TableCell>
                                                    9
                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    8
                </TableCell>
                                                <TableCell>
                                                    50-85
                </TableCell>
                                                <TableCell>
                                                    14(1.5S)
                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    13
                </TableCell>
                                                <TableCell>
                                                    > 85
                </TableCell>
                                                <TableCell>
                                                    >1.5S
                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid xs={5}>
                        <Card>
                            <CardContent>

                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField style={{ width: '90%' }}
                                        label="Story"
                                        type="text"
                                        value={story.name}
                                        onChange={(e) => setStory({ ...story, name: e.target.value })}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                    <TextField
                                        label="Points"
                                        type="number"
                                        value={story.points}
                                        onChange={(e) => setStory({ ...story, points: parseInt(e.target.value) })}
                                        defaultValue={1}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                    <Button color="secondary" onClick={handleAddStory}>Add</Button>
                                </div>
                                <Grid>
                                    {state.stories.map((s: any) => {
                                        return (
                                            <React.Fragment>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                                    <div>{`${s.points}   ${s.name}`}</div>
                                                    <Button onClick={() => handleRemoveStory(s.name)}>X</Button>
                                                </div>
                                                <Divider></Divider>
                                            </React.Fragment>
                                        )
                                    })}

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container >
    )

}

export default ScrumHours;