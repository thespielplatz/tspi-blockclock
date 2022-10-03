<template>
  <div class="flex flex-col place-items-center text-center min-h-screen bg-grey text-white">
    <HeadlineDefault
      class="pt-3"
      level="h1"
    >
      <img
        class="inline-block w-6 mt-[-8px]"
        src="@/assets/img/tetris.png"
      />
      BLOCKTRIS
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
        class="cta py-3 px-5 rounded-full font-bold"
        :href="`lightning:${lnurlEncoded}`"
      >Open wallet to authenticate</a>
    </div>
    <div
      v-else-if="authKey == null"
      class="flex-1 grid place-items-center"
    >
      <button
        class="cta py-3 px-5 rounded-full font-bold"
        @click="createLnurlAuth()"
        @disabled="authenticating"
      >Login via LNURL-auth</button>
    </div>
    <div
      v-else-if="username == null && !playingAsGuest"
      class="flex-1 grid place-items-center p-5"
    >
      <p v-if="checkingUsername || settingUsername">Loading ...</p>
      <div v-else>
        <input
          v-model="newUsername"
          type="text"
          class="w-full border mb-3 px-3 py-2 focus:outline-none text-black"
          placeholder="Your name"
          :disabled="settingUsername"
        >
        <button
          class="cta mb-16 py-3 px-5 rounded-full font-bold"
          :disabled="settingUsername"
          @click="setUsername"
        >Set my name</button>
        <span class="block mb-3">OR</span>
        <button
          class="py-3 px-5 rounded-full bg-purple font-bold"
          @click="playAsGuest"
        >Play as guest</button>
      </div>
    </div>
    <div
      class="flex-1 game-grid grid w-full"
      v-else-if="playing"
    >
      <div class="[grid-area:header] pt-5">
        <HeadlineDefault
          level="h2"
        >
        <img
          class="inline-block w-6 mt-[-8px]"
          src="@/assets/img/clock.png"
        /> {{ timeElapsed }}
        </HeadlineDefault>
        <HeadlineDefault
          level="h2"
        >
        <img
          class="inline-block w-6 mt-[-6px]"
          src="@/assets/img/trophy.png"
        /> {{ score }}
        </HeadlineDefault>
      </div>
      <div
        v-if="gameOver"
        class="[grid-area:turn]"
      >
        <button
          class="cta mb-16 py-3 px-5 rounded-full font-bold"
          @click="playAgain"
        >Play again</button>
      </div>
      <button
        v-if="!gameOver"
        class="[grid-area:turn] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="turn()"
      >TURN</button>
      <button
        v-if="!gameOver"
        class="[grid-area:left] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="left()"
      >LEFT</button>
      <button
        v-if="!gameOver"
        class="[grid-area:right] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="right()"
      >RIGHT</button>
      <button
        v-if="!gameOver"
        class="[grid-area:down] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="down()"
      >DOWN</button>
    </div>
    <div
      v-else
      class="flex-1 grid place-items-center"
    >
      <button
        class="cta py-3 px-5 rounded-full font-bold"
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
const score = ref(0)
const timeStart = ref<number>()
const timeElapsed = ref<string>()
const gameOver = ref(false)

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

  socketGames.on('start', () => {
    playing.value = true
    timeStart.value = Math.floor(+ new Date() / 1000)
  })

  socketGames.on('game-update', ({ score: scoreLocal }: { score: number }) => {
    score.value = scoreLocal
  })
  socketGames.on('game-over', ({ score: scoreLocal }: { score: number }) => {
    score.value = scoreLocal
    gameOver.value = true
  })
})

const play = () => {
  socketGames.emit('play', { key: authKey.value, name: username.value })
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
const down = () => {
  socketGames.emit('down')
}

const updateTimer = () => {
  setTimeout(updateTimer, 100)
  if (gameOver.value) {
    return
  }
  if (timeStart.value == null) {
    timeElapsed.value = undefined
    return
  }
  const total = Math.floor(+ new Date() / 1000) - timeStart.value
  const minutes = String(Math.floor(total / 60)).padStart(2, '0')
  const seconds = String(total % 60).padStart(2, '0')
  timeElapsed.value = `${minutes}:${seconds}` 
}
updateTimer()

const playAgain = () => {
  playing.value = false
  score.value = 0
  timeStart.value = undefined
  timeElapsed.value = undefined
  gameOver.value = false
  play()
}
</script>

<style>
.game-grid {
  grid-template-columns: 50% 50%;
  grid-template-rows: 30% 2fr 3fr 2fr;
  grid-template-areas: "header header" "turn turn" "left right" "down down";
}

.cta {
  background-image: linear-gradient(-45deg, rgb(107, 61, 145) 0%, rgb(174, 39, 143) 32%, rgb(231, 0, 117) 64%, rgb(236, 0, 108) 70%, rgb(248, 1, 82) 80%, rgb(255, 1, 67) 85%, rgb(255, 11, 57) 88%, rgb(255, 39, 31) 94%, rgb(255, 71, 0) 100%);
}
</style>
