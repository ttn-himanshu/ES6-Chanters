import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class TodoApp extends Chanters {
  static get properties() {
    return {
      todoName: "",
      todos: [
        {
          name: "learn react",
          contentEditable: "false",
          closeIcon: "show",
          saveIcon: "hidden",
          learningMethods: [
            {
              type: "online",
            },
            {
              type: "create poc app",
            },
          ],
        },
      ],
    };
  }

  handleSubmit() {
    if (this.todoName) {
      this.todos.push({
        name: this.todoName,
        contentEditable: "false",
        closeIcon: "show",
        saveIcon: "hidden",
      });
      this.todoName = "";
    }
  }

  saveItem(event, index) {
    // this.todos.splice(index, 1);
    console.log("saveItem called", event, index);
  }

  removeItem(event, index) {
    this.todos.splice(index, 1);
  }

  editItem(event, item) {
    item.contentEditable = item.contentEditable === "false" ? "true" : "false";
    item.closeIcon = item.closeIcon == "show" ? "hidden" : "show";
    item.saveIcon = item.closeIcon == "show" ? "hidden" : "show";
  }

  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";
        @import "src/style/todo.css";
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
      </style>

      <div class="todo-wrapper">
        <label>Todo App</label>
        <div class="todo-input">
          <input type="text" class="input-todo" value="{{todoName}}" />
          <button on-click="{{handleSubmit}}">Add</button>
        </div>
        <ul class="todo-list">
          <template repeat items="todos" key="todo">
            <li>
              <i
                on-click="{{editItem(todo)}}"
                class="fa fa-pencil-square-o edit"
                aria-hidden="true"
              ></i>

              <span contenteditable="{{todo.contentEditable}}" class="todo-name"
                >{{todo.name}}</span
              >

              <i
                class="fa fa-floppy-o {{todo.saveIcon}}"
                on-click="{{saveItem(todo)}}"
                aria-hidden="true"
              ></i>

              <i
                class="fa fa-times close {{todo.closeIcon}}"
                aria-hidden="true"
                on-click="{{removeItem(itemsIndex)}}"
              ></i>

              <template repeat items="todo.learningMethods">
                <li>{{item.type}}</li>
              </template>
            </li>
          </template>
        </ul>
      </div>
    `;
  }
}

customElements.define("todo-app", TodoApp);
