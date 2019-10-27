import React from "react";
import { Query } from "react-apollo";
import Todo from "./Todo";
import { QUERY_TODO } from "./graphQueries/todoQueries";

const TodoList = () => (
  <Query query={QUERY_TODO}>
    {({ loading, error, data }) => {
      if (loading) {
        return <div>Loading. Please wait...</div>;
      }
      if (error) {
        return <div>{""}</div>;
      }
      return (
        <div className="container">
          <ul className="list-group">
            {data.todo.map((todo, index) => {
              return (
                <li className="list-group-item">
                  <Todo key={index} todo={todo} />
                </li>
              );
            })}
          </ul>
        </div>
      );
    }}
  </Query>
);

export default TodoList;
