# task.py

from datetime import date

class Task:
    def __init__(self, title, description, priority, units, task_date=None):
        self.title = title
        self.description = description
        self.priority = priority.lower()
        self.units = units
        self.date = task_date or date.today()
        self.completed = False

    def __str__(self):
        return f"[{self.priority.upper()}] {self.title} - {self.description} - {self.units} units - {self.date}"

    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "units": self.units,
            "date": self.date.isoformat(),
            "completed": self.completed,
        }
