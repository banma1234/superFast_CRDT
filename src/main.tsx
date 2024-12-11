import React, { useEffect, useState } from "react";
import { Todo } from "./type";

export default function Main(props: { todo: Todo[]; actions: any }) {
  const { todo, actions } = props;
  const [test, setTest] = useState(todo);

  useEffect(() => {
    setTest(todo);
  }, [todo]);

  return (
    <section>
      <div className="todo">
        {test.map((item, i) => {
          return (
            <div className="todo__container" key={i}>
              <p>{item.content}</p>
              <button onClick={() => actions.deleteTodo(item.id)}>x</button>
            </div>
          );
        })}
      </div>
      <hr />
    </section>
  );
}
