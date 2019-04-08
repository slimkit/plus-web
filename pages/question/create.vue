<template>
  <div class="p-question-create">
    <IForm
      ref="form"
      :model="validateModel"
      :rules="validator"
      :label-width="step === 1 ? 0 : 100"
    >
      <div v-if="step === 1" class="step1">
        <h1>提问</h1>
        <IFormItem prop="subject">
          <IInput
            v-model="form.subject"
            placeholder="请输入问题 (必填)"
            size="large"
          />
        </IFormItem>

        <IFormItem prop="topics">
          <Select
            v-model="selectedTopics"
            filterable
            multiple
            placeholder="请选择专题 (必选)"
          >
            <Option
              v-for="topic in topics"
              :key="topic.id"
              :value="topic.id"
              :label="topic.name"
            />
          </Select>
        </IFormItem>

        <IFormItem prop="body">
          <MarkdownEditor v-model="form.body" placeholder="请输入问题描述，支持 Markdown 语法" />
        </IFormItem>

        <IFormItem>
          <ICheckbox
            v-model="form.anonymity"
            :true-value="1"
            :false-value="0"
          >
            匿名提问
          </ICheckbox>
        </IFormItem>

        <IButton
          type="primary"
          :disabled="disabled"
          @click="step = 2"
        >
          下一步
        </IButton>
      </div>

      <div v-if="step === 2" class="step2">
        <h2 class="step2-title">
          设置悬赏<small>(可跳过)</small>
          <a class="rule" @click="showRule">
            <svg class="icon"><use xlink:href="#icon-tag" /></svg>
            悬赏规则
          </a>
        </h2>

        <IFormItem prop="amount" label="设置悬赏金额">
          <IRadioGroup v-model="selectedAmount" type="button">
            <IRadio :label="0">不设置</IRadio>
            <IRadio
              v-for="item in selectAmountItems"
              :key="item"
              :label="item"
            >
              {{ item }}
            </IRadio>
          </IRadioGroup>

          <IInputNumber
            v-model="customAmount"
            class="custom-amount"
            placeholder="自定义悬赏金额"
            :min="0"
            :max="1e8"
            :step="10"
          />
        </IFormItem>

        <Collapse>
          <IFormItem
            v-if="form.amount"
            prop="invite"
            label="邀请悬赏"
          >
            <IRadioGroup v-model="invite">
              <IRadio :label="1">是</IRadio>
              <IRadio :label="0">否</IRadio>
            </IRadioGroup>
          </IFormItem>
        </Collapse>

        <Collapse>
          <div v-if="form.amount && invite" class="invite-wrap">
            <IFormItem prop="expert" label="邀请回答">
              <Select
                v-model="invitations"
                filterable
                remote
                multiple
                :remote-method="searchUser"
                :loading="searchLock"
                placeholder="请选择推荐专家或搜索用户"
              >
                <Option
                  v-for="(expert, index) in experts"
                  :key="index"
                  :value="expert.id"
                  :label="expert.name"
                >
                  <span>{{ expert.name }}</span>
                  <small class="expert-info">{{ expert.extra.answers_count }}回答 {{ expert.extra.likes_count }}点赞</small>
                  <TagList
                    class="expert-tags"
                    :tags="expert.tags"
                    size="sm"
                  />
                </Option>
              </Select>
            </IFormItem>

            <IFormItem label="是否开启围观">
              <IRadioGroup v-model="form.look">
                <IRadio :label="1">是</IRadio>
                <IRadio :label="0">否</IRadio>
              </IRadioGroup>
            </IFormItem>
          </div>
        </Collapse>

        <IButton @click="step = 1">上一步</IButton>
        <IButton
          type="primary"
          :disabled="disabled"
          :loading="submitLock"
          @click="onSubmit"
        >
          发布问题
        </IButton>
      </div>
    </IForm>
  </div>
</template>

<script>
import xss from 'xss'
import { mapState, mapActions } from 'vuex'
import markdown from '@/utils/markdown'
import MarkdownEditor from '@/components/common/MarkdownEditor.vue'
import TagList from '@/components/tag/TagList.vue'

export default {
  name: 'QuestionCreate',
  components: {
    MarkdownEditor,
    TagList,
  },
  data () {
    return {
      form: {
        subject: '',
        body: '',
        anonymity: 0,
        look: 0,
        amount: 0,
      },
      selectedTopics: [],
      selectedAmount: 0,
      customAmount: null,
      invite: 0,
      recommendExperts: [],
      searchUsers: [],
      invitations: [],

      step: 1,
      searchLock: false,
      submitLock: false,
    }
  },
  computed: {
    ...mapState('question', {
      topics: 'topics',
    }),
    disabled () {
      switch (this.step) {
        case 1:
          return !this.selectedTopics.length || !this.form.subject
        case 2:
          if (!this.invite) return false
          return !this.invitations.length
      }
      return false
    },
    selectAmountItems () {
      const reward = this.boot.site.reward || {}
      return reward.amounts ? reward.amounts.split(',') : []
    },
    experts () {
      const list = this.searchUsers.length ? this.searchUsers : this.recommendExperts
      return list.filter(u => u.id !== this.logged.id)
    },
    validateModel () {
      switch (this.step) {
        case 1:
          return {
            subject: this.form.subject,
            topics: this.selectedTopics,
            body: this.form.body,
          }
        case 2:
          return {
            expert: this.invitations,
          }
      }
      return {}
    },
    validator () {
      switch (this.step) {
        case 1:
          return {
            subject: [
              { required: true, message: '请填写问题名称', trigger: 'blur' },
            ],
            topics: [
              { required: true, message: '请选择一个专题', trigger: 'blur' },
            ],
            body: [
              { required: true, message: '请填写问题描述', trigger: 'blur' },
            ],
          }
        case 2:
          return {
            expert: [
              { required: true, message: '需要选择邀请回答的人', trigger: 'blur' },
            ],
          }
      }
      return {}
    },
  },
  watch: {
    selectedAmount (val) {
      this.form.amount = val
      this.customAmount = null
    },
    customAmount (val) {
      this.form.amount = val
      this.selectedAmount = 0
    },
    step (val) {
      if (val === 2) this.getExpert()
    },
  },
  mounted () {
    this.getQuestionTopicList()
  },
  methods: {
    ...mapActions('question', {
      getQuestionTopicList: 'getQuestionTopicList',
    }),
    async onSubmit () {
      const form = {
        ...this.form,
        topics: this.selectedTopics.map(id => ({ id })),
        invitations: this.invitations.map(user => ({ user })),
      }
      form.subject = form.subject.replace(/[^?？]$/, '$&?') // 尾部添加空格
      if (this.form.amount > 0) {
        const password = await new Promise(resolve => {
          this.$root.$emit('password', password => resolve(password))
        })
        if (password === false) return
        form.password = password
        this.$root.$emit('password:close')
      }
      this.submitLock = true
      const { question } = await this.$axios.$post('/currency-questions', form)
        .finally(() => {
          this.submitLock = false
        })
      this.$Message.success('提问成功，正在跳转...')
      this.$destroy()
      this.$router.replace(`/question/${question.id}`)
    },
    async getExpert () {
      const topics = this.selectedTopics.join(',')
      const params = { topics }
      this.recommendExperts = await this.$axios.$get(`/question-experts`, { params })
    },
    async searchUser (keyword) {
      this.searchLock = true
      this.searchUsers = await this.$axios.$get('/user/search', { params: { keyword } })
        .finally(() => {
          this.searchLock = false
        })
    },
    showRule () {
      const rule = markdown(this.boot['Q&A'].reward_rule || '')
      this.$Modal.info({
        title: '悬赏规则',
        render: h => h('div', {
          class: 'markdown-body',
          domProps: {
            innerHTML: xss(rule),
          },
        }),
      })
    },
  },
}
</script>

<style lang="less" scoped>
.p-question-create {
  padding: 30px;
  background-color: #fff;

  h1 {
    margin-bottom: 16px;
  }

  .step2-title {
    display: flex;
    align-items: flex-end;
    margin-bottom: 16px;
    font-size: @font-size-large;

    .rule {
      margin-left: auto;
      font-size: @font-size-small;
      color: @disabled-color;
    }
  }

  .custom-amount {
    width: 10em;
  }

  .expert-info {
    margin-left: 1em;
    color: @disabled-color;
  }

  .expert-tags {
    display: inline-flex;
    margin-left: 1em;
    transform: scale(.8);
    transform-origin: left;

    /deep/ li {
      background-color: #fff;
      border-color: @border-color-base;
    }
  }
}
</style>
