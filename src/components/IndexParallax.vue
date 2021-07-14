<template>
  <q-parallax style="height: 280px">
    <template v-slot:content="scope">
      <div class="absolute column items-center"
           :style="{
               opacity: 0.45 + (1 - scope.percentScrolled) * 0.55,
               top: (scope.percentScrolled * 60) + '%',
               left: 0,
               right: 0
             }">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div style="margin: 0 auto; width: 100%; max-width: 360px">
              <div>
                <img src="img/logo-left.png" style="width: 19.75%" />
                <img src="img/logo-right.png" style="margin-left: 2%; width: 78.25%" />
              </div>
            </div>
          </div>
          <div class="col-12 text-body text-bold text-white text-center">
            {{ $t('index.subtitle') }}
          </div>
        </div>
      </div>
    </template>
  </q-parallax>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexParallax'
});
</script>

<style scoped>

</style>
