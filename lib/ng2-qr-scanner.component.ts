import { Component } from '@angular/core';
import WebCameraProvider from './webcamera.provider';


@Component({
  selector: 'ng2-qr-scanner',
  templateUrl: 'ng2-qr-scanner.component.html'
})

class QRScannerComponent extends WebCameraProvider {

    private setCookie(name: string, value: string, expireDays: number, path: string = "") {
        let d:Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires:string = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
      
    }
 private getCookie(name: string) {
        let ca: Array<string> = document.cookie.split(';');
        let caLen: number = ca.length;
        let cookieName = name + "=";
        let c: string;

        for (let i: number = 0; i < caLen; i += 1) {
            c = ca[i].replace(/^\s\+/g, "");
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return "";
    }



  static READ_ITERATION_DELAY: number = 500;

  text: string = '';
  timerId: number = null;

  constructor() {
    super(
      () => {
        this.initQRCodeReader();
        this.capture();
      },
      (err) => {
        console.error(err);
      },
      () => {
        this.tryToReadQRCode();
      });
  }

  displayCode(code: string): void {
    let camArea: any = this.getVideo();
    if (!camArea) {
      camArea = this.getFlashObject();
    }
    camArea.setAttribute('style', 'border: 12px solid #9c37b3');
    this.text = code;
    window.localStorage.setItem('key', code);
   
    this.setCookie("scan",this.text,1,"/");
    this.setCookie("false_cookie","brak danych",1,"/");
    console.log("Cookies 1" +this.getCookie("scan"));
    console.log("Cookies" +this.getCookie("pizda"));
    console.log("Local storage"+window.localStorage.getItem('key'))
    this.stopReading();
  }

  initQRCodeReader(): void {
    const w: any = <any>window;
    const qrReader = w.qrcode;

    try {
      qrReader.canvasId = 'qr-code';
      qrReader.callback = (data: string) => {
        this.displayCode(data);
      };
    } catch (e) {
      console.error(e);
    }
  }

  tryToReadQRCode(): void {
    const w: any = <any>window;
    const qrReader = w.qrcode;

    try {
      qrReader.decode();
    } catch (e) {
      this.timerId = setTimeout(this.capture.bind(this), QRScannerComponent.READ_ITERATION_DELAY);
    }
  }

  stopReading(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}

export default QRScannerComponent;

