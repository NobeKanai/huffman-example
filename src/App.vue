<template>
  <!-- modal -->
  <transition
    enter-from-class="opacity-0"
    enter-active-class="transition-all"
    leave-active-class="transition-all"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modalShow"
      class="w-screen h-screen fixed z-10 flex items-center justify-center bg-black  bg-opacity-75"
      @click.self="modalShow = false"
    >
      <div
        class="w-10/12 md:w-1/2 flex flex-col overflow-hidden rounded-2xl p-4 bg-white space-y-4"
        style="max-width: 95%;"
      >
        <h1 class="text-center text-2xl">Bidirectional Conversion</h1>
        <textarea
          v-model="needsEncode"
          @input="updateNeedsDecode"
          rows="5"
          placeholder="decoded"
          class="bg-gray-300  flex-1 rounded p-2"
        ></textarea>
        <textarea
          v-model="needsDecode"
          @input="updateNeedsEncode"
          rows="5"
          placeholder="encoded"
          class="bg-gray-300  flex-1 rounded p-2"
        ></textarea>
      </div>
    </div>
  </transition>

  <!-- main content -->
  <div class="mx-4 max-w-full">
    <h1 class="text-2xl font-semibold my-4">Huffman Coding</h1>

    <div class="grid grid-cols-2 gap-4">
      <div class="_container">
        <h2 class="text-xl">Encoder</h2>
        <textarea
          rows="3"
          class="w-full border"
          v-model="content"
          @input="computeRealContent"
        ></textarea>

        <button
          @click="modalShow=true"
          class="my-4 border border-yellow-300 w-full py-1 hover:bg-yellow-300 transition duration-300 ease-linear"
        >
          ENCODE/DECODE
        </button>

        <table class="table-auto w-full">
          <thead>
            <tr class="text-left">
              <th class="">Character</th>
              <th class="">Frequency</th>
              <th class="">Code</th>
            </tr>
          </thead>
          <transition-group
            tag="tbody"
            class="transform transition"
            enter-from-class="opacity-0"
            move-class="duration-300 ease-linear"
          >
            <tr
              v-for="[char, num] in huffman.frequency"
              :key="char"
            >
              <td>{{ rawChar(char) }}</td>
              <td>{{ num }}</td>
              <td>{{ huffman.codes.get(char) }}</td>
            </tr>
          </transition-group>
        </table>
      </div>
      <div class="_container">
        <div class="graph">
          {{drawGraph(huffman.rootNode, huffman.frequency.length, huffman.codes)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { drawGraph } from "./graph";
import { decode, encode, getInfoFromText, TreeNode } from "./huffman";

export default defineComponent({
  name: "App",
  data() {
    return {
      content: "",
      needsDecode: "",
      needsEncode: "",
      modalShow: false,
      huffman: {
        frequency: [] as [string, number][],
        codes: {} as Map<string, string>,
        rootNode: {} as TreeNode | undefined,
      },
    };
  },
  computed: {},
  methods: {
    computeRealContent() {
      // 根据规则计算出真实字符串
      // @ 清除前面(换行符后)的所有内容， # 删除上一个字符
      const tempCharList: Array<string> = [];
      this.content.split("").forEach((char) => {
        if (char === "@") {
          const lastIndexOfNewLine = tempCharList.lastIndexOf("\n") + 1;
          tempCharList.splice(
            lastIndexOfNewLine,
            tempCharList.length - lastIndexOfNewLine
          );
        } else if (char === "#") tempCharList.pop();
        else tempCharList.push(char);
      });
      this.content = tempCharList.join("");

      this.getHuffman();
    },
    getHuffman() {
      [
        this.huffman.codes,
        this.huffman.frequency,
        this.huffman.rootNode,
      ] = getInfoFromText(this.content);
    },
    rawChar(char: string): string {
      return char
        .replace("\n", "\\n")
        .replace("\t", "\\t")
        .replace(" ", "Space");
    },
    updateNeedsEncode() {
      this.needsEncode = decode(this.needsDecode, this.huffman.codes);
    },
    updateNeedsDecode() {
      this.needsDecode = encode(this.needsEncode, this.huffman.codes);
    },
    drawGraph: drawGraph,
  },
});
</script>

<style lang="sass">
._container
  @apply rounded p-4
</style>
