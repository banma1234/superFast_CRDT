import "./App.css";
import yorkie, { DocEventType, Document, JSONArray } from "yorkie-js-sdk";
import { useState, useEffect } from "react";
import { displayPeers, createRandomPeers } from "./handlePeers";
import { Todo } from "./type";
import Main from "./main";

/**
 * `ENV` = api 요청 관련 환경변수 객체
 * @enum {string} ENV
 */
const ENV = {
  url: process.env.REACT_APP_YORKIE_API_ADR!,
  apiKey: process.env.REACT_APP_YORKIE_API_KEY!,
};

/**
 * `defaultContent` =  불러온 document가 비어있을 경우 적용할 `초기 컨텐츠`
 * @enum {{id: number, content: string}} defaultContent
 */
const defaultContent = [
  { id: 0, content: "initial Content" },
  { id: 1, content: "hello yorkie world" },
];

function App() {
  /**
   * text = 사용자 입력 텍스트
   * todo = 실제로 document에 삽입될 todo item
   * peers = 문서에 참여한 사용자
   * doc = 사용자가 작업할 실제 문서(document)
   */
  const [text, setText] = useState<string>("");
  const [todo, setTodo] = useState<Todo[]>([]);
  const [peers, setPeers] = useState<string[]>([]);
  const [doc] = useState<Document<{ todo: JSONArray<Todo> }>>(
    // "doTest"라는 이름의 새로운 문서 생성
    () => new yorkie.Document("production"),
  );

  /**
   * `actions` = 삽입, 삭제 등 사용자가 `document`에 가할 액션
   */
  const actions = {
    /**
     * 입력받은 todo의 `텍스트`를 적합한 id값과 함께 yorkie의 `document`에 삽입
     * @param {string} todo - todo 텍스트
     * @returns {void}
     */
    addTodo(todo: string): void {
      doc.update(root => {
        /** 삽입될 todo의 index값 */
        const index =
          root.todo.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1;

        root.todo.push({
          id: index,
          content: todo,
        });
        setText("");
      });
    },

    /**
     * 삭제할 todo의 `id(=index)`를 전달받아 비교를 통해 document에서 제거
     * @param {number} id - todo의 `index`값
     * @returns {void}
     */
    deleteTodo(id: number): void {
      doc.update(root => {
        let target = undefined;

        for (const item of root.todo) {
          if (item.id === id) {
            target = item as any;
            break;
          }
        }

        // target이 존재하는 경우 target의 고유 id를 이용해 제거
        if (target) {
          root.todo.deleteByID!(target.getID());
        }
      });
    },
  };

  useEffect(() => {
    // yorkie client
    const client = new yorkie.Client(ENV.url, {
      apiKey: ENV.apiKey,
    });

    // subscribe document event of "PresenceChanged"(="peers-changed")
    doc.subscribe("presence", event => {
      if (event.type !== DocEventType.PresenceChanged) {
        setPeers(displayPeers(doc.getPresences()));
      }
    });

    /**
     * `document`(=doc)를 구독하고 `이벤트 발생`에 따라 적합한 조치를 취하는 함수
     * @param {Document<{todo: JSONArray<Todo>}>} doc - 현재 문서의 `document`
     * @param {(props: any) => void} callback - 호출할 `callback` 함수
     * @returns {Promise<T>}
     */
    async function attachDoc(
      doc: Document<{ todo: JSONArray<Todo> }>,
      callback: (props: any) => void,
    ): Promise<any> {
      // 01. activate client
      await client.activate();
      // 02. attach the document into the client with presence
      await client.attach(doc, {
        initialPresence: {
          userName: createRandomPeers(),
        },
      });

      // 03. create default content if not exists.
      doc.update(root => {
        if (!root.todo) {
          root.todo = defaultContent;
        }
      }, "create default content if not exists");

      // 04. subscribe doc's change event from local and remote.
      doc.subscribe(() => {
        callback(doc.getRoot().todo);
      });

      // 05. set content to the attached document.
      callback(doc.getRoot().todo);
    }

    // doc 업데이트
    attachDoc(doc, todo => setTodo(todo));
  }, []);

  return (
    <div className="App">
      <p>
        peers : [
        {peers.map((man, i) => {
          return <span key={i}> {man}, </span>;
        })}{" "}
        ]
      </p>

      <Main todo={todo} actions={actions} />

      <hr />
      <div className="todo__container">
        <input
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <button onClick={() => actions.addTodo(text)}>제출</button>
        <button
          onClick={() => {
            todo.map(item => console.log(item.content));
          }}
        >
          Check!
        </button>
      </div>
    </div>
  );
}

export default App;
