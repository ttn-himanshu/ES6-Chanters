const eventListeners = {
  button: {
    events: {
      '@click': {
        eventName: 'click',
        callback() {
          console.log('button clicked', this);
        },
      },
    },
  },
  input: {
    events: {
      '.value': {
        eventName: 'input',
        callback() {
          console.log('input type text changed', this);
        },
      },
    },
  },
};

// eslint-disable-next-line import/prefer-default-export
export const attachEvents = (template) => {
  const htmlNodes = Object.keys(eventListeners);

  htmlNodes.forEach((node) => {
    const tagList = template.querySelectorAll(node);

    tagList.forEach((tag) => {
      const listeners = eventListeners[node].events;
      Object.keys(listeners).forEach((attributeName) => {
        if (tag.attributes[attributeName]) {
          const eventObject = eventListeners[node].events[attributeName];
          tag.addEventListener(eventObject.eventName, eventObject.callback, true);
        }
      });
    });
  });
};

export function uuidv4() {
  return '10000000'.replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
