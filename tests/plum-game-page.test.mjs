import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const page = readFileSync(join(root, 'games/plum/index.html'), 'utf8');
const css = readFileSync(join(root, 'assets/css/plum-experience.css'), 'utf8');
const selectedWorks = readFileSync(join(root, '_data/selected_works.yml'), 'utf8');

const publicVideoId = 'E8Lgyx0X_s4';
const ep02VideoId = 'NMFgHt9YgE8';
const ep03VideoId = 'pOcVepABSt8';

test('《梅香境》頁首提供公開影片入口', () => {
  assert.match(page, /class="button button-ghost" href="#ep01-film">觀看 EP01 至 EP03 影像<\/a>/);
});

test('首頁精選作品提供 EP01 導流但不重複嵌入播放器', () => {
  assert.match(selectedWorks, /- num: "07"/);
  assert.match(selectedWorks, /title: 《金瓶異夢：十二花界》文學影像首集/);
  assert.match(selectedWorks, /url: "\/games\/plum\/#ep01-film"/);
  assert.match(selectedWorks, /meta: GAME · LITERARY FILM · AI/);
  assert.doesNotMatch(selectedWorks, /youtube(?:-nocookie)?\.com\/embed/);
});

test('文學十部曲以隱私強化的 YouTube iframe 公開 EP01', () => {
  assert.match(page, /<section id="ep01-film" class="cycle-premiere reveal"/);
  assert.match(page, new RegExp(`https://www\\.youtube-nocookie\\.com/embed/${publicVideoId}`));
  assert.match(page, /title="《金瓶梅》影像十部曲 EP01〈簾下遇金蓮〉"/);
  assert.match(page, /loading="lazy"/);
  assert.match(page, /allowfullscreen/);
  assert.match(page, new RegExp(`https://youtu\\.be/${publicVideoId}`));
  assert.doesNotMatch(page, new RegExp(`${publicVideoId}[^\n]+autoplay=1`));
});

test('EP01 對外說明清楚區分文學影像與遊戲實機', () => {
  const section = page.match(/<section id="ep01-film"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /AI 生成影像與語音/);
  assert.match(section, /不是遊戲實機畫面/);
  // 2026-08-08：第二、三回改為連向 /jinpingmei/text/ 原文書房的超連結
  assert.match(section, /取材自《金瓶梅》<a href="\{\{ '\/jinpingmei\/text\/002\/' \| relative_url \}\}">第二回<\/a>/);
});

test('EP01 卡片標示首集已公開並連回播放器', () => {
  const card = page.match(/<article class="cycle-card cycle-card-released reveal">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(card, /<span>EP01<\/span>/);
  assert.match(card, /首集已公開/);
  assert.match(card, /href="#ep01-film"/);
});

test('EP02 以隱私強化的 YouTube iframe 公開並連回播放器', () => {
  assert.match(page, /<section id="ep02-film" class="cycle-premiere reveal"/);
  assert.match(page, new RegExp(`https://www\\.youtube-nocookie\\.com/embed/${ep02VideoId}`));
  assert.match(page, /title="《金瓶梅》影像十部曲 EP02〈隔牆瓶兒〉"/);
  assert.match(page, new RegExp(`https://youtu\\.be/${ep02VideoId}`));
  const cards = page.match(/<article class="cycle-card cycle-card-released reveal">[\s\S]*?<\/article>/g) ?? [];
  const ep02Card = cards.find((c) => c.includes('<span>EP02</span>')) ?? '';
  assert.match(ep02Card, /第二集已公開/);
  assert.match(ep02Card, /href="#ep02-film"/);
});

test('EP03 以隱私強化的 YouTube iframe 公開並連回播放器', () => {
  assert.match(page, /<section id="ep03-film" class="cycle-premiere reveal"/);
  assert.match(page, new RegExp(`https://www\\.youtube-nocookie\\.com/embed/${ep03VideoId}`));
  assert.match(page, /title="《金瓶梅》影像十部曲 EP03〈燈樓群芳〉"/);
  assert.match(page, new RegExp(`https://youtu\\.be/${ep03VideoId}`));
  const section = page.match(/<section id="ep03-film"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /AI 生成影像與語音/);
  assert.match(section, /不是遊戲實機畫面/);
  assert.match(section, /取材自《金瓶梅》<a href="\{\{ '\/jinpingmei\/text\/015\/' \| relative_url \}\}">第十五回<\/a>/);
  const cards = page.match(/<article class="cycle-card cycle-card-released reveal">[\s\S]*?<\/article>/g) ?? [];
  const ep03Card = cards.find((c) => c.includes('<span>EP03</span>')) ?? '';
  assert.match(ep03Card, /第三集已公開/);
  assert.match(ep03Card, /href="#ep03-film"/);
});

test('EP01 播放器維持 16:9 並在窄螢幕改為單欄', () => {
  assert.match(css, /\.cycle-premiere-player iframe\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.cycle-premiere\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
