import { Injectable } from '@angular/core';
import { Upload } from '../models/upload-file.models';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploadService {

  basePath = 'uploads';
  uploadsRef: AngularFireList<Upload>;
  uploads: Observable<Upload[]>;

  constructor(private db: AngularFireDatabase) { }

  getUploads() {
    this.uploads = this.db.list(this.basePath).snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.val();
        const $key = a.payload.key;
        return { $key, ...data };
      });
    });
    return this.uploads;
  }

  deleteUpload(upload: Upload) {
    // this.deleteFileData(upload.$key)
    // .then( () => {
      this.deleteFileStorage(upload.name);
    // })
    // .catch((error) => console.log(error));
  }

  // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
  pushUpload(upload: Upload) {
    var promise = new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>  {
          // upload in progress
          const snap = snapshot;
          upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
        },
        (error) => {
          // upload failed
          console.log("error", error);
          reject(error);
        },
        () => {
          // upload success
          if (uploadTask.snapshot.downloadURL) {
            upload.url = uploadTask.snapshot.downloadURL;
            upload.name = upload.file.name;
            // this.saveFileData(upload);
            resolve(upload)
          } else {
            reject(upload);
            console.error('No download URL!');
          }
        },
      );
    });
    return promise;
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }

  // delete the file details to the realtime db
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

  downloadFile(fileurl) {
    const storageRef = firebase.storage().ref();
    storageRef.child(fileurl).getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
    
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      // Or inserted into an <img> element:
      // var img = document.getElementById('myimg');
      // img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
  }
}