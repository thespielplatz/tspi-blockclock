<template>
  <div class="grid place-items-center text-center min-h-screen">
    <div v-if="connecting">
      <HeadlineDefault level="h1">
        Blocktris
      </HeadlineDefault>
      <p>by <a href="https://satoshiengineering.com" target="_blank">Satoshi Engineering</a></p>
    </div>
    <div v-else-if="!connected">
      <p>Blockclock offline :-(</p>
    </div>
    <div
      class="game-grid grid min-h-screen w-full"
      v-else
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
        @click="down()"
      >DOWN</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

import HeadlineDefault from '@/components/typography/HeadlineDefault.vue'
import SocketGames from '@/modules/SocketGames'
import { BACKEND_ORIGIN } from '@/constants'

const connecting = ref(true)
const connected = ref(false)

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
</script>

<style>
.game-grid {
  grid-template-columns: 50% 50%;
  grid-template-rows: 30% 2fr 3fr 2fr;
  grid-template-areas: "header header" "turn turn" "left right" "down down";
}
</style>
