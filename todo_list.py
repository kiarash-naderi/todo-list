class ToDoList:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append(task)
    
    def remove_task_by_title(self, title):
        self.tasks = [task for task in self.tasks if task.title != title]
        
    def get_all_tasks(self):
        return self.tasks
    
    def get_tasks_by_priority(self, priority):
        return [task for task in self.tasks if task.priority == priority.lower()]
    
    def get_task_by_title(self, title):
        for task in self.tasks:
            if task.title == title:
                return task
        return None 
    
