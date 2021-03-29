export default function(options) {
  return {
    name: "my-example",
    resolveId(source) {
      //是否处理当前的请求
      if (source === "virtual-module") {
        return source;
      }
      return null;
    },
    load(id) {
      if (id === "virtual-module") {
        return "export default `this is virtual`"
      }
      return null;
    }
  }
}