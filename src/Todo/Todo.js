import React from "react";
import { Mutation } from "react-apollo";

import {
  QUERY_TODO,
  MUTATION_TODO_UPDATE,
  MUTATION_TODO_DELETE
} from "./graphQueries/todoQueries";

const handleTodoToggle = (toggleTodo, todo) => {
  toggleTodo({
    variables: {
      todoId: todo.id,
      set: {
        completed: !todo.completed
      }
    },
    update: (cache, { data: { update_todo } }) => {
      const data = cache.readQuery({ query: QUERY_TODO });
      const toggledTodo = data.todo.find(t => t.id === todo.id);
      toggledTodo.completed = !todo.completed;
      cache.writeQuery({
        query: QUERY_TODO,
        data
      });
    }
  });
};

const handleTodoDelete = (deleteTodo, todo) => {
  deleteTodo({
    variables: {
      todoId: todo.id
    },
    update: (cache, { data: { update_todo } }) => {
      const data = cache.readQuery({ query: QUERY_TODO });
      data.todo = data.todo.filter(t => {
        return t.id !== todo.id;
      });
      cache.writeQuery({
        query: QUERY_TODO,
        data
      });
    }
  });
};

const Todo = ({ todo }) => (
  <Mutation mutation={MUTATION_TODO_UPDATE}>
    {updateTodo => {
      return (
        <div className="card shadow-sm p-3 mb-5 bg-white rounded">
          <div className="card-body">
            <table>
              <tr>
                <td>Created: {todo.created_at}</td>
              </tr>
              <tr>
                <th>MFCC</th>
                <td>{todo.speech_stats.result.mfcc}</td>
              </tr>
              <tr>
                <th>Spectral Bandwidth</th>
                <td>{todo.speech_stats.result.spectral_bandwidth}</td>
              </tr>
              <tr>
                <th>Spectral Centroid</th>
                <td>{todo.speech_stats.result.spectral_centroid}</td>
              </tr>
              <tr>
                <th>Spectral Rolloff</th>
                <td>{todo.speech_stats.result.spectral_rolloff}</td>
              </tr>
            </table>
          </div>

          <div className="card-body">
            {todo.speech_stats.result.classification.map((value, index) => {
              return (
                <div key={index}>
                  <h3>Prediction {index}</h3>
                  <p
                    className={
                      value.score > 0.6
                        ? "alert alert-danger"
                        : "alert alert-success"
                    }
                  >
                    Speech Impediment Chance: {value.name}
                  </p>
                  <p
                    className={
                      value.score > 0.6
                        ? "alert alert-danger"
                        : "alert alert-success"
                    }
                  >
                    Score: {value.score}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="comtainer">
            <Mutation mutation={MUTATION_TODO_DELETE}>
              {deleteTodo => {
                return (
                  <button
                    className="btn btn-danger"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTodoDelete(deleteTodo, todo);
                    }}
                  >
                    Delete
                  </button>
                );
              }}
            </Mutation>
          </div>
        </div>
      );
    }}
  </Mutation>
);

export default Todo;
