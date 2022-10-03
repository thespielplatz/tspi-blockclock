<template>
  <div class="flex flex-col place-items-center text-center min-h-screen">
    <HeadlineDefault
      class="pt-3"
      level="h1"
    >
      Blocktris
    </HeadlineDefault>
    <p v-if="username != null">Playing as {{ username }}</p>
    <p v-else-if="playingAsGuest">Playing as guest</p>
    <div v-if="connecting">
      <p>by <a href="https://satoshiengineering.com" target="_blank">Satoshi Engineering</a></p>
    </div>
    <div v-else-if="!connected">
      <p>Blockclock offline :-(</p>
    </div>
    <div
      v-else-if="authKey == null && lnurlEncoded != null"
      class="flex-1 grid place-items-center"
    >
      <a
        v-if="!authenticating"
        class="bg-grey p-3"
        :href="`lightning:${lnurlEncoded}`"
      >Open wallet to authenticate</a>
    </div>
    <div
      v-else-if="authKey == null"
      class="flex-1 grid place-items-center"
    >
      <button
        class="bg-grey p-3"
        @click="createLnurlAuth()"
        @disabled="authenticating"
      >Login via LNURL-auth</button>
    </div>
    <div
      v-else-if="username == null && !playingAsGuest"
      class="flex-1 grid place-items-center"
    >
      <p v-if="checkingUsername || settingUsername">Loading ...</p>
      <div v-else>
        <input
          v-model="newUsername"
          type="text"
          class="w-full border my-1 px-3 py-2 focus:outline-none"
          placeholder="Your name"
          :disabled="settingUsername"
        >
        <button
          class="bg-grey p-3"
          :disabled="settingUsername"
          @click="setUsername"
        >Set my name</button>
        <br>
        OR
        <br>
        <button
          class="bg-grey p-3"
          @click="playAsGuest"
        >Play as guest</button>
      </div>
    </div>
    <div
      class="game-grid grid min-h-screen w-full"
      v-else-if="playing"
    >
      <HeadlineDefault
        class="[grid-area:header]"
        level="h1"
      >let's play</HeadlineDefault>
      <button
        class="[grid-area:turn] bg-controls border border-white"
        @click="turn()"
      >TURN</button>
      <button
        class="[grid-area:left] bg-controls border border-white"
        @click="left()"
      >LEFT</button>
      <button
        class="[grid-area:right] bg-controls border border-white"
        @click="right()"
      >RIGHT</button>
      <button
        class="[grid-area:down] bg-controls border border-white"
        @mousedown="downPressed()"
        @mouseup="downReleased()"
      >DOWN</button>
    </div>
    <div
      v-else
      class="flex-1 grid place-items-center"
    >
      <button
        class="bg-grey p-3"
        @click="play()"
      >Play</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onBeforeMount, ref } from 'vue'

import HeadlineDefault from '@/components/typography/HeadlineDefault.vue'
import SocketGames from '@/modules/SocketGames'
import { BACKEND_ORIGIN } from '@/constants'

/////
// AUTH
const authenticating = ref(false)
const lnurlHash = ref<string>()
const lnurlEncoded = ref<string>()
const authKey = ref<string>()
const checkingUsername = ref(false)
const username = ref<string>()
const newUsername = ref<string>()
const settingUsername = ref(false)
const playingAsGuest = ref(false)

const resetAuth = () => {
  authenticating.value = false
  lnurlHash.value = undefined
  lnurlEncoded.value = undefined
  authKey.value = undefined
  checkingUsername.value = false
  username.value = undefined
  newUsername.value = undefined
  settingUsername.value = false
  playingAsGuest.value = false
}

const createLnurlAuth = async () => {
  authenticating.value = true
  const response = await axios.get('https://lnurl.sate.tools/api/lnurl/create')
  lnurlHash.value = response.data.data.hash
  lnurlEncoded.value = response.data.data.encoded
  authenticating.value = false
}

onBeforeMount(() => {
  document.addEventListener('visibilitychange', async (event) => {
    if (
      document.visibilityState !== 'visible'
      || lnurlHash.value == null
      || authKey.value != null
      || authenticating.value
    ) {
      return
    }
    authenticating.value = true
    try {
      const response = await axios.get(`https://lnurl.sate.tools/api/lnurl/status/${lnurlHash.value}`)
      if (response.data.status === 'success') {
        authKey.value = response.data.data
        authenticating.value = false
        checkUsername()
        return
      }
    } catch (error) {}
    resetAuth()
  })
})

const checkUsername = async () => {
  checkingUsername.value = true
  try {
    const response = await axios.get(`https://n8n.sate.tools/webhook/45c135b7-b708-44ca-86cd-e057834b0a20/blocktris/user/${authKey.value}`)
    username.value = response.data.Name
  } catch (error) {}
  checkingUsername.value = false
}

const setUsername = async () => {
  if (
    authKey.value == null
    || newUsername.value == null
    || newUsername.value.length === 0
  ) {
    return
  }
  settingUsername.value = true
  const url = `https://n8n.sate.tools/webhook/blocktris/user`
  const formdata = new FormData()
  formdata.append('key', authKey.value)
  formdata.append('name', newUsername.value)
  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  }
  await fetch(url, requestOptions as any)
  username.value = newUsername.value
  settingUsername.value = false
}

const playAsGuest = () => {
  playingAsGuest.value = true
}

/////
// SOCKET GAMES SERVER
const connecting = ref(true)
const connected = ref(false)
const playing = ref(false)

let socketGames: SocketGames
onBeforeMount(() => {
  socketGames = new SocketGames({
    url: BACKEND_ORIGIN,
    screenId: 'tspi-blockclock',
    onConnect(data) {
      connected.value = true
      connecting.value = false
    },
    onError(error) {
      connecting.value = false
      console.error('onError', error)
    }
  })
})


const play = () => {
  socketGames.emit('play')
}
const turn = () => {
  socketGames.emit('turn')
}
const left = () => {
  socketGames.emit('left')
}
const right = () => {
  socketGames.emit('right')
}
const downPressed = () => {
  socketGames.emit('down-pressed')
}
const downReleased = () => {
  socketGames.emit('down-released')
}
</script>

<style>
.game-grid {
  grid-template-columns: 50% 50%;
  grid-template-rows: 30% 2fr 3fr 2fr;
  grid-template-areas: "header header" "turn turn" "left right" "down down";
}
</style>
