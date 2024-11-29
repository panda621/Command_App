import React, {useEffect, useState} from "react";

import * as tf from "@tensorflow/tfjs"
import * as speech from "@tensorflow-models/speech-commands"
// Reference: https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

function App() {
  // 1. Create model and action states
  const [model, setModel] = useState(null)
  const [action, setAction] = useState(null)
  const [labels, setLabels] = useState(null)

  // 2. Create Recognizer
  const loadModel = async () => {
    const recognizer = await speech.create("BROWSER_FFT")
    console.log("Model Loaded")
    await recognizer.ensureModelLoaded();
    console.log(recognizer.wordLabels())
    setModel(recognizer)
    setLabels(recognizer.wordLabels())
  }

  useEffect(() => {loadModel()}, []);

  function argMax(arr){
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a:r))[1];
  }

  // 3. Listen for Actions
  const recognizeCommands = async () => {
    console.log("Listening for commands")
    model.listen(result => {
        // console.log(labels[argMax(Object.values(result.scores))])
        console.log(result.spectrogram)
        setAction(labels[argMax(Object.values(result.scores))])
      }, {includeSpectrogram:true, probabilityThreshold:0.9}
    )

    setTimeout(() => model.stopListening(), 10e3)
  }

  const prediction = {
    "up": "bi bi-caret-up-fill",
    "down": "bi bi-caret-down-fill",
    "left": "bi bi-caret-left-fill",
    "right": "bi bi-caret-right-fill",
    "stop": "bi bi-stop-circle-fill",
    "go": "bi bi-play-circle-fill",
    "yes": "bi bi-check-circle-fill",
    "no": "bi bi-x-circle-fill",
    "on": "bi bi-brightness-high-fill",
    "off": "bi bi-brightness-low-fill",
    "unknown": "bi bi-question-circle-fill",
    "silence": "bi bi-mic-mute-fill",
    "one": "bi bi-1-square",
    "two": "bi bi-2-square",
    "three": "bi bi-3-square",
    "four": "bi bi-4-square",
    "five": "bi bi-5-square",
    "six": "bi bi-6-square",
    "seven": "bi bi-7-square",
    "eight": "bi bi-8-square",
    "nine": "bi bi-9-square",
    "zero": "bi bi-0-square",
  }

  return (
      <div className="container">
        <div class="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
            <div class="col-lg-6 px-0">
            <h1 class="display-4 fst-italic">Command Recognition with TensorflowJS</h1>
            <p class="lead my-3">
                This is a simple demonstration of how to use TensorflowJS to recognize voice commands.
                The model used is the Speech Commands model from TensorflowJS.
            </p>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6 d-flex justify-content-center'>
                {/* Mic Icon */}
                {/* <i className="bi bi-mic-fill"></i> */}
                <button 
                    className='btn btn-outline-primary bi bi-mic-fill fs-1 rounded-circle px-3' 
                    onClick={recognizeCommands}
                ></button>
            </div>

            <div className='col-md-6'>
                {
                    action 
                    ? 
                        <div >
                            <p className={`${prediction[action]} fs-1`} style={{ fontSize: `${3}rem` }}>
                                {action}
                            </p>
                        </div>
                    :
                        <div> No Action Detected </div> 
                }

            </div>
        </div>
    </div>
  );
}

export default App;
