import transport, { IEvents, SETTINGS } from '../../ui/transport';


const uiIframe = <HTMLIFrameElement>document.querySelector("iframe")

uiIframe.addEventListener("load", function () {
  transport.setPort((uiIframe as any).contentWindow);
  transport.send({
    type: IEvents.setting,
    data: SETTINGS.matrix2d
  });
});

export {
  transport,
  IEvents
};
