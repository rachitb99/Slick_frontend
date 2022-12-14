import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios';

const emojis = ['😘', '😘', '🥰', '🥰', '😐', '😐', '😐', '😐', '😐', '😐', '😐', '😐'];
const genre = ['flirt', 'flirt', 'crush', 'crush', 'general', 'general', 'general', 'general', 'general', 'general', 'general', 'general'];

const SRow = styled(Row)`
  padding: 1rem;
`;

function App() {
  const [images, setImages] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [prompt, setPrompt] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [emoji, setEmoji] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [target, setTarget] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [status, setStatus] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  let imgRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  async function upload() {
    const questions = [];
    for (let i=0; i< 12; i++ ) {
      if (!prompt[i]) throw Error();
      if (!images[i] && !emoji[i]) throw Error();
      if (!target[i]) throw Error();
      let image = null;
      if (images[i]) {
        image = await convertBase64(images[i]);
      }
      questions.push({
        image,
        emoji: emoji[i],
        prompt: prompt[i],
        genre: genre[i],
        target: target[i],
      });
    }
    const config = {
      method: 'post',
      url: process.env.REACT_APP_BACKEND + '/questions',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: questions,
    };
    axios(config)
      .then((res) => {
        if(res.status === 201)setStatus('success');
        else setStatus('failed');
      })
      .catch(err => {
        setStatus('failed')
      });
  }

  async function signIn() {
    await axios.post(process.env.REACT_APP_BACKEND + '/auth/admin/login', {
      user_name: username,
      password,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 201) setAccessToken(res.data.access_token);
      })
      .catch(err => {});
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return !accessToken ?
  <div>
    <h4>Admin username</h4>
    <Form.Control type="text" onChange={e => {setUsername(e.target.value)}} required style={{ margin: '2rem' }} />
    <h4>Admin password</h4>
    <Form.Control type="text" onChange={e => {setPassword(e.target.value)}} required style={{ margin: '2rem' }} />
    <Button style={{margin: '3rem'}} onClick={signIn}>Login</Button>
  </div> :
  <div>
      <SRow>
        {status ? <Alert variant={status === 'success' ? 'success' : 'danger'} type="submit" onClick={upload}>
          {status}
        </Alert> : null}
      </SRow>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(element =>
        <div>
        <SRow>
        <Col lg={1}>
          <h5>{element}</h5>
          <h5>{emojis[element-1]}</h5>
          <h5>{genre[element-1]}</h5>
        </Col>
        <Col lg={1}>
          <img style={{ height: "100px", width: "100px" }} ref={imgRef[element-1]} alt=""/>
        </Col>
        <Col lg={3}>
          <Form.Control type="file" onChange={e => {
            let temp = images;
            temp[element - 1] = e.target.files[0];
            setImages(temp);
            let src = URL.createObjectURL(e.target.files[0]);
            imgRef[element-1].current.src = src;
          }}/>
        </Col>
        <Col>
          <Form.Select name="stock" id="stock" onChange={e => {
            let temp = target;
            temp[element - 1] = e.target.value;
            setTarget(temp);
          }} required>
            <option value="">-</option>
            <option value="any">🐕Any</option>
            <option value="opposite">❌Opp.</option>
            <option value="male">🧍‍♂️ M</option>
            <option value="female">🚶‍♀️ F</option>
          </Form.Select>
        </Col>
        <Col lg={6}>
        <Form.Control type="text" onChange={e => {
          let temp = emoji;
          temp[element - 1] = e.target.value;
          setEmoji(temp);
        }}/>
        <Form.Control type="text" onChange={e => {
          let temp = prompt;
          temp[element - 1] = e.target.value;
          setPrompt(temp);
        }} required/>
        </Col>
      </SRow>
        </div>
      )}
      <SRow>
        <Button variant="primary" type="submit" onClick={upload}>
          Submit
        </Button>
      </SRow>
    </div>
}

export default App;
