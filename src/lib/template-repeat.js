import Chanters from "./Chanters.js";
import WebComponent from "./WebComponent.js";
import { html } from "./utils.js";

class TemplateRepeat extends Chanters {
  static get template() {
    return html``;
  }

  onReady() {
    const {
      nodeObject: { Repeater },
    } = this;

    if (Repeater && Repeater.length) {
        this.beginWork(Repeater);
    }
  }

  beginWork(Repeater) {
    Repeater.forEach((repeat) => {
      const { template, bindingType, proto, raw } = repeat;
      const targetArray = proto[raw];

      // const { parentCustomElemnt: context } = this;

      if (bindingType === "Repeater") {
        targetArray.forEach((item) => {
          var clone = document.importNode(template.content, true);

          this.shadowRoot.appendChild(clone);
            console.log(this, { item });
          const webComponent = new WebComponent(this, { item });
        });
      }
    });
  }
}

// customElements.define("template-repeat", TemplateRepeat);
