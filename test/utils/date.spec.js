import test from 'ava'
import * as dateUtil from '../../utils/date'

test('fromNow', t => {
  const { fromNow } = dateUtil
  const now = new Date()

  const before1s = new Date() - 1 * 1000
  t.is(fromNow(before1s), '1分钟内', '1分钟内')

  const before13m = new Date() - 13 * 60 * 1000
  t.is(fromNow(before13m), '13分钟前', 'x分钟前')

  const before4h = new Date() - 4 * 60 * 60 * 1000
  t.is(fromNow(before4h), '4小时前', 'x小时前')

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12, 34, 56)
  t.is(fromNow(yesterday), '昨天 12:34', '昨天')

  const before3d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 12, 34, 56)
  t.is(fromNow(before3d), '3天前', 'x天前 (x < 9')

  const before45d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 45, 12, 34, 56)
  t.is(fromNow(before45d), `${before45d.getMonth() + 1}-${before45d.getDate()}`, 'x天前 (x > 9')

  const notTime = '不要解析我'
  t.is(fromNow(notTime), notTime, '不应该解析非时间文本')
})

test('isYesterday', t => {
  const { isYesterday } = dateUtil

  const yesterday = new Date() - 24 * 3600 * 1000
  t.true(isYesterday(yesterday))

  const today = new Date()
  t.false(isYesterday(today))
})

test('toZuluTimezone', t => {
  const { toZuluTimezone } = dateUtil

  const zulu = toZuluTimezone('2018-12-28 02:36:06')
  t.is(zulu, '2018-12-28T02:36:06Z', '转换错误')

  t.is(toZuluTimezone(0), 0, '数字不应该被转换')
})
