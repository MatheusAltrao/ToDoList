import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs"
import "./app.css"


const API = " http://localhost:5000"

function App() {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoding] = useState(false)

  const root = document.querySelector(":root")


  const changeColorPurple = () => {
    document.body.style.setProperty('--primary-color', '#7c17b4');
    document.body.style.setProperty('--second-color', '#951cd8');
  }


  const changeColorRed = () => {
    document.body.style.setProperty('--primary-color', '#dc143c');
    document.body.style.setProperty('--second-color', '#f5224c');
  }

  const changeColorOrange = () => {
    document.body.style.setProperty('--primary-color', '#ff6501');
    document.body.style.setProperty('--second-color', '#e67930');
  }

  const changeColorCyan = () => {
    document.body.style.setProperty('--primary-color', '#00b8a5');
    document.body.style.setProperty('--second-color', '#12a4ac');
  }

  //load to do 

  useEffect(() => {
    const loadData = async () => {
      setLoding(true)

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoding(false)
      setTodos(res)
    }

    loadData()

  }, [])


  const handleSubmit = async (ev) => {
    ev.preventDefault()
    console.log(title)

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    console.log(todo)

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle("")
    setTime("")
  }

  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async (todo) => {

    todo.done = !todo.done


    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTodos((prevState) => prevState.map((t) => (t.id === data.id) ? (t = data) : t))
  }

  if (loading) {
    return (
      <p>Carregando...</p>
    )
  }

  return (
    <div className="body">

      <div className="buttons-colors">
        <div className="buttons-colors-cards">
          <button id="purple" onClick={changeColorPurple} className="button"></button>
          <button id="red" onClick={changeColorRed} className="button"></button>
          <button id="orange" onClick={changeColorOrange} className="button"></button>
          <button id="cyam" onClick={changeColorCyan} className="button"></button>
        </div>
      </div>

      <div className="app" >
        <h1>Lista De Tarefas</h1>

        <form id="form" onSubmit={handleSubmit} >

          <label>
            Tarefa:
            <input id="inputdate"

              name="title"
              type="text"
              placeholder="Adicionar tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </label>


          <label>
            Prazo:
            <input
              name="time"
              type="text"
              placeholder="20/10/2022"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </label>

          <button id="buttonAdd" className="add">Adicionar</button>
        </form>

        <div className="todo-list">

          {todos.length === 0 && <p>A lista está vazia</p>}
          {todos.map((todo) => (
            <div className="todo " key={todo.id}>
              <div id="itemTodo">
                <p className={todo.done ? "todo-done" : ""} >{todo.title} <br></br> <p className="term">{todo.time}</p></p>


                <div className="actions">
                  <span onClick={() => handleEdit(todo)}>
                    {!todo.done ? <BsBookmarkCheck className="icons" size={23} /> : <BsBookmarkCheckFill className="icons" size={23} />}
                  </span>
                  <span>
                    {
                      <BsTrash className="icons" size={23}
                        onClick={() => handleDelete(todo.id)} />
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div >
  )
}

export default App;

//adicionar prazo