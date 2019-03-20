<template>
  <div class="c-social-share">
    <no-ssr>
      分享至：
      <div class="social-shares">
        <a href="javascript:;" class="social-share-icon icon-weibo"><svg class="icon lg share-icon" :style="{color: '#f97d72'}"><use xlink:href="#icon-weibo" /></svg></a>
        <a href="javascript:;" class="social-share-icon icon-wechat"><svg class="icon lg share-icon" :style="{color: '#54c58c'}"><use xlink:href="#icon-weixin" /></svg></a>
        <a href="javascript:;" class="social-share-icon icon-qq"><svg class="icon lg share-icon" :style="{color: '#5fbddf'}"><use xlink:href="#icon-qq" /></svg></a>
      </div>
    </no-ssr>
  </div>
</template>

<script>

const socialShareConfig = {
  initialized: true,
  sites: ['qq', 'weibo', 'wechat'], // 启用的站点
  wechatQrcodeTitle: '微信扫一扫：分享', // 微信二维码提示文字
  wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
  weiboKey: process.env.NUXT_ENV_SHARE_WEIBO_KEY || '', // 新浪微博分享 api key（如需显示分享来源）
}

export default {
  name: 'SocialShare',
  props: {
    image: { type: String, default: null }, // 不填则获取首张图片
    title: { type: String, default: null }, // 不填则获取 meta.title
    description: { type: String, default: null }, // 不填则获取 meta.description
  },
  mounted () {
    if (process.client) this.initSocialShare()
  },
  methods: {
    initSocialShare () {
      setTimeout(() => {
        document.querySelector('.social-shares').initialized = false
        const config = { ...socialShareConfig }
        if (this.image !== null) config.image = this.image
        if (this.title !== null) config.title = this.title
        if (this.description !== null) config.description = this.description
        window.socialShare('.social-shares', config)
      }, 100)
    },
  },
}
</script>

<style lang="less">
.c-social-share {
  display: flex;
  align-items: center;

  .social-share {
    display: inline-block;

    .icon-wechat {
      position: relative;
      color: #7bc549;
      border-color: #7bc549;

      .wechat-qrcode {
        display: none;
        border: 1px solid #eee;
        position: absolute;
        z-index: 9;
        top: -205px;
        left: -84px;
        width: 200px;
        height: 192px;
        color: #666;
        font-size: 12px;
        text-align: center;
        background-color: #fff;
        box-shadow: 0 2px 10px #aaa;
        transition: all 200ms;
        -webkit-tansition: all 350ms;
        -moz-transition: all 350ms;

        &::after {
          content: '';
          position: absolute;
          left: 50%;
          margin-left: -6px;
          bottom: -13px;
          width: 0;
          height: 0;
          border-width: 8px 6px 6px 6px;
          border-style: solid;
          border-color: #fff transparent transparent transparent;
        }

        &.bottom {
          top: 40px;
          left: -84px;

          &::after {
            display: none;
          }
        }

        h4 {
          font-weight: normal;
          height: 26px;
          line-height: 26px;
          font-size: 12px;
          background-color: #f3f3f3;
          margin: 0;
          padding: 0;
          color: #777;
        }

        .qrcode {
          width: 105px;
          margin: 10px auto;

          table {
            margin: 0 !important
          }
        }

        .help p {
          font-weight: normal;
          line-height: 16px;
          padding: 0;
          margin: 0
        }
      }
    }

    .icon-wechat:hover .wechat-qrcode {
      display: block;
    }
  }
}
</style>
