import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

export interface Template {
  name: string;
  header: string;
  footer: string;
}
export interface TemplateId extends Template {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private readonly afs: AngularFirestore,
    private storage: Storage
  ) {}

  // Get Template collection reference
  getTemplateCollectionRef(uid: string): AngularFirestoreCollection<Template> {
    return this.afs.collection<Template>(`users/${uid}/templates`);
  }

  // Get all templates
  getAllTemplates(): Promise<Observable<TemplateId[]>> {
    return this.storage.get('user').then(user => {
      return this.afs
        .collection<Template>(`users/${user.uid}/templates`, ref =>
          ref.orderBy(`createdAt`, 'desc')
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data() as Template;
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
    });
  }

  // Get single template (document)
  getTemplate(docId: string): Promise<Observable<Template>> {
    return this.storage.get('user').then(user =>
      this.getTemplateCollectionRef(user.uid)
        .doc<Template>(docId)
        .snapshotChanges()
        .pipe(map(action => action.payload.data()))
    );
  }

  // Get server timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  // Create a template (document)
  createTemplate({ name, header, footer }) {
    return this.storage.get('user').then(user =>
      this.getTemplateCollectionRef(user.uid)
        .doc(this.afs.createId())
        .set({
          name,
          header,
          footer,
          createdAt: this.timestamp
        })
    );
  }

  // Update a template
  updateTemplate(docId: string, { name, header, footer }) {
    return this.storage.get('user').then(user =>
      this.getTemplateCollectionRef(user.uid)
        .doc(docId)
        .update({
          name,
          header,
          footer,
          updatedAt: this.timestamp
        })
    );
  }

  // Delete a template
  deleteTemplate(docId: string) {
    return this.storage.get('user').then(user =>
      this.getTemplateCollectionRef(user.uid)
        .doc(docId)
        .delete()
    );
  }

  // Delete all templates one by one
  deleteAllTemplates(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAllTemplates().then(templates$ => {
        templates$.forEach(data => {
          data.forEach(template => this.deleteTemplate(template.id));
        });
        resolve();
      });
    });
  }

  // Delete user
  deleteUserData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.deleteAllTemplates().then(() => {
        this.storage.get('user').then(user => {
          this.afs
            .doc(`users/${user.uid}`)
            .delete()
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
      });
    });
  }
}
