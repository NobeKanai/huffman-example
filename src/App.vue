<template>
  <div>
    <ul>
      <li>
        <input
          type="text"
          v-model="rawContent"
          placeholder="Raw content"
        >
      </li>
      <li>
        Real: '{{ realContent }}'
      </li>
      <li>
        <p>Freq table</p>
        <table>
          <tr>
            <td
              v-for="(freq, index) in frequency"
              :key="index"
            >{{freq[0]}}</td>
          </tr>
          <tr>
            <td
              v-for="(freq , index) in frequency"
              :key="index"
            >{{freq[1]}}</td>
          </tr>
        </table>
      </li>
      <li>
        <p>Huffman Table</p>
        <table>
          <tr>
            <td
              v-for="k in orderedCodes.keys()"
              :key="k"
            >{{k}}</td>
          </tr>
          <tr>
            <td
              v-for="v in orderedCodes.values()"
              :key="v"
            >{{v}}</td>
          </tr>
        </table>
      </li>
      <li>
        Encoded: {{ encodedText }}
      </li>
      <li>
        <input
          type="text"
          placeholder="need decode use above table"
          v-model="needsDecode"
        >
      </li>
      <li>
        Decoded: {{ decodedText }}
      </li>
    </ul>
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
    };
  },
  computed: {
    realContent(): string {
      // 根据规则计算出真实字符串
      // @ 清除前面的所有内容， # 删除上一个字符
      const tempCharList: Array<string> = [];
      for (const char of this.rawContent) {
        if (char === "@") tempCharList.splice(0, tempCharList.length);
        else if (char === "#") tempCharList.pop();
        else tempCharList.push(char);
      }
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
});
</script>

<style lang="scss">
</style>
