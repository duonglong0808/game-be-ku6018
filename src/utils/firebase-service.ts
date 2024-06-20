import { Injectable } from '@nestjs/common';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

@Injectable()
export class FirebaseService {
  constructor(@InjectFirebaseAdmin() private readonly firebaseAdmin: FirebaseAdmin) {}

  async uploadImageToStorage(fileLocal: Express.Multer.File, collectionName: string): Promise<string> {
    try {
      const imageData = fs.readFileSync(fileLocal.path);
      const storage = this.firebaseAdmin.storage;
      const bucket = storage.bucket(); // Use the default Firebase Storage bucket

      const uniqueFileName = `${Date.now()}-${fileLocal.originalname}`;
      const file = bucket.file(`${collectionName}/${uniqueFileName}`);

      await file.save(imageData);

      // Get the public URL of the uploaded image
      const [url] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' }); // Adjust the expiration date as needed

      return url;
    } catch (error) {
      console.log('🚀 ~ file: firebase-service.ts:29 ~ FirebaseService ~ uploadImageToStorage ~ error:', error);
    } finally {
      fs.unlinkSync(fileLocal.path);
    }
  }

  async uploadFileToStorage(fileLocal: Express.Multer.File, collectionName: string): Promise<string> {
    try {
      const imageData = fs.readFileSync(fileLocal.path);
      const storage = this.firebaseAdmin.storage;
      const bucket = storage.bucket(); // Use the default Firebase Storage bucket

      const uniqueFileName = `${Date.now()}-${fileLocal.originalname}`;
      const file = bucket.file(`${collectionName}/${uniqueFileName}`);

      // await file.save(fileLocal.buffer);
      await file.save(imageData);

      // Get the public URL of the uploaded image
      const [url] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' }); // Adjust the expiration date as needed

      //

      return url;
    } catch (error) {
      console.log('🚀 ~ file: firebase-service.ts:29 ~ FirebaseService ~ uploadImageToStorage ~ error:', error);
    } finally {
      fs.unlinkSync(fileLocal.path);
    }
  }
}
