<template>
  <div class="p-question-base">
    <div class="main-container">
      <nav class="main-nav">
        <nuxt-link to="/question">问答</nuxt-link>
        <nuxt-link to="/question/topic">专题</nuxt-link>
      </nav>
      <main>
        <nuxt-child />
      </main>
    </div>

    <aside class="right-container">
      <SideWidget key="question-create">
        <div class="question-container">
          <nuxt-link to="/question/create">
            <IButton
              type="primary"
              :long="true"
              size="large"
              shape="circle"
            >
              <svg class="icon"><use xlink:href="#icon-publish" /></svg>
              提问
            </IButton>
          </nuxt-link>
        </div>
      </SideWidget>

      <SideWidgetHotQuestions key="hot-questions" />
    </aside>
  </div>
</template>

<script>
import SideWidget from '@/components/common/SideWidget.vue'
import SideWidgetHotQuestions from '@/components/question/SideWidgetHotQuestions.vue'

export default {
  name: 'QuestionBase',
  components: {
    SideWidget,
    SideWidgetHotQuestions,
  },
}
</script>

<style lang="less" scoped>
.p-question-base {
  display: flex;

  .main-container {
    flex: auto;
    margin-right: 30px;

    .main-nav {
      padding: 30px;
      margin-bottom: 30px;
      background-color: #fff;

      > a {
        margin-right: 30px;
        color: @disabled-color;

        &.exact-active {
          color: @text-color;
        }
      }
    }
  }

  .right-container {
    flex: none;
    width: @sidebar-width;

    .question-container {
      padding: 30px;
      background-color: #fff;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
