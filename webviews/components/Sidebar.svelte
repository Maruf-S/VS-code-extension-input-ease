<script lang="ts">
  import Play from "./Play.svelte";

  let input = "";
  function sendCode() {
    tsvscode.postMessage({
      type: "sendCode",
      value: input,
    });
  }
</script>

<h4>Input</h4>
<textarea rows="5" bind:value={input} />
<button
  class="btn"
  on:click={() => {
    sendCode();
  }}
>
  <Play />
  <span>Run</span>
</button>

<style>
  .btn {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .btn span {
    margin-left: 2px;
  }
</style>
