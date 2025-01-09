const { initializeApp } = require('firebase/app')
const { getDatabase, ref, set, get, update, remove } = require('firebase/database')

const firebaseConfig = {
  databaseURL: 'https://panadero-area51-default-rtdb.asia-southeast1.firebasedatabase.app/'
}

let db

const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig)
  db = getDatabase(app)
}

const writeData = async (path, data) => {
  await set(ref(db, path), data)
}

const readData = async (path) => {
  const snapshot = await get(ref(db, path))
  if (snapshot.exists()) {
    return snapshot.val()
  }
  return null
}

const updateData = async (path, data) => {
  await update(ref(db, path), data)
}

const deleteData = async (path) => {
  await remove(ref(db, path))
}

module.exports = {
  initializeFirebase,
  writeData,
  readData,
  updateData,
  deleteData
}
