import React, {useCallback, useEffect, useMemo, useReducer, useRef} from "react";
import './App.css';
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT" : {
      return action.data
    }
    case "CREATE": {
      const created_date = new Date().getTime()
      const newItem = {
        ...action.data,
        created_date
      }
      return [newItem, ...state]
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.id)
    }
    case "EDIT": {
      return state.map((it) => it.id === action.id ? {...it, content: action.newContent} : it)
    }
    default:
      return state;
  }
}

export const DiaryStateContext = React.createContext()
export const DiaryDispatchContext = React.createContext()

function App() {

  // const [data, setData] = useState([])
  const [data, dispatch] = useReducer(reducer, [])
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
    dispatch({type: "INIT", data: initData})
  }

  useEffect(() => {
    getData();
  }, [])

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {author, content, emotion, id: dataId.current},
    })
    dataId.current += 1
  }, [])

  const onRemove = useCallback((id) => {
    dispatch(
      {type: "REMOVE", id})
  }, [])

  const onEdit = useCallback((id, newContent) => {
    dispatch(
      {type: "EDIT", id, newContent}
    )
  }, [])

  const memoizedDispatches = useMemo(()=> {
    return {onCreate, onRemove, onEdit}
  },[])

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length
    const badCount = data.length - goodCount
    const goodRatio = Math.floor((goodCount / data.length) * 100)
    return {goodCount, badCount, goodRatio}
  }, [data.length]);

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor/>
          <div>전체일기 : {data.length}</div>
          <div>기분 좋은 일기 갯수 : {goodCount}</div>
          <div>기분 나쁜 일기 갯수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}%</div>
          <DiaryList/>
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;