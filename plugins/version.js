import { version } from '../package'

// Exposed versions
export default function ({ store }) {
  /* eslint-disable no-console */
  console.info(
    `%cWelcome to Plus(ThinkSNS+)! Release %c Plus v${store.state.boot['server:version']} %c SSR Client v${version} `,
    'color: #00A9E0;',
    'background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
  )
  console.info(
    `%cDevelopment by SlimKit Group 👉 https://github.com/slimkit \nApache-2.0 Licensed | Copyright © ${new Date().getFullYear()} Chengdu ZhiYiChuangXiang Technology Co., Ltd. All rights reserved.`,
    'color: #00A9E0;'
  )
}
