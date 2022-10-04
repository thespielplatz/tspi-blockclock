<template>
  <img
    v-if="piece === PIECE_STRAIGHT"
    src="@/assets/img/piece_straight.png"
    :class="class"
  />
  <img
    v-if="piece === PIECE_L"
    src="@/assets/img/piece_l.png"
    :class="class"
  />
  <img
    v-if="piece === PIECE_L_FLIPPED"
    src="@/assets/img/piece_l_flipped.png"
    :class="class"
  />
  <img
    v-if="piece === PIECE_SKEW"
    src="@/assets/img/piece_skew.png"
    :class="class"
  />
  <img
    v-if="piece === PIECE_SKEW_FLIPPED"
    src="@/assets/img/piece_skew_flipped.png"
    :class="class"
  />
  <img
    v-if="piece === PIECE_SQUARE"
    src="@/assets/img/piece_square.png"
    :class="class"
  />
  <img
    v-if="piece === PIECE_T"
    src="@/assets/img/piece_t.png"
    :class="class"
  />
</template>

<script setup lang="ts">
const PIECE_STRAIGHT = 0
const PIECE_L_FLIPPED = 1
const PIECE_L = 2
const PIECE_SQUARE = 3
const PIECE_SKEW = 4
const PIECE_T = 5
const PIECE_SKEW_FLIPPED = 6

defineProps({
  class: {
    type: String,
    default: null,
  },
  piece: {
    type: Number,
    default: null,
  },
})
</script>
