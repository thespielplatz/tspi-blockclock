<template>
  <div class="flex flex-col items-stretch text-center min-h-screen bg-grey text-white">
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
    <p v-if="authKey != null">Authenticated via LNURL-auth</p>
    <p v-else-if="playingAsGuest">Playing as guest</p>
    <div
      v-if="!playing"
      class="basis-0 grow overflow-y-scroll m-5"
    >
      <table class="w-full table-fixed">
        <tr
          v-for="(score, index) in highscoresComputed"
          class="border-b-2 last:border-none border-white"
          :class="{ 'font-bold': authKey != null && score.key === authKey }"
        >
          <td class="w-6">{{ index + 1 }}.</td>
          <td class="w-16 px-2 text-right">{{ score.score }}</td>
          <td class="px-2 text-left">{{ score.name }}<span v-if="authKey != null && score.key === authKey"> ⚡</span></td>
        </tr>
      </table>
    </div>
    <div v-if="connecting">
      <p>by <a href="https://satoshiengineering.com" target="_blank">Satoshi Engineering</a></p>
    </div>
    <div v-else-if="!connected">
      <p>Blockclock offline :-(</p>
    </div>
    <div
      v-else-if="authKey == null && !playingAsGuest"
      class="flex flex-col justify-center place-items-center m-5"
    >
      <a
        v-if="lnurlEncoded != null && !authenticating"
        class="cta block mb-12 py-3 px-5 rounded-full font-bold"
        :href="`lightning:${lnurlEncoded}`"
      >Open wallet to authenticate</a>
      <button
        v-else-if="lnurlEncoded == null"
        class="cta block mb-12 py-3 px-5 rounded-full font-bold"
        :disabled="authenticating"
        @click="createLnurlAuth()"
      >Login via LNURL-auth</button>
      <span class="block mb-3">OR</span>
      <button
        class="py-3 px-5 rounded-full bg-purple font-bold"
        @click="playAsGuest"
      >Play as guest</button>
    </div>
    <div
      v-else-if="gameOver"
      class="flex-1 gameover-grid grid w-full"
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
        v-if="playingAsGuest"
        class="[grid-area:play-again]"
      >
        <button
          class="cta py-3 px-5 rounded-full font-bold"
          @click="playAgain"
        >Play again</button>
      </div>
      <p
        v-else-if="pushingScore"
        class="[grid-area:play-again]"
      >Loading ...</p>
      <div
        v-else
        class="[grid-area:play-again] p-3"
      >
        <input
          v-model="username"
          type="text"
          class="w-full border mb-3 px-3 py-2 focus:outline-none text-black"
          placeholder="Your name"
          :disabled="pushingScore"
        >
        <button
          class="cta mb-12 py-3 px-5 rounded-full font-bold"
          :disabled="pushingScore"
          @click="pushScore"
        >Push my score</button>
        <span class="block mb-3">OR</span>
        <button
        class="py-3 px-5 rounded-full bg-purple font-bold"
          @click="playAgain"
        >Play again</button>
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
      <button
        class="[grid-area:turn] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="turn()"
      >TURN</button>
      <button
        class="[grid-area:left] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="left()"
      >LEFT</button>
      <button
        class="[grid-area:right] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="right()"
      >RIGHT</button>
      <button
        class="[grid-area:down] bg-controls border-4 border-grey font-bold text-4xl text-controls-text"
        @click="down()"
      >DOWN</button>
    </div>
    <div
      v-else
      class="m-5 grid place-items-center"
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
import { computed, onBeforeMount, ref } from 'vue'

import HeadlineDefault from '@/components/typography/HeadlineDefault.vue'
import SocketGames from '@/modules/SocketGames'
import { BACKEND_ORIGIN } from '@/constants'

/////
// AUTH
const authenticating = ref(false)
const lnurlHash = ref<string>()
const lnurlEncoded = ref<string>()
const authKey = ref<string>()
const checkingHighscores = ref(false)
const playingAsGuest = ref(false)

const resetAuth = () => {
  authenticating.value = false
  lnurlHash.value = undefined
  lnurlEncoded.value = undefined
  authKey.value = undefined
  checkingHighscores.value = false
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
        return
      }
    } catch (error) {}
    resetAuth()
  })
})

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
const username = ref<string>()
const pushingScore = ref(false)
const highscores = ref<{ key?: string, name?: string, score?: number }[]>([])

const highscoresComputed = computed(() => {
  const highscoresLocal = [...highscores.value]
  for (let i = highscores.value.length; i < 25; i += 1) {
    highscoresLocal.push({})
  }
  return highscoresLocal
})

const playAgain = () => {
  playing.value = false
  score.value = 0
  timeStart.value = undefined
  timeElapsed.value = undefined
  gameOver.value = false
  username.value = undefined
  pushingScore.value = false
  play()
}

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
    timeStart.value = Math.floor(+new Date() / 1000)
  })

  socketGames.on('game-update', ({score: scoreLocal}: { score: number }) => {
    score.value = scoreLocal
  })
  socketGames.on('game-over', ({score: scoreLocal}: { score: number }) => {
    score.value = scoreLocal
    gameOver.value = true
  })

  checkHighscores()
})

const play = () => {
  checkHighscores()
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

const checkHighscores = async () => {
  checkingHighscores.value = true
  try {
    const response = await axios.get(`https://n8n.sate.tools/webhook/blocktris/highscores`)
    highscores.value = response.data.list
      .map(({ Key, Name, Score }: { Key: string, Name: string, Score: number }) => ({ key: Key, name: Name, score: Score }))
  } catch (error) {}
  checkingHighscores.value = false
}

const pushScore = async () => {
  if (
    authKey.value == null
    || score.value === 0
  ) {
    playAgain()
    return
  }
  pushingScore.value = true
  const url = `https://n8n.sate.tools/webhook/blocktris/score`
  const formdata = new FormData()
  formdata.append('key', authKey.value)
  formdata.append('name', (username.value == null || username.value.length === 0) ? 'Unknown' : username.value)
  formdata.append('score', String(score.value))
  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  }
  await fetch(url, requestOptions as any)
  pushingScore.value = false
  playAgain()
}
</script>

<style>
.game-grid {
  grid-template-columns: 50% 50%;
  grid-template-rows: 30% 2fr 3fr 2fr;
  grid-template-areas: "header header" "turn turn" "left right" "down down";
}

.gameover-grid {
  grid-template-rows: 30% auto;
  grid-template-areas: "header" "play-again";
}

.cta {
  background-image: linear-gradient(-45deg, rgb(107, 61, 145) 0%, rgb(174, 39, 143) 32%, rgb(231, 0, 117) 64%, rgb(236, 0, 108) 70%, rgb(248, 1, 82) 80%, rgb(255, 1, 67) 85%, rgb(255, 11, 57) 88%, rgb(255, 39, 31) 94%, rgb(255, 71, 0) 100%);
}
</style>
