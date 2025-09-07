import { useState, useMemo } from "react";
import { TaskCard, Task } from "./TaskCard";
import { TaskInput } from "./TaskInput";
import { TaskFilter, FilterType } from "./TaskFilter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Target, Award } from "lucide-react";

export const TaskTracker = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Set up project structure",
      completed: true,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: "2", 
      title: "Design clean UI components",
      completed: true,
      createdAt: new Date(Date.now() - 43200000)
    },
    {
      id: "3",
      title: "Implement task filtering",
      completed: false,
      createdAt: new Date()
    },
    {
      id: "4",
      title: "Add smooth animations",
      completed: false,
      createdAt: new Date()
    }
  ]);
  
  const [filter, setFilter] = useState<FilterType>('all');

  // Task statistics
  const taskStats = useMemo(() => {
    const all = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = all - completed;
    const completionRate = all > 0 ? Math.round((completed / all) * 100) : 0;

    return {
      all,
      active, 
      completed,
      completionRate
    };
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (id: string, title: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, title } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4 shadow-[var(--shadow-elegant)]">
            <CheckSquare className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Task Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay organized and productive with this clean task management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{taskStats.all}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Plus className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{taskStats.active}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <CheckSquare className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Done</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold">{taskStats.completionRate}%</p>
                  <Badge variant={taskStats.completionRate >= 50 ? "default" : "secondary"} className="text-xs">
                    {taskStats.completionRate >= 80 ? "Excellent" : taskStats.completionRate >= 50 ? "Good" : "Keep Going"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Task Input */}
        <div className="mb-6 animate-scale-in">
          <TaskInput onAdd={addTask} />
        </div>

        {/* Task Filter */}
        <div className="mb-6 animate-scale-in">
          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCounts={{
              all: taskStats.all,
              active: taskStats.active,
              completed: taskStats.completed
            }}
          />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))
          ) : (
            <Card className="p-8 text-center bg-card/30 backdrop-blur-sm border-dashed border-2 border-border/50">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted/50 rounded-lg mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'all' 
                  ? "Add your first task to get started!" 
                  : `No ${filter} tasks yet.`
                }
              </p>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p></p>
          <p className="mt-1"></p>
        </div>
      </div>
    </div>
  );
};