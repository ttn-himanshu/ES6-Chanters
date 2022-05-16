import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class TabsSelector extends Chanters {
  static get properties() {
    return {
      activeTab: "All",
      tabs: [
        {
          label: "All",
          active: "active",
        },
        {
          label: "Active",
          active: "",
        },
        {
          label: "Completed",
          active: "",
        },
      ],
    };
  }

  handleClick(event, item) {
    this.props.setactivetab(item.label);
    this.tabs.forEach((tab) => {
      tab.active = "";
    });
    item.active = "active";
  }

  static get template() {
    return html`
      <style>
        @import "src/style/todo.css";
      </style>
      <div class="footer">
        <slot name="todo-counter"></slot>
        <ul>
          <template repeat items="tabs">
            <li class="{{item.active}}" on-click="{{handleClick(item)}}">
              {{item.label}}
            </li>
          </template>
        </ul>
      </div>
    `;
  }
}

customElements.define("tabs-selector", TabsSelector);
