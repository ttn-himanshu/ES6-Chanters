

export default class Chanters extends HTMLElement {
  constructor() {
    console.log("Chanters constructor")
    super();
    console.log("Chanters constructor")

    this.init();
  }
  /**
   * @initialize the new custom Element
   **/
  init = () => {
    this.magicHappened();
    this.componentDidMount();
  };


  magicHappened() {
    const { constructor: { properties } } = this
    for (let key in properties) {
      this[key] = properties[key];
    }

    const stringHTML = this.render();
    this.attachShadowRoot(stringHTML);
  }

  attachShadowRoot = (stringHTML) => {
    var template = document.createElement("template");
    template.innerHTML = stringHTML;
    const clone = document.importNode(template.content, true);
    attachEvents(clone);
    this.attachShadow({ mode: "open" }).appendChild(clone);
  };
}



const eventListeners = {
  "button": {
    events: {
      "@click": {
        "eventName": "click",
        "callback": function(){
          console.log("button clicked", this)
        }
      }
    }
  },
  "input": {
    events: {
      ".value": {
        "eventName": "input",
        "callback": function(){
          console.log("input type text changed", this)
        }
      }
    }
  }
}

const attachEvents = (template) => {
  const htmlNodes = Object.keys(eventListeners);

  htmlNodes.forEach(node => {
    const tagList = template.querySelectorAll(node);
   
    tagList.forEach(tag=> {
      const listeners = eventListeners[node].events;
      Object.keys(listeners).forEach(attributeName=> {
        if(tag.attributes[attributeName]) {
          const eventObject = eventListeners[node].events[attributeName];
          tag.addEventListener(eventObject.eventName, eventObject.callback,true);
        }
      })
      
    })
  })

}

export const html = function html(strings, ...values) {
  // String.raw({ raw: strings }, ...personExp);
  const clone = [...strings];
  let iterator = 1;
  // clone.forEach((item, index) => {
  //   console.log(item);

  // });

  values.forEach((item, index) => {
    /**
     * todo:: stuck in finding a way how to get the value of input type = text
     */
    const newItem = typeof item !=="function" ? "<!--?lit$760121965$-->"+item : item;
    clone.splice(index + iterator, 0, newItem);
    iterator++;
  });

 

  return clone.join("");
};
