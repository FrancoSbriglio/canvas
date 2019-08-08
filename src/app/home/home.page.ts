import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { NavController, Platform } from '@ionic/angular'; // aca normalize
// import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { IonContent } from '@ionic/angular';




const STORAGE_KEY = 'IMAGE_LIST';


@Component({ // aca
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage  {
  @ViewChild('imageCanvas', {static: false}) canvas: any;

  canvasElement: any;

  saveX: number;
  saveY: number;

  storedImages = [];

// tslint:disable-next-line: max-line-length
constructor( public navCtrl: NavController,  private storage: Storage, public renderer: Renderer, private plt: Platform) {
  // Load all stored images when the app is ready
  this.storage.ready().then(() => {
    this.storage.get(STORAGE_KEY).then(data => {
      if (data !== undefined) {
        this.storedImages = data;
      }
    });
  });
}



  // Make Canvas sticky at the top stuff
  @ViewChild(IonContent, {static: false}) content: IonContent;

  @ViewChild('fixedContainer', {static: false}) fixedContainer: any;


  // Color Stuff
  selectedColor = '#9e2956';

  colors = [ '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];


  ionViewDidEnter() {
    // https://github.com/ionic-team/ionic/issues/9071#issuecomment-362920591
    // Get the height of the fixed item
    let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
    const scroll = this.content.getScrollElement();

    // Add preexisting scroll margin to fixed container size
    itemHeight = Number.parseFloat(scroll.style.marginTop.replace('px', '')) + itemHeight;
    scroll.style.marginTop = itemHeight + 'px';
  }

  ionViewDidLoad() {
    // Set the Canvas Element and its size
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
  }
  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    const ctx = this.canvasElement.getContext('2d');
    const currentX = ev.touches[0].pageX - canvasPosition.x;
    const currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }


  saveCanvasImage() {
    const dataUrl = this.canvasElement.toDataURL();

    const ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas

    const name = new Date().getTime() + '.png';
    const path = this.file.dataDirectory;
    const options: IWriteOptions = { replace: true };

    const data = dataUrl.split(',')[1];
    const blob = this.b64toBlob(data, 'image/png');

    this.file.writeFile(path, name, blob, options).then(res => {
      this.storeImage(name);
    }, err => {
      console.log('error: ', err);
    });
  }
  // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}

