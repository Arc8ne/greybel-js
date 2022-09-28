import { v4 } from 'uuid';

export class Stdin {
  target: any;
  queue: any[];

  constructor(target: any) {
    this.queue = [];
    this.target = target;
  }

  enable() {
    const me = this;
    me.target.disabled = false;
  }

  disable() {
    const me = this;
    me.target.disabled = true;
  }

  focus() {
    const me = this;
    me.target.focus();
  }

  getValue() {
    const me = this;
    return me.target.value;
  }

  clear() {
    const me = this;
    me.target.value = '';
  }

  setType(type: any) {
    const me = this;
    me.target.type = type;
  }

  waitForInput(): Promise<void> {
    const me = this;
    const target = me.target;
    const id = v4();

    me.queue.unshift(id);

    return new Promise((resolve) => {
      const handler = (evt: KeyboardEvent) => {
        if (evt.keyCode === 13) {
          const currentId = me.queue[0];

          if (id === currentId) {
            evt.stopImmediatePropagation();
            me.queue.shift();
            target.removeEventListener('keydown', handler);
            resolve();
          }
        }
      };

      target.addEventListener('keydown', handler);
    });
  }

  waitForKeyPress(): Promise<KeyboardEvent> {
    const me = this;
    const target = me.target;

    return new Promise((resolve) => {
      const handler = (evt: KeyboardEvent) => {
        target.removeEventListener('keydown', handler);
        resolve(evt);
      };

      target.addEventListener('keydown', handler);
    });
  }
}

export class Stdout {
  target: any;
  history: any[];

  constructor(target: any) {
    this.target = target;
    this.history = [];
  }

  write(value: any) {
    const me = this;
    me.history.push(...value.split('\\n'));
    me.render();
  }

  updateLast(value: any) {
    const me = this;
    me.history[me.history.length - 1] = value;
    me.render();
  }

  render() {
    const me = this;
    const target = me.target;
    target.innerHTML = me.history.join('</br>');
    target.scrollTop = target.scrollHeight;
  }

  clear() {
    const me = this;
    const target = me.target;
    me.history = [];
    target.innerHTML = '';
    target.scrollTop = target.scrollHeight;
  }
}
