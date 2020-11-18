<template>
  <!-- modal -->
  <div
    v-if="modalShow"
    class="w-screen h-screen fixed z-10 flex items-center justify-center"
    @click.self="modalShow = false"
  >
    <div
      class="w-10/12 md:w-1/2 flex flex-col overflow-hidden"
      style="max-width: 95%; height: 50vh;"
    >
      <textarea
        v-model="needsDecode"
        rows="3"
        placeholder="Exa: 10010100101"
        class="bg-gray-300 overflow-hidden flex-1"
      ></textarea>
      <textarea
        v-model="decodedText"
        readonly
        rows="3"
        class="bg-gray-300 overflow-hidden flex-1"
      ></textarea>
    </div>
  </div>

  <div class="mx-4 md:mx-20 lg:mx-64 flex flex-col mb-8">
    <h1 class="text-center text-3xl mt-2 mb-4">Raw to Real</h1>
    <div class="flex -mx-1">
      <textarea
        class="w-1/2 bg-gray-300 mx-1 p-4 overflow-hidden"
        cols="30"
        rows="4"
        placeholder="Raw content"
        v-model="rawContent"
      ></textarea>
      <textarea
        disabled
        class="w-1/2 bg-gray-300 mx-1 p-4 overflow-hidden"
        cols="30"
        rows="4"
        placeholder=""
        v-model="realContent"
      ></textarea>
    </div>
    <h1 class="text-center text-3xl mt-2 mb-4">Frequency Table</h1>
    <transition-group
      tag="div"
      class="flex flex-wrap -mx-1"
      move-class="transition-transform duration-300 ease-linear"
    >
      <div
        class="flex flex-col border-black border flex-1"
        v-for="freq in frequency"
        :key="freq[0]"
      >
        <div class="px-8 py-2 text-center">{{ rawChar(freq[0])}}</div>
        <hr class="border-t-4 border-gray-400">
        <div class="px-8 py-2 text-center">{{ freq[1] }}</div>
      </div>
    </transition-group>
    <h1 class="text-center text-3xl mt-2 mb-4">Huffman Table</h1>
    <transition-group
      tag="div"
      class="flex flex-wrap -mx-1"
      move-class="transition-transform duration-300 ease-linear"
    >
      <div
        class="flex flex-col border-black border flex-1"
        v-for="k in orderedCodes.keys()"
        :key="k"
      >
        <div class="px-8 py-2 text-center">{{ rawChar(k) }}</div>
        <hr class="border-t-4 border-gray-400">
        <div class="px-8 py-2 text-center">{{ orderedCodes.get(k) }}</div>
      </div>
    </transition-group>
    <div class="text-center mt-8">
      <button
        @click="modalShow = true"
        class="border rounded-full px-4 py-2 border-black hover:bg-black hover:text-white transition-colors duration-300"
      >START ENCODE/ENCODE</button>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import { decode, encode, getCodesFromText, getFrequency } from "./huffman";

export default defineComponent({
  name: "App",
  data() {
    return {
      rawContent: "",
      needsDecode: "",
      modalShow: false,
    };
  },
  computed: {
    realContent(): string {
      // 根据规则计算出真实字符串
      // @ 清除前面的所有内容， # 删除上一个字符
      const tempCharList: Array<string> = [];
      this.rawContent.split("").forEach((char) => {
        if (char === "@") {
          const lastIndexOfReturn = tempCharList.lastIndexOf("\n") + 1;
          tempCharList.splice(
            lastIndexOfReturn,
            tempCharList.length - lastIndexOfReturn
          );
        } else if (char === "#") tempCharList.pop();
        else tempCharList.push(char);
      });
      return tempCharList.join("");
    },
    frequency(): [string, number][] {
      return getFrequency(this.realContent);
    },
    codes(): Map<string, string> {
      return getCodesFromText(this.realContent);
    },
    encodedText(): string {
      return encode(this.realContent, this.codes);
    },
    decodedText(): string {
      return decode(this.needsDecode, this.codes);
    },
    orderedCodes(): Map<string, string> {
      const oc: Map<string, string> = new Map();
      let freq: [string, number];
      for (freq of this.frequency) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        oc.set(freq[0], this.codes.get(freq[0])!);
      }
      return oc;
    },
  },
  methods: {
    rawChar(char: string): string {
      return char
        .replace("\n", "\\n")
        .replace("\t", "\\t")
        .replace(" ", "&nbsp;");
    },
  },
});
</script>

<style lang="scss">
</style>
