"use client"
import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react"
import { Calendar, Plus } from "lucide-react"

interface Task {
  id: number
  name: string
  scheduled_for: string
  solved: boolean
  created_by?: {
    name: string
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [taskInputs, setTaskInputs] = useState<{ [key: number]: string }>({})
  const router = useRouter();

useEffect(() => {
  const initialInputs = tasks.reduce((acc, task) => {
    acc[task.id] = task.name;
    return acc;
  }, {} as { [key: string]: string });

  setTaskInputs(initialInputs);
}, [tasks]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token armazenado no localStorage:', token);
    if (!token) {
      router.push('/');
      return;
    }

    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
    
      try {
        const response = await fetch('http://localhost:3003/tasks', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        if (response.ok) {
          const fetchedTasks = await response.json();
          console.log('Fetched Tasks:', fetchedTasks);
          setTasks(fetchedTasks);
        } else {
          const errorResponse = await response.text();
          console.log('Erro ao buscar tarefas', errorResponse);
          alert('Erro ao buscar tarefas');
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição');
      }
    };
        
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim() || !selectedDate) {
      alert('Please enter both a task title and a scheduled date.');
      return;
    }
  
    const task = {
      id: Date.now(),
      name: newTask,
      scheduled_for: selectedDate,
      solved: false,
    };
  
    const response = await fetch('http://localhost:3003/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(task),
    });
  
    if (response.ok) {
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
  
      setNewTask("");
      setSelectedDate("");
  
      alert('Tarefa adicionada com sucesso!');
    } else {
      alert('Erro ao adicionar tarefa');
    }
  };
  
  const toggleTask = async (taskId: number) => {
    const response = await fetch(`http://localhost:3003/task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        solved: !tasks.find((task) => task.id === taskId)?.solved,
      }),
    })

    if (response.ok) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, solved: !task.solved } : task)))
    } else {
      alert('Falha ao atualizar a tarefa')
    }
  }

  const handleTaskInputChange = (taskId: number, value: string) => {
    setTaskInputs({ ...taskInputs, [taskId]: value })
  }

  const updateTaskName = async (taskId: number) => {
    const updatedName = taskInputs[taskId]
    const response = await fetch(`http://localhost:3003/task/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: updatedName,
      }),
    })

    if (response.ok) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, name: updatedName } : task)))
    } else {
      alert('Falha ao atualizar o nome da tarefa')
    }
  }

  return (
    <div className="min-h-screen bg-[#434343]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Manda Tasks</h1>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task title"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E4003F]"
            />
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E4003F] pr-10"
              />
              <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
            <button
              onClick={addTask}
              className="bg-[#E4003F] text-white px-4 py-2 rounded-md hover:bg-[#E4003F]/90 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.solved}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 rounded border-gray-300 text-[#E4003F] focus:ring-[#E4003F]"
                />
                <div className="flex-1">
                  <div className="flex">
                    <span className="text-gray-400 font-bold text-lg">
                      ({task.created_by!.name})&nbsp;
                    </span>
                    <input
                      className={`font-medium focus:outline-none flex-grow ${task.solved ? "line-through text-gray-400" : "text-gray-900"} bg-transparent`}
                      type="text"
                      value={taskInputs[task.id] || ""}
                      placeholder={task.name}
                      onChange={(e) => handleTaskInputChange(task.id, e.target.value)}
                      onBlur={() => updateTaskName(task.id)}
                      onKeyPress={(e) => {
                         if (e.key === "Enter") {
                           updateTaskName(task.id);
                          }
                        }}
                        />
                  </div>
                  <p className="text-sm text-gray-500">
                  {new Date(task.scheduled_for).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-gray-500 py-4">No tasks yet. Add your first task above!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}