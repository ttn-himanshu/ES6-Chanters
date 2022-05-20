import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class TodoApp extends Chanters {
  static get properties() {
    return {
      todoName: "",
      todos: [],
      showFooter: "hide",
      activeCount: 0,
      label: ""
    };
  }

  setActiveLabel () {
    this.label = this.todos.length > 1 ? "items":"item"
  }

  addTodo(event) {
    if (event.keyCode === 13) {
      this.todos.push({
        name: this.todoName,
        completed: false,
        edit: false,
        show: true,
      });

      this.todoName = "";
      this.showFooter = "show";
      this.activeCount++;
      this.setActiveLabel();
    }
  }

  removeTodo(event, index) {
    this.todos.splice(index, 1);
    this.activeCount--;
    this.setActiveLabel();
    if (!this.todos.length) {
      this.showFooter = "hide";
    }
  }

  editTodo(event, todo) {
    todo.edit = true;
  }

  saveTodo(event, todo, itemsIndex) {
    if (event.keyCode === 13) {
      if (!todo.name) {
        this.removeTodo(event, itemsIndex);
      } else {
        todo.edit = false;
      }
    }
  }

  setActiveTab(activeTab) {
    switch (activeTab) {
      case "All":
        this.todos.forEach((item) => {
          item.show = "show";
        });
        break;
      case "Active":
        this.todos.forEach((item) => {
          item.show = !item.completed ? "show" : "hide";
        });
        break;
      case "Completed":
        this.todos.forEach((item) => {
          item.show = item.completed ? "show" : "hide";
        });
        break;
    }
  }

  toggleActiveCount(event, item) {
    item.completed ? this.activeCount-- : this.activeCount++;
  }

  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";
        @import "src/style/todo.css";
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
      </style>
      <label class="heading">todos</label>

      <div class="todo-wrapper">
        <div class="input-wrapper">
          <input
            type="text"
            placeholder="What needs to be done?"
            class="txttodo"
            value="{{todoName}}"
            on-keyup="{{addTodo}}"
          />
        </div>
        <ul class="todo-list">
          <template repeat items="todos" key="todo">
            <li>
              <input
                type="checkbox"
                checked="{{todo.completed}}"
                class="toggle"
                on-change="{{toggleActiveCount(todo)}}"
              />
              <template if="!{{todo.edit}}">
                <label on-dblclick="{{editTodo(todo)}}" class="list-item-todo {{todo.completed}}"
                  >{{todo.name}}</label
                >
              </template>
              <template if="{{todo.edit}}">
                <input
                  type="text"
                  class="list-item-todo list-item-input"
                  value="{{todo.name}}"
                  on-keyup="{{saveTodo(todo, itemsIndex)}}"
                />
              </template>
              <i
                class="fa fa-times close"
                aria-hidden="true"
                on-click="{{removeTodo(itemsIndex)}}"
              ></i>
            </li>
          </template>
        </ul>
        <tabs-selector class="{{showFooter}}" data-setactivetab="setActiveTab">
          <label slot="todo-counter">{{activeCount}} {{label}} left</label>
        </tabs-selector>
      </div>
    `;
  }
}

customElements.define("todo-app", TodoApp);
