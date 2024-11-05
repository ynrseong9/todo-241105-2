class TodoApp {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.initializeElements();
    this.addEventListeners();
    this.renderTodos();
    this.startClock();
  }

  initializeElements() {
    this.todoTitle = document.getElementById("todoTitle");
    this.todoDetails = document.getElementById("todoDetails");
    this.addButton = document.getElementById("addTodo");
    this.todoList = document.getElementById("todoList");
    this.statusFilter = document.getElementById("statusFilter");
    this.sortBy = document.getElementById("sortBy");
    this.searchInput = document.getElementById("searchInput");
  }

  addEventListeners() {
    this.addButton.addEventListener("click", () => this.addTodo());
    this.statusFilter.addEventListener("change", () => this.renderTodos());
    this.sortBy.addEventListener("change", () => this.renderTodos());
    this.searchInput.addEventListener("input", () => this.renderTodos());
  }

  addTodo() {
    if (!this.todoTitle.value.trim()) {
      this.showNotification("제목을 입력해주세요");
      return;
    }

    const todo = {
      id: Date.now(),
      title: this.todoTitle.value,
      details: this.todoDetails.value,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(todo);
    this.saveTodos();
    this.renderTodos();
    this.clearInputs();
    this.showNotification("할 일이 추가되었습니다");
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date().toISOString() : null;
      this.saveTodos();
      this.renderTodos();
      this.showNotification(
        `할 일이 ${todo.completed ? "완료" : "미완료"}로 변경되었습니다`
      );
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveTodos();
    this.renderTodos();
    this.showNotification("할 일이 삭제되었습니다");
  }

  renderTodos() {
    let filteredTodos = [...this.todos];

    // 상태 필터링
    if (this.statusFilter.value !== "all") {
      filteredTodos = filteredTodos.filter((todo) =>
        this.statusFilter.value === "completed"
          ? todo.completed
          : !todo.completed
      );
    }

    // 검색
    const searchTerm = this.searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm) ||
          todo.details.toLowerCase().includes(searchTerm)
      );
    }

    // 정렬
    filteredTodos.sort((a, b) => {
      if (this.sortBy.value === "title") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    this.todoList.innerHTML = filteredTodos
      .map(
        (todo) => `
                <li class="todo-item ${todo.completed ? "completed" : ""}">
                    <div class="todo-content">
                        <input type="checkbox" 
                               ${todo.completed ? "checked" : ""} 
                               onchange="todoApp.toggleTodo(${todo.id})">
                        <div class="todo-text">
                            <span>${todo.title}</span>
                            ${todo.details ? `<p>${todo.details}</p>` : ""}
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="delete-btn" onclick="todoApp.deleteTodo(${
                          todo.id
                        })">삭제</button>
                    </div>
                </li>
            `
      )
      .join("");
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  clearInputs() {
    this.todoTitle.value = "";
    this.todoDetails.value = "";
  }

  showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  startClock() {
    const updateClock = () => {
      const now = new Date();
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = now.toLocaleString("ko-KR", options);
      document.getElementById("clock").textContent = timeString;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }
}

const todoApp = new TodoApp();
