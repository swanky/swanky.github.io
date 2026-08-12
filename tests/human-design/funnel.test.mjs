import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (relativePath) => readFileSync(join(ROOT, relativePath), 'utf8');

const page = read('human-design/index.html');
const ui = read('assets/js/human-design/hd-ui.js');
const form = read('assets/js/human-design/hd-form.js');
const explore = read('explore/index.html');
const exploreCard = read('_includes/explore-card.html');
const services = read('_data/divination_services.yml');
const mbtiArticle = read('_posts/2025-08-31-mbti-software-management.md');

test('出生資料表單把非必要欄位收起，並提供四個不傳送地點的快捷選項', () => {
  assert.match(page, /<details class="hd-advanced">\s*<summary>時間是約略記錄？檢查前後誤差<\/summary>/);
  assert.match(page, /<details class="hd-form-extra" id="hd-name-extra">/);
  assert.equal([...page.matchAll(/data-hd-city-for="hd"/g)].length, 4);
  assert.match(page, /\.hd-city-chip \{[^}]*border-radius: 10px;/s);
  assert.match(form, /gtag\('event', 'hd_city_quick_pick'/);
  assert.doesNotMatch(form, /hd_city_quick_pick[^\n]*(city|cityLabel|tz):/);
});

test('跨頁入口都回到免費排盤，再由結果頁承接報告方案', () => {
  assert.match(explore, /source:'explore_feature',intent:'free_chart'/);
  assert.doesNotMatch(explore, /<article class="explore-hd-feature"[^>]*data-aos/);
  assert.match(exploreCard, /source:'explore_card'/);
  assert.match(mbtiArticle, /source:'article_mbti',intent:'free_chart'/);
  assert.match(services, /id: human-design-report[\s\S]*?route: \/human-design\/#hd-form/);
  assert.match(page, /免費結果已完整保留/);
  assert.match(page, /id="hd-result-report-cta"/);
  assert.match(page, /\.hd-result-offer \{[^}]*scroll-margin-top: 76px;/s);
});

test('後半段漏斗事件可分辨入口、表單、結果提案、預覽、付費與更新通知', () => {
  const sources = [page, ui, form, explore, exploreCard, mbtiArticle].join('\n');
  for (const eventName of [
    'hd_funnel_entry_click',
    'hd_form_started',
    'hd_form_validation_error',
    'hd_city_quick_pick',
    'hd_chart_generated',
    'hd_report_offer_viewed',
    'hd_report_preview_opened',
    'hd_report_cta',
    'hd_interest_contact',
  ]) {
    assert.match(sources, new RegExp(`['"]${eventName}['"]`), `缺少事件：${eventName}`);
  }
  assert.match(page, /hd_interest_contact'\,\{source:'result'/);
  assert.match(explore, /hd_interest_contact'\,\{source:'explore_feature'/);
});
