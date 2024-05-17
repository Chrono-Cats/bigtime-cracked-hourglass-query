import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  setDoc
} from 'firebase/firestore'

import {
  firebaseConfig,
} from '../variables.js'

// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)

class Database {
    constructor() {
      if (firebaseConfig.FIRE_BASE_APIKEY) {
        this.app = initializeApp(firebaseConfig)
        this.db = getFirestore(this.app)
      }
    }

    batchWrite (spaces) {
      const firebasePromises = spaces.map( space =>
        setDoc(doc(db, 'spaces', space.id), space.getDataForFirebase())
      )
      return Promise.all(firebasePromises)
    }
}

export default Database