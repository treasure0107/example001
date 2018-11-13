<template>
  <transition name="rotate-fall">
    <div>
      <IndexHeader></IndexHeader>
      <div class="content">
        <LeftNav></LeftNav>
        <div class="container">
          <v-tags></v-tags>
          <!--<router-view/>-->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/babel">
  import LeftNav from "@/components/LeftNav";
  import IndexHeader from "@/components/Header";
  import vTags from "@/components/Tags";
  import bus from "@/assets/bus";
  import 'vue-transition.css'
  export default {
    data(){
      return {
        tagsListArr: []
      }

    },
    created(){

      // 即关闭标签之后就不保存到内存中了
//      bus.$on('newVal', msg => {
//        let arr = [];
//        for (let i = 0, len = msg.length; i < len; i++) {
//          msg[i].name && arr.push(msg[i].name);
//        }
//        this.tagsListArr = arr;
//      })
    },
    mounted(){

    },
    methods: {},
    components: {
      LeftNav,
      IndexHeader,
      vTags
    }
  }

</script>

<style lang="scss">
  .content {
    background: rgb(228, 230, 233);
    width: 100%;
    display: flex
  }

  .container {
    flex: 1;
    padding: 15px;
    background: rgb(228, 230, 233)
  }

  .el-menu {
    border-right: 0;
  }

  .panel {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
  }

  .panel-heading {
    border-bottom: 1px solid transparent;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    border-color: #eff2f7;
    font-size: 16px;
    font-weight: 300;
    padding: 10px 15px;
  }
</style>
