<template>
  <div class="p-setting-certificate">
    <nav class="nav-wrap">
      <span>{{ typeMap[cert.certification_name] }}</span>
    </nav>

    <div class="certification">
      <div class="item">
        <label>认证状态</label>
        <span>{{ statusMap[cert.status] }}</span>
        <nuxt-link
          v-if="isRejected"
          class="primary-color"
          to="edit"
          append
        >
          重新认证
        </nuxt-link>
      </div>
      <div v-if="isRejected" class="item">
        <label>驳回原因</label>
        <span>{{ cert.data.reject_content }}</span>
      </div>

      <template v-for="(label, field) in labels">
        <div :key="label" class="item">
          <label>{{ label }}</label>
          <span>{{ cert.data[field] }}</span>
        </div>
      </template>

      <div class="item">
        <label>认证资料</label>
        <span>
          <AsyncFile
            v-for="id in cert.data.files"
            :key="id"
            class="image"
            :max-width="200"
            :file="{id}"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>

const typeMap = {
  user: '个人认证',
  org: '机构认证',
}

const statusMap = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

const orgLabels = {
  org_name: '机构名称',
  org_address: '机构地址',
  name: '负责人',
  phone: '负责人电话',
  number: '营业执照号',
  desc: '认证描述',
}

const userLabels = {
  name: '真实姓名',
  number: '身份证号',
  phone: '联系方式',
  desc: '认证描述',
}

export default {
  name: 'SettingCertificate',
  data: function () {
    return {
      typeMap,
      statusMap,
    }
  },
  computed: {
    cert () {
      const { certification } = this.logged
      return certification || {}
    },
    isOrg () {
      return this.cert.certification_name === 'org'
    },
    isRejected () {
      return this.cert.status === 2
    },
    labels () {
      return this.isOrg ? orgLabels : userLabels
    },
  },
  fetch ({ store, redirect }) {
    const { logged } = store.state.user
    const cert = logged.certification
    if (!cert) return redirect('/setting/certificate/apply')
  },
}
</script>

<style lang="less" scoped>
.p-setting-certificate {
  .item {
    display: flex;
    align-items: flex-start;
    margin-top: 20px;

    > label {
      color: @text-info-color;
      margin-right: 1em;
      width: 5em;
      text-align: right;
      vertical-align: top;
    }

    .primary-color {
      margin-left: 1em;
    }

    .image {
      margin-right: 8px;
      vertical-align: top;
    }
  }
}
</style>
