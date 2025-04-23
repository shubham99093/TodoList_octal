import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ImageBox from "../components/ImageBox";
import ListTodos from "../components/ListTodos";
import { ITodos } from "../type";
import { useAuth } from "../context";

function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<ITodos[] | null>(null);
  const [isEdit, SetIsEdit] = useState({
    clicked: false,
    todo: { title: "", _id: "" },
  });
  const { user, setUser } = useAuth();

  useEffect(() => {
    try {
      const getData = async () => {
        const responce = await fetch("http://localhost:3000/getitems", {
          credentials: "include",
        });

        if (responce.status !== 200) {
          toast.error("Error getting data");
        }

        const data: ITodos[] = await responce.json();
        if (data.length <= 0) {
          setTodos(null);
          return;
        }

        setTodos(data);
      };
      getData();
    } catch (err) {}
  }, []);

  const handleSubmit = async () => {
    try {
      if (todo.trim() === "") {
        toast.error("Please Enter Value");
        return;
      }

      if (
        todos?.find((t) => t.title.toLowerCase() === todo.trim().toLowerCase())
      ) {
        toast.error("todo already added");
        return;
      }

      const responce = await fetch("http://localhost:3000/additem", {
        body: JSON.stringify({ todo: todo.trim() }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
      });

      if (responce.status !== 200) {
        toast.error("Error Adding data");
        return;
      }

      const result = await responce.json();

      setTodos([...(todos || []), result]);
      setTodo("");
      toast.success("New Task Added To The List");
    } catch (err) {
      console.log("somethis wrong");
    }
  };

  const handleEditButton = (todo: ITodos) => {
    SetIsEdit({ clicked: true, todo });
    setTodo(todo.title);
  };

  const handledeleteButton = async (id: string) => {
    try {
      const responce = await fetch("http://localhost:3000/deleteitem", {
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "DELETE",
      });

      if (responce.status !== 200) {
        toast.error("Error Deleting data");
        return;
      }

      const result = await responce.json();
      setTodos(todos?.filter((t) => t._id !== result._id) || null);

      toast.error("Task Removed");
    } catch (err) {
      console.log("somethis wrong");
    }
  };

  const handleCheckItems = async (check: boolean, id: string) => {
    try {
      const responce = await fetch("http://localhost:3000/checkitem", {
        body: JSON.stringify({ check: check, id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "PUT",
      });

      if (responce.status !== 200) {
        toast.error("Error Checking data");
        return;
      }

      const result: ITodos = await responce.json();
      console.log(result);

      setTodos(todos?.map((t) => (t._id === id ? result : t)) || null);
      SetIsEdit({
        clicked: false,
        todo: { title: "", _id: "" },
      });
      setTodo("");
      toast.success("Value Changed");
    } catch (err) {
      console.log("somethis wrong");
    }
  };

  const handleUpdate = async () => {
    try {
      if (todo.trim() === "") {
        toast.error("Please Enter Value");
        return;
      }

      const responce = await fetch("http://localhost:3000/edititem", {
        body: JSON.stringify({ todo, id: isEdit?.todo?._id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "PUT",
      });

      if (responce.status !== 200) {
        toast.error("Error Updating data");
        return;
      }

      const result: ITodos = await responce.json();
      console.log(result);

      setTodos(
        todos?.map((t) => (t._id === isEdit.todo._id ? result : t)) || null
      );
      SetIsEdit({
        clicked: false,
        todo: { title: "", _id: "" },
      });
      setTodo("");
      toast.success("Value Changed");
    } catch (err) {
      console.log("somethis wrong");
    }
  };

  const handleClearItems = async () => {
    try {
      const responce = await fetch("http://localhost:3000/clearitems", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "DELETE",
      });

      if (responce.status !== 200) {
        toast.error("Error Clearing data");
        return;
      }

      setTodos(null);
      toast.error("Empty List");
    } catch (err) {
      console.log("somethis wrong");
    }
  };
  const handleLogout = async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <>
      <div>
        <section className="py-12 px-4 m-[8rem_auto_0] bg-white w-[90vw] max-w-[35rem] rounded-sm transition-all duration-300 ease-linear shadow-[0_5px_15px_rgba(0,0,0,.2)]">
          <div className="flex justify-between">
            <div className="capitalize pb-1 font-semibold text-lg">
              Welcome {user?.username}
            </div>
            <div>
              <button className="cursor-pointer" onClick={handleLogout}>
                logout
              </button>
            </div>
          </div>
          <div className="flex flex-row">
            <input
              className="w-full px-4 py-2 text-[1.2rem] bg-[#f0f0f0] border-[1px] border-[#f4ae00] focus:outline-amber-500 rounded-tl-sm rounded-bl-sm "
              placeholder="Enter a new task to do"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            ></input>
            <button
              className="p-1 flex-[0_0_5rem] justify-center items-center text-[.85rem] font-bold rounded-tr-sm rounded-br-sm bg-[#ffc727] tracking-[2px] capitalize hover:text-white transition-all duration-300 ease-linear"
              onClick={isEdit.clicked ? handleUpdate : handleSubmit}
            >
              {isEdit.clicked ? "Edit" : "Submit"}
            </button>
          </div>
          {todos && (
            <ListTodos
              todos={todos}
              handleEditButton={handleEditButton}
              handledeleteButton={handledeleteButton}
              handleClearItems={handleClearItems}
              handleCheckItems={handleCheckItems}
            />
          )}

          <ImageBox />
        </section>
      </div>
    </>
  );
}

export default Home;
