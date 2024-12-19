import React, { useState } from "react";
import { Todo } from "./type";

export default function Main(props: {
  todo: Todo[];
  actions: { [name: string]: Function };
}) {
  const [text, setText] = useState<string>("");
  const { todo, actions } = props;

  const submitTodo = () => {
    console.log("submitTodo!\n");
    console.log("text : ", text, "\n");
    actions.addTodo(text);
    setText("");
  };

  return (
    <>
      <div className="todo">
        {todo.map((item, i) => {
          return (
            <div className="todo__container" key={i}>
              <p>{item.content}</p>
              <button onClick={() => actions.deleteTodo(item.id)}>x</button>
            </div>
          );
        })}
      </div>
      <hr />
      <div className="todo__container">
        <input
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <button onClick={submitTodo}>제출</button>
      </div>
    </>
  );
}
