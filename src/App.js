import './App.css';
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import {useRef, useState} from "react";

// const dummyList = [
//   {
//     id: 1,
//     author: 'yun',
//     content: 'hi',
//     emotion: 5,
//     created_date: new Date().getTime()
//   },
//   {
//     id: 2,
//     author: 'chang',
//     content: 'hi2',
//     emotion: 1,
//     created_date: new Date().getTime()
//   },
//   {
//     id: 3,
//     author: 'sun',
//     content: 'hi3',
//     emotion: 2,
//     created_date: new Date().getTime()
//   },
//   {
//     id: 4,
//     author: 'yun',
//     content: 'hi',
//     emotion: 4,
//     created_date: new Date().getTime()
//   },
// ]

function App() {

  const [data, setData] = useState([])

  const dataId = useRef(0)

  const onCreate = (author, content, emotion) => {
    const create_date = new Date().getTime()
    const newItem = {
      author,
      content,
      emotion,
      create_date,
      id: dataId.current
    }
  dataId.current += 1
    setData([newItem, ...data])
  }

  const onRemove = (id) => {
    setData(
      data.filter((data)=>data.id !== id)
    )
  }

  const onEdit = (id, newContent) => {
    setData(
      data.map((it)=>it.id === id? {...it, content:newContent} : it)
    )
  }

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onDelete={onRemove} onEdit={onEdit}/>
    </div>
  );
}

export default App;
