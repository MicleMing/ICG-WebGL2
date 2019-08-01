

const sendLog = (msg: any) => {
  console.log('send: ', msg);
};

const receiveLog = (msg: any) => {
  console.log('receive: ', msg);
};

export enum IEvents {
  progress = 'event-progress',
  setting = 'event-setting',
}

export enum SETTINGS {
  matrix2d = 'matrix2d',
  matrix3d = 'matrix3d',
}

interface IData {
  type: IEvents;
  data: any;
}

interface IHandler {
  (event: MessageEvent): void;
}

interface ITransport {
  on: (eventName: string, handler: IHandler) => void;
  onMessage: (eventName: IEvents, handler: (data: any) => void) => void;
}

class Transport implements ITransport {
  port: Window;
  on(eventName: string, handler: IHandler) {
    window.addEventListener(eventName, handler, false);
  }

  onMessage(eventName: IEvents, handler: (data: any) => void): void {
    this.on('message', (event: MessageEvent) => {
      const chunk: IData = event.data;
      const { type, data } = chunk;
      // receiveLog(chunk);
      if (type === eventName) {
        handler(data);
      }
    });
  }
  send(data: IData, targetOrigin: string = '*') {
    // sendLog(data);
    this.port.postMessage(data, targetOrigin);
  }

  setPort(win: Window) {
    this.port = win;
  }
}

export default new Transport();
