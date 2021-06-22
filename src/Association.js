import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import UIActionState, { actionStates } from "./UIActionState";
import { ASSOCIATION_API_URL } from "./Constants";
import { TextInput, SelectInput } from "./Inputs";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    width: "100%",
  },
}));

const rules = {
  name: {
    pattern: {
      value: /^[\u0590-\u05fea-zA-Z-\s]+$/i,
      message: "אותיות עבריות או אנגליות בלבד או '-' או רווח",
    },
    maxLength: { value: 20, message: "מקסימום 20 תווים" },
    required: "שדה חובה",
  },
  associationTypeId: {
    required: "שדה חובה",
  },
  donationAmount: {
    pattern: { value: /^(\d*\.)?\d+$/i, message: "מספר עשרוני" },
    required: "שדה חובה",
  },
  donationPurpose: {
    pattern: {
      value: /^[\u0590-\u05fea-zA-Z-\s]+$/i,
      message: "אותיות עבריות או אנגליות בלבד או '-' או רווח",
    },
    maxLength: { value: 40, message: "מקסימום 40 תווים" },
    required: "שדה חובה",
  },
  donationTerms: {
    pattern: {
      value: /^[\u0590-\u05fea-zA-Z-\s]+$/i,
      message: "אותיות עבריות או אנגליות בלבד או '-' או רווח",
    },
    maxLength: { value: 40, message: "מקסימום 40 תווים" },
    required: "שדה חובה",
  },
  currencyTypeId: {
    required: "שדה חובה",
  },
  conversionRate: {
    pattern: { value: /^(\d*\.)?\d+$/i, message: "מספר עשרוני" },
    required: "שדה חובה",
  }
};

const Association = ({ mode, associationTypes, currencyTypes, association }) => {
  const classes = useStyles();

  const [saveState, setSaveState] = useState(actionStates.INIT);
  const [saveStateText, setSaveStateText] = useState(undefined);

  const { handleSubmit, control } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (_association) => {
    try {
      setSaveState(actionStates.IN_PROCESS);
      setSaveStateText("שומר את הנתונים שלך...");
      let response = await fetch(ASSOCIATION_API_URL, {
        method: mode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mode === "add" ? _association : { associationId: association.associationId, ..._association }),
      });
      let data = await response.json();
      console.log(data);

      if (response.ok) {
        setSaveState(actionStates.IS_COMPLETED);
        setSaveStateText(undefined);
      } else {
        setSaveState(actionStates.IS_FAILED);
        setSaveStateText(
          `השמירה נכשלה: ${data.message || "Model Is Not Valid"}`
        );
      }
    } catch (e) {
      setSaveState(actionStates.IS_FAILED);
      setSaveStateText(`אירעה שגיאה`);
    }
  };

  return (
    <Container component="main">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextInput
                name="name"
                label="שם הישות המדינית הזרה"
                control={control}
                rules={rules.name}
                defaultValue={association?.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                name="donationAmount"
                label='סכום התרומה בש"ח'
                control={control}
                rules={rules.donationAmount}
                defaultValue={association?.donationAmount}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SelectInput
                name="associationTypeId"
                label="סוג הישות המדינית הזרה"
                control={control}
                list={associationTypes}
                extractId={(item) => item.associationTypeId}
                extractValue={(item) => item.associationTypeName}
                rules={rules.associationTypeId}
                defaultValue={association?.associationTypeId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                name="donationPurpose"
                label="ייעוד התרומה"
                control={control}
                rules={rules.donationPurpose}
                defaultValue={association?.donationPurpose}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                name="donationRoles"
                label="התנאים לתרומה"
                control={control}
                rules={rules.donationRoles}
                defaultValue={association?.donationRoles}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SelectInput
                name="currencyTypeId"
                label="סוג מטבע"
                control={control}
                list={currencyTypes}
                extractId={(item) => item.currencyTypeId}
                extractValue={(item) => item.currencyTypeName}
                rules={rules.currencyTypeId}
                defaultValue={association?.currencyTypeId}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextInput
                name="conversionRate"
                label="שער ההמרה"
                control={control}
                rules={rules.conversionRate}
                defaultValue={association?.conversionRate}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={saveState == actionStates.IN_PROCESS}
                color="secondary"
                className={classes.submit}
              >
                ניקוי
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saveState == actionStates.IN_PROCESS}
                color="primary"
                className={classes.submit}
              >
                שמירה
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <UIActionState actionState={saveState} actionText={saveStateText}>
        <div className={classes.alert}>
          <Alert severity="success">הנתונים נשמרו בהצלחה!</Alert>
        </div>
      </UIActionState>
    </Container >
  );
};

export default Association;