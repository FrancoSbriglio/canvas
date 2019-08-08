import { Component, OnInit, ViewChild, Renderer, Renderer2 } from '@angular/core';
import { NavController, Platform } from '@ionic/angular'; // aca normalize

import { Storage } from '@ionic/storage';
import { IonContent } from '@ionic/angular';
import { File } from '@ionic-native/file';




const STORAGE_KEY = 'IMAGE_LIST';


@Component({ // aca
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage  {
  @ViewChild('imageCanvas', {static: false}) canvas: any;

  canvasElement: any;

  saveX: number;
  saveY: number;

  storedImages = [];

// tslint:disable-next-line: max-line-length
constructor(private file: File, public navCtrl: NavController, private storage: Storage, public renderer: Renderer, private plt: Platform ) {
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

}

