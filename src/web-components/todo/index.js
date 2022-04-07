import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class TodoApp extends Chanters {
  static get properties() {
    return {
      todoName: "",
      task: [
        {
          name: "first task",
        },
      ],
    };
  }

  handleSubmit() {
    if (this.todoName) {
      this.task.push({ name: this.todoName });
    }
  }

  removeItem(event, index) {
    this.task.splice(index, 1);
  }

  static get template() {
    return html`
      <style>
      @import "src/style/todo.css";
      </style>

      <div class="todo-wrapper">
        <label>Todo App</label>
       <div class="todo-input">
            <input type="text" class="input-todo" value="{{todoName}}"></input> 
            <button on-click="{{handleSubmit}}">Add</button>
        </div>
        <ul class="todo-list">
            <template repeat items="task">
                <li>
                    <span class="todo-name">{{item.name}}</span>
                    <span class="close" on-click="{{removeItem(itemsIndex)}}">x</span>
                </li>
            </template>
            <div>{{task.length}}</div>
        </ul>
      </div>
    `;
  }
}

customElements.define("todo-app", TodoApp);
