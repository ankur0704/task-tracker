import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface TaskInputProps {
  onAdd: (title: string) => void;
}

export const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
        <Button 
          type="submit" 
          className="btn-primary px-4"
          disabled={!title.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>
    </Card>
  );
};