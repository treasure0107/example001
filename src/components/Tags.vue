<template>
  <div class="main-tags" v-show="showTags">
    <div class="tags" v-if="showTags">
      <ul>
        <li class="tags-li" v-for="(item, index) in tagsListArr" :class="{'active': isActive(item.Url)}" :key="index"
            v-if="index<10">
          <router-link :to="item.Url" class="tags-li-title">
            {{item.label}}
          </router-link>
          <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
        </li>
      </ul>
    </div>
    <div class="more" v-if="tagsListArr.length>=10">
      <el-dropdown>
        <el-button size="mini" type="primary">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in tagsListArr" v-if="index>=10">
            <router-link :to="item.Url" class="tags-li-title">{{item.label}}</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import bus from "@/assets/bus";
  export default {
    data() {
      return {
        tagsList: [],
        tagsListArr: [],
        activeId: ""
      }
    },

    created(){
//      this.tagsListArr = [];
      bus.$on("newVal", msg => {
        let filterArr = this.tagsListArr.filter(e => {
          return e.id == msg.id
        });
        if (filterArr && filterArr.length > 0) {
          return false;
        }
        this.tagsListArr.push(msg);
        if(this.tagsListArr){
          window.localStorage.setItem('arrTagList', JSON.stringify(this.tagsListArr));
        }
      });
      let arrTagList = JSON.parse(window.localStorage.getItem('arrTagList'));
      if(arrTagList){
        arrTagList.filter(item => {
          if (item.Url == this.$route.name) {
            this.tagsListArr.push(item)
          }
        });
      }
      this.setTags(this.$route);
    },
    methods: {
      isActive(path) {
        return path === this.$route.name;
      },
      // 关闭单个标签
      closeTags(index) {
        const delItem = this.tagsListArr.splice(index, 1)[0];
        const item = this.tagsListArr[index] ? this.tagsListArr[index] : this.tagsListArr[index - 1];
        if (item) {
          delItem.Url === this.$route.name && this.$router.push(item.Url);
        } else {
          this.$router.push('/');
        }
      },
      // 关闭全部标签
      closeAll(){
//        this.tagsListArr = [];
//        this.$router.push('/');
      },
      // 关闭其他标签
//      closeOther(){
//        const curItem = this.tagsList.filter(item => {
//          return item.path === this.$route.fullPath;
//        })
//        this.tagsList = curItem;
//      },
      // 设置标签
      setTags(route){
        const isExist = this.tagsList.some(item => {
          return item.path === route.fullPath;
        })
        !isExist && this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          // name: route.matched[1].components.default.name
          name: route.name
        })
        bus.$emit('tags', this.tagsList);
      },
      handleTags(command){
        command === 'other' ? this.closeOther() : this.closeAll();
      }
    },
    computed: {
      showTags() {
        return this.tagsListArr.length > 0;
      }
    },
    watch: {
      $route(newValue, oldValue){
//        this.setTags(newValue);
//        this.isActive(url)
      }
    }
  }

</script>


<style lang="scss">
  $tag_height: 34px; //tab高度变量
  .main-tags {
    width: 100%;
    min-height: 36px;
    position: relative;
    background-color: #fff;
    border-bottom: 6px solid #E4E6E9;
  }

  .tags {
    position: absolute;
    height: $tag_height;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    /*flex: 0 0 auto;*/
    /*width: 300%;*/
  }

  .tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  .more {
    position: absolute;
    right: 30px;
    top: 3px;
  }

  .tags-li {
    float: left;
    margin: 3px 5px 2px 3px;
    border-radius: 3px;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: $tag_height - 8px;
    line-height: $tag_height - 8px;
    border: 1px solid #e9eaec;
    background: #fff;
    padding: 0 5px 0 12px;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all .3s ease-in;
    -moz-transition: all .3s ease-in;
    transition: all .3s ease-in;
  }

  .tags-li:not(.active):hover {
    background: #f8f8f8;
  }

  .tags-li.active {
    color: #fff;
    background-color: #409EFF;
  }

  .tags-li-title {
    float: left;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #666;
  }

  .tags-li.active .tags-li-title {
    color: #fff;
  }

  /*  .tags-close-box {
      position: absolute;
      right: 0;
      top: 0;
      box-sizing: border-box;
      padding-top: 1px;
      text-align: center;
      width: 110px;
      height: $tag_height;
      background: #fff;
      box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
      z-index: 10;
    }*/

</style>
