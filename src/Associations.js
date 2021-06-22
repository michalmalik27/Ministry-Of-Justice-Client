
import React from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import UIActionState, { actionStates } from "./UIActionState";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Association from "./Association";
import { Link } from "react-router-dom";
import { ASSOCIATION_API_URL, CURRENCY_TYPE_API_URL, ASSOCIATION_TYPE_API_URL } from "./Constants";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 600,
    },
    button: {
        position: "right",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function Associations() {
    const classes = useStyles();

    const [loadState, setLoadState] = useState(actionStates.INIT);
    const [loadStateText, setLoadStateText] = useState(null);

    const [associations, setAssociations] = useState([]);

    const [associationTypes, setAssociationTypes] = useState([]);
    const [loadAssociationTypesState, setLoadAssociationTypesState] = useState(actionStates.INIT);
    const [loadAssociationTypesStateText, setLoadAssociationTypesStateText] = useState(undefined);

    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [loadCurrencyTypesState, setLoadCurrencyTypesState] = useState(actionStates.INIT);
    const [loadCurrencyTypesStateText, setLoadCurrencyTypesStateText] = useState(undefined);

    useEffect(() => {
        setLoadAssociationTypesState(actionStates.IN_PROCESS);
        setLoadAssociationTypesStateText(`טוען רשימת סוגי ישות מדינית...`);
        fetchAssociationTypes();

        setLoadCurrencyTypesState(actionStates.IN_PROCESS);
        setLoadCurrencyTypesStateText(`טוען רשימת סוגי מטבעות...`);
        fetchCurrencyTypes();

        setLoadState(actionStates.IN_PROCESS);
        setLoadStateText("טוען עמותות...");
        fetchAssociations();
    }, []);

    let fetchAssociationTypes = async () => {
        let response = await fetch(ASSOCIATION_TYPE_API_URL);
        let data = await response.json();

        if (response.ok) {
            setAssociationTypes(data);
            setLoadAssociationTypesState(actionStates.IS_COMPLETED);
            setLoadAssociationTypesStateText(null);
        } else {
            setLoadAssociationTypesState(actionStates.IS_FAILED);
            setLoadAssociationTypesStateText(`טעינת סוגי ישות מדינית נכשלה: ${data.message}`);
        }
    };

    let fetchCurrencyTypes = async () => {
        let response = await fetch(CURRENCY_TYPE_API_URL);
        let data = await response.json();

        if (response.ok) {
            setCurrencyTypes(data);
            setLoadCurrencyTypesState(actionStates.IS_COMPLETED);
            setLoadCurrencyTypesStateText(null);
        } else {
            setLoadCurrencyTypesState(actionStates.IS_FAILED);
            setLoadCurrencyTypesStateText(`טעינת סוגי מטבעות נכשלה: ${data.message}`);
        }
    };

    let fetchAssociations = async () => {
        let response = await fetch(ASSOCIATION_API_URL);
        let data = await response.json();

        if (response.ok) {
            setAssociations(data);
            setLoadStateText(null);
            setLoadState(actionStates.IS_COMPLETED);
        } else {
            setLoadState(actionStates.IS_FAILED);
            setLoadStateText(`Loading Failed: ${data.message}`);
        }
    };
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <Link to="new-association">
                <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<AddIcon />}
                >
                    הוספת תרומה
                </Button>
            </Link>
            <h2>רשימת תרומות</h2>
            <UIActionState actionState={loadState} actionText={loadStateText}>
                <>
                    {associations.map(a => (
                        <Accordion expanded={expanded === `panel_${a.associationId}`} onChange={handleChange(`panel_${a.associationId}`)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography className={classes.heading}>{a.name}</Typography>
                                <Typography className={classes.secondaryHeading}>{a.donationAmount}₪</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Association mode="update" associationTypes={associationTypes} currencyTypes={currencyTypes} association={a} />
                            </AccordionDetails>
                        </Accordion>
                    ))}

                </>
            </UIActionState>
        </>
    );
}
