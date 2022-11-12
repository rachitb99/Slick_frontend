import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios';

const emojis = ['😘', '😘', '🥰', '🥰', '🥰', '😐', '😐', '😐', '😐', '😐', '😐', '😐'];
const genre = ['flirt', 'flirt', 'crush', 'crush', 'crush', 'general', 'general', 'general', 'general', 'general', 'general', 'general'];

const SRow = styled(Row)`
  padding: 1rem;
`;

function App() {
  const [images, setImages] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [prompt, setPrompt] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [target, setTarget] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
  const [status, setStatus] = useState(null);

  let imgRef = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  async function upload() {
    const questions = [];
    for (let i=0; i< 12; i++ ) {
      const base64 = await convertBase64(images[i]);
      if (!prompt[i]) throw Error();
      if (!target[i]) throw Error();
      questions.push({
        image: base64,
        prompt: prompt[i],
        genre: genre[i],
        target: target[i],
      });
    }
    await axios.post(process.env.REACT_APP_BACKEND, questions)
      .then((res) => {
        if(res.status === 201)setStatus('success');
        else setStatus('failed');
      })
      .catch(err => {
        setStatus('failed')
      });
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

  return (
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
          }} required/>
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
  );
}

export default App;
