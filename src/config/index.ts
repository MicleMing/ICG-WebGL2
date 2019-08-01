import transport, { IEvents, SETTINGS } from '../../ui/transport';


const uiIframe = <HTMLIFrameElement>document.querySelector("iframe");

const ConfigPanel = (setting: SETTINGS) => {
  uiIframe.addEventListener("load", function () {
    transport.setPort((uiIframe as any).contentWindow);
    transport.send({
      type: IEvents.setting,
      data: setting
    });
  });
}

ConfigPanel.__S__ = SETTINGS;

export {
  transport,
  IEvents,
  ConfigPanel
};
