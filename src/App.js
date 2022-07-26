import './App.css';
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import {useEffect, useMemo, useRef, useState} from "react";

// https://jsonplaceholder.typicode.com/comments
function App() {

  const [data, setData] = useState([])

  const dataId = useRef(0)

  const getData = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json())

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        create_date: new Date().getTime(),
        id: dataId.current++
      }
    })
    setData(initData)
  }

  useEffect(() => {
    getData();
  }, [])

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
      data.filter((data) => data.id !== id)
    )
  }

  const onEdit = (id, newContent) => {
    setData(
      data.map((it) => it.id === id ? {...it, content: newContent} : it)
    )
  }

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length
    const badCount = data.length - goodCount
    const goodRatio = Math.floor((goodCount / data.length) * 100)
    return {goodCount, badCount, goodRatio}
  }, [data.length]);

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate}/>
      <div>전체일기 : {data.length}</div>
      <div>기분 좋은 일기 갯수 : {goodCount}</div>
      <div>기분 나쁜 일기 갯수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}%</div>
      <DiaryList diaryList={data} onDelete={onRemove} onEdit={onEdit}/>
    </div>
  );
}

export default App;
