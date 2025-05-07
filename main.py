# main.py
from flask import Flask, render_template, request, jsonify
from task import Task
from todo_list import ToDoList
from datetime import date

app = Flask(__name__)
todo = ToDoList()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = [task.to_dict() for task in todo.get_all_tasks()]
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    task = Task(
        title=data['title'],
        description=data['description'],
        priority=data['priority'],
        units=data['units'],
        task_date=date.today()
    )
    todo.add_task(task)
    return jsonify(task.to_dict()), 201

@app.route('/tasks/<title>', methods=['DELETE'])
def delete_task(title):
    task = todo.get_task_by_title(title)
    if task:
        todo.remove_task_by_title(title)
        return jsonify({'message': 'Task deleted'}), 200
    return jsonify({'error': 'Task not found'}), 404

@app.route('/tasks/<title>/complete', methods=['PATCH'])
def complete_task(title):
    task = todo.get_task_by_title(title)
    if task:
        task.completed = not task.completed  # Toggle completion status
        return jsonify(task.to_dict()), 200
    return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)