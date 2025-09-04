import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type FilterType = 'all' | 'active' | 'completed';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TaskFilter = ({ currentFilter, onFilterChange, taskCounts }: TaskFilterProps) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All Tasks', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Completed', count: taskCounts.completed },
  ];

  return (
    <Card className="p-2 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex gap-1">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={currentFilter === filter.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              "flex-1 relative transition-all duration-200",
              currentFilter === filter.key 
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {filter.label}
            {filter.count > 0 && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-2 h-5 px-1.5 text-xs",
                  currentFilter === filter.key 
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {filter.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
};