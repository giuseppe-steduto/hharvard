/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Card, CardHeader, Box } from '@mui/material';
import "react-datepicker/dist/react-datepicker.css";
// components
import DatePicker from "react-datepicker";
import Page from '../components/Page';
// sections
import {
  Dynamic,
  AppCurrentVisits,
  HistoryDisplay,
} from '../sections/@dashboard/app';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [voiceDynamic, setVoiceDynamic] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [movDynamic, setMovDynamic] = useState([]);
  const [movHistory, setMovHistory] = useState([]);
  const [historyLabels, setHistoryLabels] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const date = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
  const token_user = localStorage.getItem("token");

  useEffect(() => {
    let url = `http://127.0.0.1/get_lecture_dynamics.php?token=` + token_user;
      axios
      .get(url)
      .then(res => {
        if (res.data.status === "failed") {
          alert("You have to login first!");
          navigate('/login', { replace: true });
        } else {
          const lectures = res.data;
          let voiceDyn = []; // should be full time line of lecture
          let voiceHis = [];
          let hisLabels = [];
          let emotionSummary = [];
          for (let i = 0; i < lectures.length; i++) {
            hisLabels[i] = `Lect ${i} - ${lectures[i].date}`;
            voiceHis[i] = lectures[i].total;
            let d = new Date(lectures[i].date);
            console.log(lectures[i]);
            let keys = Object.keys(lectures[i].emotions);
            for(let j = 0; j < keys.length; j++) {
              emotionSummary[j] = {
                label: keys[j],
                value: lectures[i].emotions[keys[j]],
              };
            }
          }
          setVoiceHistory(voiceHis);
          setVoiceDynamic(voiceDyn);
          setHistoryLabels(hisLabels);
          setEmotions(emotionSummary);
        }
      })
  }, [startDate])

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">

        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={8}>
            <Dynamic
              title="Dynamic History"
              subheader={`Lecture Date ${date}`}
              chartLabels={historyLabels}
              chartData={[
                {
                  name: 'Voice Dynamic',
                  type: 'area',
                  fill: 'gradient',
                  data: voiceHistory,
                },
                {
                  name: 'Movement Dynamic',
                  type: 'area',
                  fill: 'gradient',
                  data: movHistory,
                },
              ]}
            />
          </Grid>

          <Grid item xs={6} md={4} lg={4}>
            <Card style={{ height: '100%' }}>
              <CardHeader title="Instructions" />

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <p style={{color: "#333", lineHeight: "2em", marginBottom: "10px"}}>
                  On the right, you can see [...]
                </p>
                <hr />
                <p style={{color: "#333", lineHeight: "2em", marginTop: "10px"}}>
                  If you want to have detailed info about a specific lecture, use the tool below to pick a date and
                  click on the corresponding lecture!
                </p>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Card style={{ height: '100%' }}>
              <CardHeader title="Date picker" />

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <HistoryDisplay
              title="Lecture Summary"
              subheader={`Lect ${date}`}
              chartData={voiceHistory}
            />
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <AppCurrentVisits
              title={`Lecture ${date}`}
              chartData={emotions}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
                theme.palette.chart.red[0],
                theme.palette.chart.blue[0],
                theme.palette.chart.blue[0],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
