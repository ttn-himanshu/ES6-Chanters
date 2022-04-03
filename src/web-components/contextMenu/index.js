import Chanters from "../../lib/Chanters.js";
import { html } from "../../lib/utils.js";

class ChantersMenu extends Chanters {
  static get template() {
    return html`
      <style>
        @import "src/style/chanters.css";
        #menu {
          color: white;
          list-style: none;
          top: 40px;
          right: -20px;
          width: 200px;
          border-radius: 5px;
        }

        #menu li {
          display: block;
          padding: 10px;
          cursor: pointer;
          position: relative;
        }

        #menu li:hover {
          background: red;
        }

        #submenu {
          position: absolute;
          width: 100%;
          left: 200px;
          top: 0px;
          display: none;
        }
      </style>
      <ul
        id="menu"
        on-mouseleave="{{hideMenu}}"
        class="border dark-div absolute z-index-pinnacle box-shadow {{visibility}}"
      >
        <li on-click="{{itemClick}}">
          <span>Change BackGround</span>
        </li>
        <input
          autocomplete=""
          accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG"
          type="file"
          id="background"
          multiple
          style="display:none"
        />
        <li on-click="{{itemClick}}">
          <span>Resize BackGround</span>
        </li>
        <li on-click="{{itemClick}}">
          <span>Mode</span>
        </li>
        <li on-click="{{itemClick}}">
          <span>Add Songs</span>
        </li>
        <input
          autocomplete=""
          type="file"
          id="fileupload"
          multiple
          class="hidden"
          style="display:none"
        />
        <li on-click="{{clearCache}}">
          <span>Remove Cache</span>
        </li>
        <li on-click="{{itemClick}}">
          <span>Customize Background</span>
        </li>
        <li on-mouseover="{{showSubMenu}}" on-mouseout="{{hideSubMenu}}">
          <span>Playlist</span>
          <ul id="submenu" class="border dark-div box-shadow">
            <li on-click="{{itemClick}}">
              <span>All Songs</span>
            </li>
            <li on-click="{{itemClick}}">
              <span>Favourite Songs</span>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  static get properties() {
    return {
      visibility: "hide",
    };
  }

  hideMenu(event) {
    if (event.target.nodeName === "UL" && this.visibility === "show") {
      this.visibility = "hide";
      this.$.submenu.style.display = "none";
    }
  }

  showSubMenu(e) {
    this.$.submenu.style.display = "block";
  }
  hideSubMenu() {
    this.$.submenu.style.display = "none";
  }

  itemClick() {
    console.log("item clicked called");
  }
}

customElements.define("chanters-menu", ChantersMenu);
