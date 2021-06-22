
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ListIcon from "@material-ui/icons/List";
import Container from "@material-ui/core/Container";

import { CURRENCY_TYPE_API_URL, ASSOCIATION_TYPE_API_URL } from "./Constants";

import Association from "./Association";
import UIActionState, { actionStates } from "./UIActionState";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(4),
    },
}));

export default function NewAssociation() {
    const classes = useStyles();

    const [associationTypes, setAssociationTypes] = useState([]);
    const [loadAssociationTypesState, setLoadAssociationTypesState] = useState(actionStates.INIT);
    const [loadAssociationTypesStateText, setLoadAssociationTypesStateText] = useState(undefined);

    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [loadCurrencyTypesState, setLoadCurrencyTypesState] = useState(actionStates.INIT);
    const [loadCurrencyTypesStateText, setLoadCurrencyTypesStateText] = useState(undefined);

    useEffect(() => {
        setLoadAssociationTypesState(actionStates.IN_PROCESS);
        setLoadAssociationTypesStateText(`טוען רשימת סוגי ישות מדינית...`);

        setLoadCurrencyTypesState(actionStates.IN_PROCESS);
        setLoadCurrencyTypesStateText(`טוען רשימת סוגי מטבעות...`);

        fetchAssociationTypes();
        fetchCurrencyTypes();
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

    let allDataLoaded = () =>
        loadCurrencyTypesState == actionStates.IS_COMPLETED &&
        loadAssociationTypesState == actionStates.IS_COMPLETED;

    return (
        <>
            <Link to="associations">
                <Button
                    disableElevation
                    variant="contained"
                    color="primary"
                    startIcon={<ListIcon />}
                >
                    כל העמותות
                </Button>
            </Link>
            <Container className={classes.root}>
                <UIActionState
                    actionState={loadAssociationTypesState}
                    actionText={loadAssociationTypesStateText}
                />
                <UIActionState
                    actionState={loadCurrencyTypesState}
                    actionText={loadCurrencyTypesStateText}
                />
                {allDataLoaded() && <Association mode="add" associationTypes={associationTypes} currencyTypes={currencyTypes} />}
            </Container>
        </>
    );
}