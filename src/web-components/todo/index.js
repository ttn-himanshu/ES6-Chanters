import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class TodoApp extends Chanters {
  static get properties() {
    return {
      todoName: "",
      todos: [],
      showFooter: "hide",
    };
  }

  addTodo(event) {
    if (event.keyCode === 13) {
      this.todos.push({ name: this.todoName, completed: false, edit: false });
      this.todoName = "";
      this.showFooter = "show";
    }
  }

  completeTask(event, todo) {
    console.log(todo);
  }

  removeTodo(event, index) {
    this.todos.splice(index, 1);
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
    console.log(activeTab);
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
              />
              <template if="!{{todo.edit}}">
                <label on-dblclick="{{editTodo(todo)}}" class="list-item-todo"
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
          <label slot="todo-counter">{{todos.length}} item left</label>
        </tabs-selector>
      </div>
    `;
  }
}

// on-click="{{completeTask(todo)}}"
customElements.define("todo-app", TodoApp);
