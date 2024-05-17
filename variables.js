import 'dotenv/config'

const cooldownMapping = {
  BT0_space_rare_small_0: 72,
  BT0_space_rare_medium_0: 66,
  BT0_space_rare_large_0: 60,
  BT0_space_epic_small_0: 66,
  BT0_space_epic_medium_0: 60,
  BT0_space_epic_large_0: 54,
  BT0_space_legendary_small_0: 60,
  BT0_space_legendary_medium_0: 54,
  BT0_space_legendary_large_0: 48,
  BT0_space_mythic_small_0: 54,
  BT0_space_mythic_medium_0: 48,
  BT0_space_mythic_large_0: 42,
  BT0_space_exalted_small_0: 48,
  BT0_space_exalted_medium_0: 42,
  BT0_space_exalted_large_0: 36,
}

const spaceTypes = Object.keys(cooldownMapping)

const firebaseConfig = {
  apiKey: process.env.FIRE_BASE_APIKEY,
  authDomain: `${process.env.FIRE_BASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIRE_BASE_PROJECT_ID,
  storageBucket: `${process.env.FIRE_BASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIRE_BASE_SENDER_ID,
  appId: process.env.FIRE_BASE_ID,
}

const httpRequestOptions = {
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  headers: {
    authority: 'api.openloot.com',
    accept: '*/*',
    Cookie: process.env.COOKIE,
    'X-Device-Id': process.env.DEVICE_ID,
    'X-Session-Id': process.env.SESSION_ID,
  },
}

export { cooldownMapping, spaceTypes, firebaseConfig, httpRequestOptions }
