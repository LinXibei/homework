<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
  <div :class="$style.logo">haha</div>
  <label>{{t("language")}}</label>
  <select v-model="locale">
    <option value="en">en</option>
    <option value="cn">cn</option>
  </select>
  <p>{{t("hello")}}</p>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import {getCurrentInstance, ref, computed} from "vue"
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
const ins = getCurrentInstance()
function useI18n() {
  const locale = ref("cn")
  // 获取资源信息
  const i18n = ins.type.i18n
  const t = msg => {
    return computed(() => i18n[locale.value][msg]).value
  }
  return { locale, t }
}
const { locale, t } = useI18n()
</script>
<i18n>
{
  "en": {
    "language": "Language",
    "hello": "hello, world"
  },
  "cn": {
    "language": "语言",
    "hello": "你好世界"
  }
}
</i18n>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style module>
.logo {
  background: url(./assets/logo.png);
  width: 100px;
  height: 100px;
}
</style>