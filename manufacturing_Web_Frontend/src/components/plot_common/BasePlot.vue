<template>
  <div>
    <div ref="plot"></div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';
import { useDisplay } from 'vuetify'

export default {
  setup() {
        const { width } = useDisplay()
        return { width }
    },
  props: {
    data: {
      type: Array,
      required: true
    },
    layout: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['selectedLine'],
  mounted() {
    this.drawGraph();
  },
  methods: {
    drawGraph() {
      Plotly.newPlot(this.$refs.plot, this.data, this.layout, this.options).then(() => {
        if (this.layout.autosize) { Plotly.Plots.resize(this.$refs.plot) }
      })
      this.$refs.plot.on('plotly_click', this.handleClick);
    },
    handleClick(eventData) {
      this.$emit('selectedLine', eventData.points[0].curveNumber)
    },
    exportImage() {
      const properties = {
        format: 'png',
        width: this.layout.width ? this.layout.width : this.$refs.plot.offsetWidth ,
        height: this.layout.height ? this.layout.height : this.$refs.plot.offsetHeight
      }
      Plotly.toImage(this.$refs.plot, properties).then(function (url) {
        var link = document.createElement('a');
        link.href = url;
        link.download = 'plot.png';
        link.click();
      });
    },
  },
  beforeUnmount() {
    this.$refs.plot.removeAllListeners('plotly_click');
  },
  watch: {
    data: {
      handler() {
        // this.drawGraph(); // TODO: find why mounted does not work properly?
        Plotly.react(this.$refs.plot, this.data, this.layout, this.options).then(() => {
          if (this.layout.autosize) { Plotly.Plots.resize(this.$refs.plot) }
        })
      },
      deep: true
    },
    layout: {
      handler() {
        Plotly.react(this.$refs.plot, this.data, this.layout, this.options).then(() => {
          if (this.layout.autosize) { Plotly.Plots.resize(this.$refs.plot) }
        })
      },
      deep: true
    },
    width: {
      handler() {
        if (this.layout.autosize) { Plotly.Plots.resize(this.$refs.plot) }
      }
    } 
  }
};
</script>

<style scoped></style>