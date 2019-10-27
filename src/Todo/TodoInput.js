import React from "react";
import { Mutation } from "react-apollo";
import { speechUrl } from "../constants";

import { QUERY_TODO, MUTATION_TODO_ADD } from "./graphQueries/todoQueries";

import { ReactMic } from "react-mic";

export default class TodoInput extends React.Component {
  constructor() {
    super();
    this.state = {
      record: false,
      recordedBlob: new Blob(),
      recordComplete: false,
      audioFileSrc: {},
      textboxValue: "",
      errorMessage: ""
    };
    this.onStop = this.onStop.bind(this);
  }

  startRecording = () => {
    this.setState({
      record: true,
      recordComplete: false,
      recordedBlob: new Blob(),
      audioFileSrc: "",
      speechStats: {}
    });
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
  };

  onData(recordedBlob) {
    console.log("chunk of real-time data is: ", recordedBlob);
  }

  onStop = (recordedBlob, addTodo) => {
    this.setState({
      recordedBlob,
      audioFileSrc: recordedBlob.blobURL,
      recordComplete: true,
      loading: true
    });
    console.log("recordedBlob is: ", recordedBlob);
    const blob = recordedBlob.blob;
    fetch(speechUrl, {
      method: "POST",
      body: blob,
      headers: { "x-user-id": localStorage.getItem("auth0:id_token:sub") }
    })
      .then(res => res.json())
      .then(result => {
        const newTask = this.state.textboxValue;
        const userId = this.props.userId;
        addTodo({
          variables: {
            objects: [
              {
                task: newTask,
                user_id: userId,
                completed: false,
                speech_stats: result
              }
            ]
          },
          update: (store, { data: { insert_todo } }) => {
            const data = store.readQuery({ query: QUERY_TODO });
            const insertedTodo = insert_todo.returning;
            data.todo.splice(0, 0, insertedTodo[0]);
            store.writeQuery({
              query: QUERY_TODO,
              data
            });
            this.setState({
              record: false,
              recordComplete: true,
              recordedBlob: new Blob(),
              audioFileSrc: "",
              speechStats: {}
            });
          }
        });
      })
      .catch(err => {
        this.setState({
          errorMessage: err.message
        });
        console.error(err);
      }); // DO other things
  };

  handleTextboxValueChange = e => {
    this.setState({
      textboxValue: e.target.value
    });
  };

  // handleTextboxKeyPress = (e, addTodo) => {
  //   if (e.key === "Enter") {
  //     fillData(addTodo)
  // };

  render() {
    return (
      <Mutation mutation={MUTATION_TODO_ADD}>
        {(addTodo, { data, loading, called, error }) => {
          return (
            <div className="container">
              {this.state.loading || loading ? (
                <div class="spinner-border" size="small" />
              ) : (
                <p></p>
              )}

              <button
                className="btn btn-primary"
                onClick={
                  this.state.record ? this.stopRecording : this.startRecording
                }
              >
                Toggle Recording
              </button>
              <p>{this.state.record ? "Recording!" : "Not Recording"}</p>
              {error || this.state.errorMessage.length !== 0 ? (
                <p>{error || this.state.errorMessage}</p>
              ) : (
                <p></p>
              )}
              <div>
                <ReactMic
                  record={this.state.record} // defaults -> false.  Set to true to begin recording
                  // pause={boolean}          // defaults -> false.  Available in React-Mic-Plus upgrade only
                  // className={string}       // provide css class name
                  onStop={blob => this.onStop(blob, addTodo)} // callback to execute when audio stops recording
                  onData={this.onData} // callback to execute when chunk of audio data is available
                  strokeColor="#000000" // sound wave color
                  backgroundColor="#337ab7" // background color
                />
                {this.state.recordComplete ? (
                  <audio controls src={this.state.audioFileSrc} />
                ) : (
                  ""
                )}
                <br />
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}
