/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Card, CardHeader, Box, ListItem, Stack } from '@mui/material';
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
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDuration, setLectureDuration] = useState("");
  const [lectureDate, setLectureDate] = useState("");
  const [lectureSummary, setLectureSummary] = useState("Choose a date and click on the title of a lecture!");
  const [uploaded, setUploaded] = useState(0);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [dateFilteredLectures, setDateFilteredLectures] = useState([]);
  const [movDynamic, setMovDynamic] = useState([]);
  const [movHistory, setMovHistory] = useState([]);
  const [historyLabels, setHistoryLabels] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const date = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
  const token_user = localStorage.getItem("token");

  useEffect(() => {
    let url = `http://127.0.0.1/get_lecture_dynamics.php?datetime=${date}&token=${token_user}`;
      axios
      .get(url)
      .then(res => {
        if (res.data.status === "failed") {
          alert("You have to login first!");
          navigate('/login', { replace: true });
        } else {
          const lectures = res.data;
          setDateFilteredLectures(lectures);
          let emotionSummary = [];
          // for (let i = 0; i < lectures.length; i++) {
          //   let d = new Date(lectures[i].date);
          //   console.log(lectures[i]);
          //   let keys = Object.keys(lectures[i].emotions);
          //   for(let j = 0; j < keys.length; j++) {
          //     emotionSummary[j] = {
          //       label: keys[j],
          //       value: lectures[i].emotions[keys[j]],
          //     };
          //   }
          // }
          // setEmotions(emotionSummary);
        }
      })
  }, [startDate]);

  useEffect(() => {
    let url = `http://127.0.0.1/get_lecture_dynamics.php?token=${token_user}`;
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
          }
          setVoiceHistory(voiceHis);
          setVoiceDynamic(voiceDyn);
          setHistoryLabels(hisLabels);

          //Insert data from the last lecture
          let last_lecture = lectures.at(-1);
          detailsLecture(last_lecture);
        }
      })
  }, []);

  function detailsLecture(lect) {
    //Set data for the "lecture summary" card
    setLectureDate(lect.date);
    setLectureSummary(lect.summary);
    setLectureTitle(lect.title);
    setLectureDuration(lect.duration);

    //Set data for the pie chart
    let emotionSummary = [];
    console.warn(lect.emotions);
    let keys = Object.keys(lect.emotions);
    for(let j = 0; j < keys.length; j++) {
      emotionSummary[j] = {
        label: keys[j],
        value: lect.emotions[keys[j]],
      };
    }
    setEmotions(emotionSummary);
  }

  function openLecture(index) {
    detailsLecture(dateFilteredLectures[index]);
  }

  const lectureList = dateFilteredLectures.map((lecture, index) =>
    <>
      <section style={{display: "grid", gridTemplateColumns: "3fr 1fr"}}>
        <div>
          <p style={{marginTop: "15px"}}>
            {lecture.title}
          </p>
          <p style={{color: "#555", fontSize: "0.8em", marginBottom: "15px"}}>
            {lecture.date} - {lecture.duration} minutes
          </p>
        </div>
        <div style={{display: "grid", placeItems: "center"}}>
          <button style={{backgroundColor: "#5190e3", padding: "10px", border: "none", color: "white", borderRadius: "5px", cursor: "pointer"}}
            onClick={() => openLecture(index)}
          >
            Details</button>
        </div>
      </section>
      <hr />
    </>
  );

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">

        <h1>Morpheus - the tutor for teachers!</h1>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={8}>
            <Dynamic
              title="Engagement score over time"
              subheader={`See how you have improved!`}
              chartLabels={historyLabels}
              chartData={[
                {
                  name: 'Engagement score',
                  type: 'area',
                  fill: 'gradient',
                  data: voiceHistory,
                }
              ]}
            />
          </Grid>

          <Grid item xs={6} md={4} lg={4}>
            <Card style={{ height: '100%' }}>
              <CardHeader title="Instructions" />

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <p style={{color: "#333", lineHeight: "2em", marginBottom: "10px"}}>
                  Welcome to Morpheus!
                </p>
                <hr />
                <p style={{color: "#333", lineHeight: "2em", marginTop: "10px"}}>
                  On the left side you're able to see the data collected from each of your lecture dates.
                  <br />
                  To check what was taught on a specific lecture date, go to the bottom right hand box to then click on the calendar to find that date you're looking for. Once you select it, you're able to see the topic taught, the duration of the lecture and your data analytics on the side.
                  <br />
                  <br />
                  Keep up the good work!
                </p>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Card style={{ height: '100%' }}>
              <CardHeader title="Date picker" />

              <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}
                            className="form-control"
                            style={{textAlign: "center"}}
                />
                <Stack>
                  {lectureList}
                </Stack>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Card style={{ height: '100%' }}>
              <CardHeader title="Lecture summary" />

              {
                lectureTitle === "" &&
                <div style={{width: "100%", margin: "25px", color: "#666", fontSize: "1.2em"}}>
                  <p>Pick a date and choose a lecture to begin!</p>
                </div>
              }
              {
                lectureTitle !== "" &&
                <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                  <h4 style={{marginTop: "10px"}}>Title</h4>
                  <p>{lectureTitle}</p>
                  <h4 style={{marginTop: "10px"}}>Summary</h4>
                  <p>{lectureSummary}</p>
                  <h4 style={{marginTop: "10px"}}>Duration</h4>
                  <p>{lectureDuration} minutes</p>
                  <h4 style={{marginTop: "10px"}}>Date</h4>
                  <p>{lectureDate}</p>
                </Box>
              }
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <AppCurrentVisits
              title={`Analysis of lecture \"${lectureTitle}\"`}
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
