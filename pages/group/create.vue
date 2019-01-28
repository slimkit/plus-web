<template>
  <div class="p-group-create">
    <h1>创建圈子</h1>
    <hr>

    <IForm :label-width="80" @submit.native.prevent="onSubmit">
      <figure class="avatar-wrap" @click="$refs.uploader.select()">
        <div class="avatar-src" :style="{backgroundImage: `url(${avatar.preview})`}" />

        <Uploader ref="uploader" v-model="avatar" />

        <figcaption>
          <svg class="icon xl"><use xlink:href="#icon-ico_upload" /></svg>
          上传圈子头像
        </figcaption>
      </figure>

      <IFormItem label="圈子名称">
        <IInput v-model="form.name" placeholder="最多20个字" />
      </IFormItem>

      <IFormItem label="圈子简介">
        <IInput
          v-model="form.name"
          type="textarea"
          :rows="3"
          placeholder="最多255个字"
        />
      </IFormItem>

      <IFormItem label="圈子分类">
        <ISelect
          v-model="category"
          filterable
          class="category-selector"
          :transfer="true"
        >
          <IOption
            v-for="cate in categories"
            :key="cate.id"
            :value="cate.id"
          >
            {{ cate.name }}
          </IOption>
        </ISelect>
      </IFormItem>
    </IForm>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'GroupCreate',
  data: function () {
    return {
      avatar: {},
      category: 0,
      form: {
        name: '',
      },
    }
  },
  computed: {
    ...mapState('group', {
      categories: 'category',
    }),
  },
  created () {
    this.loadFromStorage()
    this.getGroupCategories()
  },
  methods: {
    ...mapMutations('group', {
      loadFromStorage: 'LOAD_FROM_STORAGE',
    }),
    ...mapActions('group', {
      getGroupCategories: 'getGroupCategories',
    }),
    onSubmit () {},
  },
}
</script>

<style lang="less" scoped>
.p-group-create {
  padding: 30px;
  background-color: #fff;

  .avatar-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    color: @disabled-color;
    cursor: pointer;

    .avatar-src {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent center / cover no-repeat;
      z-index: 1;
    }

    figcaption {
      position: absolute;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border: 1px dashed @border-color-base;
    }
  }

  .ivu-form-item {
    margin-top: 24px;
  }

  .category-selector {
    width: 12em;
  }
}
</style>
