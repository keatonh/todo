from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Todo
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todos.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/api/todos", methods=["GET"])
def get_todos():
    status = request.args.get("status")
    priority = request.args.get("priority")
    category = request.args.get("category")
    search = request.args.get("search", "")

    query = Todo.query

    if status == "active":
        query = query.filter_by(completed=False)
    elif status == "completed":
        query = query.filter_by(completed=True)

    if priority and priority != "all":
        query = query.filter_by(priority=priority)

    if category and category != "all":
        query = query.filter_by(category=category)

    if search:
        like = f"%{search}%"
        query = query.filter(
            Todo.title.ilike(like) | Todo.description.ilike(like)
        )

    sort_by = request.args.get("sort_by", "created_at")
    sort_order = request.args.get("sort_order", "desc")

    if sort_by == "due_date":
        null_last = Todo.due_date.is_(None).asc()
        col_order = Todo.due_date.asc() if sort_order == "asc" else Todo.due_date.desc()
        query = query.order_by(null_last, col_order)
    else:
        col_order = Todo.created_at.asc() if sort_order == "asc" else Todo.created_at.desc()
        query = query.order_by(col_order)

    todos = query.all()
    return jsonify([t.to_dict() for t in todos])


@app.route("/api/todos", methods=["POST"])
def create_todo():
    data = request.get_json()
    if not data or not data.get("title", "").strip():
        return jsonify({"error": "Title is required"}), 400

    todo = Todo(
        title=data["title"].strip(),
        description=data.get("description", "").strip(),
        priority=data.get("priority", "medium"),
        category=data.get("category", "General").strip() or "General",
        due_date=data.get("due_date") or None,
    )
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_dict()), 201


@app.route("/api/todos/clear-completed", methods=["DELETE"])
def clear_completed():
    Todo.query.filter_by(completed=True).delete()
    db.session.commit()
    return "", 204


@app.route("/api/todos/<int:todo_id>", methods=["GET"])
def get_todo(todo_id):
    todo = db.get_or_404(Todo, todo_id)
    return jsonify(todo.to_dict())


@app.route("/api/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    todo = db.get_or_404(Todo, todo_id)
    data = request.get_json()

    if "title" in data:
        todo.title = data["title"].strip()
    if "description" in data:
        todo.description = data["description"].strip()
    if "completed" in data:
        todo.completed = data["completed"]
    if "priority" in data:
        todo.priority = data["priority"]
    if "category" in data:
        todo.category = data["category"].strip() or "General"
    if "due_date" in data:
        todo.due_date = data["due_date"] or None

    todo.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(todo.to_dict())


@app.route("/api/todos/<int:todo_id>/toggle", methods=["PATCH"])
def toggle_todo(todo_id):
    todo = db.get_or_404(Todo, todo_id)
    todo.completed = not todo.completed
    todo.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(todo.to_dict())


@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = db.get_or_404(Todo, todo_id)
    db.session.delete(todo)
    db.session.commit()
    return "", 204


@app.route("/api/categories", methods=["GET"])
def get_categories():
    rows = db.session.query(Todo.category).distinct().all()
    return jsonify([r[0] for r in rows])


if __name__ == "__main__":
    app.run(debug=True, port=8000)
